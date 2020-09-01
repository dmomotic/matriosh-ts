import { Entorno } from './entorno';
import { Variable } from './variable';
import { TIPOS } from './tipos';
import { Error } from '../arbol/error';
import { Errores } from './errores';

export class Traduccion {
  raiz: Object;
  codigo: string;
  contador: number;
  dot: string;

  constructor(raiz: Object) {
    this.raiz = raiz;
    this.codigo = '';
    this.contador = 0;
    this.dot = '';
  }

  getDot(): string {
    this.contador = 0;
    this.dot = "digraph G {\n";
    if (this.raiz != null) {
      this.generacionDot(this.raiz);
    }
    this.dot += "\n}";
    return this.dot;
  }

  generacionDot(nodo: any): void {
    if (nodo instanceof Object) {
      let idPadre = this.contador;
      this.dot += `node${idPadre}[label="${nodo.label}"];\n`;
      if (nodo.hasOwnProperty("hijos")) {
        nodo.hijos.forEach((nodoHijo: any) => {
          let idHijo = ++this.contador;
          this.dot += `node${idPadre} -> node${idHijo};\n`;
          if (nodoHijo instanceof Object) {
            this.generacionDot(nodoHijo);
          } else {
            this.dot += `node${idHijo}[label="${nodoHijo}"];`;
          }
        });
      }
    }
  }

  traducir(): string {
    this.codigo = '';
    let entorno = new Entorno();
    this.recorrer(this.raiz, entorno);
    return this.codigo;
  }

  recorrer(nodo: any, e: Entorno): void {
    if (this.esNodo('S', nodo)) {
      nodo.hijos.forEach((item: object) => {
        this.recorrer(item, e);
      });
    }

    if (this.esNodo('INSTRUCCIONES', nodo)) {
      nodo.hijos.forEach((item: object) => {
        this.recorrer(item, e);
      });
    }

    if (this.esNodo('DECLARACION_VARIABLE', nodo)) {
      switch (nodo.hijos.length) {
        case 3:
          //TIPO_DEC_VARIABLE id punto_coma
          const tipo = this.getValorDeNodo(nodo.hijos[0]);
          //Si es tipo const es un error ya que debe estar inicializado
          Errores.getInstance().push(new Error({ tipo: 'semantico', linea: nodo.linea, descripcion: 'Las constantes deben ser declaradas con un valor inicial' }));
          const id = nodo.hijos[1];
          const reasignable = tipo === 'let' ? true : false;
          //Si fue declarada dentro de una funcion
          if (e.generadoPorFuncion()) {
            const variable = new Variable({ id, tipo: TIPOS.SIN_ASIGNAR, reasignable });
            variable.setIdNuevo(this.getIdNuevo(e, id));
            e.setVariable(variable);
            this.codigo += `\n${tipo} ${variable.getIdNuevo()};`;
          }
          //Si no fue declarada dentro de una funcion
          else {
            e.setVariable(new Variable({ id, tipo: TIPOS.SIN_ASIGNAR, reasignable }));
            this.codigo += `\n${tipo} ${id};`;
          }
          break;
        case 5:
          //TIPO_DEC_VARIABLE id igual EXP punto_coma
          if (this.esNodo('TIPO_DEC_VARIABLE', nodo.hijos[0]) && this.esNodo('EXP', nodo.hijos[3])) {
            const tipo = this.getValorDeNodo(nodo.hijos[0]);
            const id = nodo.hijos[1];
            const reasignable = tipo === 'let' ? true : false;
            //Si fue declarada dentro de una funcion
            if (e.generadoPorFuncion()) {
              //TODO: Debo obtener el tipo de la expresion para asignarlo aqui
              const variable = new Variable({ id, tipo: TIPOS.SIN_ASIGNAR, reasignable });
              variable.setIdNuevo(this.getIdNuevo(e, id));
              e.setVariable(variable);
              this.codigo += `\n${tipo} ${variable.getIdNuevo()} = `;
              this.recorrer(nodo.hijos[3], e);
              this.codigo += ';';
            }
            //Si no fue declarada dentro de una funcion
            else {
              //TODO: Debo obtener el tipo de la expresion para asignarlo aqui
              e.setVariable(new Variable({ id, tipo: TIPOS.SIN_ASIGNAR, reasignable }));
              this.codigo += `\n${tipo} ${id} = `;
              this.recorrer(nodo.hijos[3], e);
              this.codigo += ';';
            }

          }
          break;
      }
    }

    if (this.esNodo('DECLARACION_FUNCION', nodo)) {
      switch (nodo.hijos.length) {
        case 9:
          //function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
          const id = nodo.hijos[1];
          let en: Entorno;
          const tipo = this.getValorDeNodo(nodo.hijos[5]);
          const instrucciones = nodo.hijos[7];
          //Si tengo funciones anidadas
          if (this.tengoFuncionAnidada(instrucciones)) {
            en = new Entorno(e, id);
          }
          //Si no tengo funciones anidadas
          else {
            en = new Entorno(e);
          }
          this.codigo += `\nfunction ${id} () : ${tipo} {`;
          //Hago el primer recorrido donde no incluyo las funciones
          if (instrucciones instanceof Object) {
            instrucciones.hijos.forEach((item: any) => {
              if (!this.esNodo('DECLARACION_FUNCION', item)) {
                this.recorrer(item, en);
              }
            });
          }
          this.codigo += `\n}`;
          //Hago el segundo recorrido para la extracción de las funciones anidadas
          if (instrucciones instanceof Object) {
            instrucciones.hijos.forEach((item: any) => {
              if (this.esNodo('DECLARACION_FUNCION', item)) {
                this.recorrer(item, en);
              }
            });
          }
          break;
      }
    }

    if (this.esNodo('EXP', nodo)) {
      switch (nodo.hijos.length) {
        case 1:
          //number, string, id
          this.recorrer(nodo.hijos[0], e);
          break;
        case 3:
          // EXP mas EXP
          if (nodo.hijos[1] == '+') {
            this.recorrer(nodo.hijos[0], e);
            this.codigo += '+ ';
            this.recorrer(nodo.hijos[2], e);
          }
          break;
      }
    }

    if (this.esNodo('ID', nodo)) {
      const id = nodo.hijos[0];
      const variable = e.getVariable(id);

      //Si se encontro la variable
      if (variable) {
        this.codigo += `${variable.getIdNuevo()} `;
      }
      //Si no se encontro la variable
      else {
        //TODO: asignar error
        this.codigo += 'id ';
      }
    }
  }

  /**
   * Funcion para determinar en que tipo de nodo estoy
   * @param label
   * @param nodo
   */
  esNodo(label: string, nodo: any): boolean {
    if (nodo == null || !(nodo instanceof Object)) {
      return false;
    }
    if (nodo.hasOwnProperty('label') && nodo.label != null) {
      return nodo.label === label;
    }
    return false;
  }

  /**
   * Recibe un nodo y retorna el valor de su hijo
   * @param nodo
   */
  getValorDeNodo(nodo: any): string {
    if (nodo == null || !(nodo instanceof Object)) return '';
    if (nodo.hasOwnProperty('hijos') && nodo.hijos instanceof Array && nodo.hijos[0] != null) return nodo.hijos[0];
    return '';
  }

  /**
   * Funcion que retorna un string con el nuevo nombre para la variable
   * @param e
   * @param id
   */
  getIdNuevo(e: Entorno, id: string): string {
    return `nv_${e.getNombreFuncionGeneradora()}_${id}`;
  }

  /**
   * Recibe un nodo INSTRUCCIONES y retorna true si alguno de sus hijos es una DECLARACION_FUNCION
   * @param nodo
   */
  tengoFuncionAnidada(nodo: any) {
    if (!(nodo instanceof Object)) return false;
    return nodo.hijos.some((item: any) => item.label == 'DECLARACION_FUNCION');
  }
}
