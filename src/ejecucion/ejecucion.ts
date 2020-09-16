import { Errores } from '../arbol/errores';
import { Error } from '../arbol/error';
import { Salida } from '../arbol/salida';
import { Entorno } from './entorno';
import { Id } from './expresiones/id';
import { Nativo } from './expresiones/nativo';
import { Instruccion } from './instruccion';
import { DecId } from './instrucciones/declaraciones/dec_id';
import { DecIdExp } from './instrucciones/declaraciones/dec_id_exp';
import { Log } from './instrucciones/log';
import { TIPO_DATO } from './tipo';
import { Suma } from './expresiones/aritmeticas/suma';
import { DecType } from './instrucciones/declaraciones/dec_type';
import { Type } from './expresiones/type';
import { Asignacion } from './instrucciones/asignaciones/asignacion';
import { Arreglo } from './expresiones/arreglo';
import { AccesoArregloSimple } from './expresiones/acceso_arreglo_simple';

export class Ejecucion {
  raiz: Object;
  contador: number;
  dot: string;

  constructor(raiz: Object) {
    Object.assign(this, { raiz, contador: 0, dot: '' });
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
      this.dot += `node${idPadre}[label="${this.getStringValue(nodo.label)}"];\n`;
      if (nodo.hasOwnProperty("hijos")) {
        nodo.hijos.forEach((nodoHijo: any) => {
          let idHijo = ++this.contador;
          this.dot += `node${idPadre} -> node${idHijo};\n`;
          if (nodoHijo instanceof Object) {
            this.generacionDot(nodoHijo);
          } else {
            this.dot += `node${idHijo}[label="${this.getStringValue(nodoHijo)}"];`;
          }
        });
      }
    }
  }

  getStringValue(label: string): string {
    if (label.startsWith("\"") || label.startsWith("'") || label.startsWith("`")) {
      return label.substr(1, label.length - 2);
    }
    return label;
  }

  ejecutar(): void {
    const instrucciones = this.recorrer(this.raiz);
    if (instrucciones instanceof Array) {
      //Entorno global, limpieza de errores y limpieza de la salida
      const entorno = new Entorno();
      Errores.getInstance().clear();
      Salida.getInstance().clear();

      instrucciones.forEach(element => {
        if (element instanceof Instruccion) {
          try {
            element.ejecutar(entorno);
          } catch (error) {

          }
        }
      });

    }
  }

  getSalida(): String[] {
    return Salida.getInstance().lista;
  }

  imprimirErrores(): void {
    if (Errores.getInstance().hasErrors()) {
      Errores.getInstance().getErrors().forEach((error: Error) => {
        console.log(error.descripcion);
      });
    }
  }

  recorrer(nodo: any): any {
    //S
    if (this.soyNodo('S', nodo)) {
      return this.recorrer(nodo.hijos[0]);
    }

    //INSTRUCCIONES
    if (this.soyNodo('INSTRUCCIONES', nodo)) {
      let instrucciones = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        const inst = this.recorrer(nodoHijo);
        if (inst instanceof Array) {
          instrucciones = instrucciones.concat(inst);
        }
        else {
          instrucciones.push(inst);
        }
      });
      return instrucciones;
    }

    //DECLARACION_VARIABLE
    if (this.soyNodo('DECLARACION_VARIABLE', nodo)) {
      //TIPO_DEC_VARIABLE LISTA_DECLARACIONES punto_coma
      const reasignable = this.recorrer(nodo.hijos[0]) as boolean;
      const lista_declaraciones = this.recorrer(nodo.hijos[1]) as Array<Object>;
      const lista_instrucciones = [];
      lista_declaraciones.forEach((item: Object) => {
        const keys = Object.keys(item);
        const linea = nodo.linea;
        const id = item['id'];
        //{id}
        if (keys.length == 1) {
          lista_instrucciones.push(new DecId(linea, reasignable, id));
        }
        //{id, exp}
        else if (keys.length == 2) {
          const exp = item['exp'];
          lista_instrucciones.push(new DecIdExp(linea, reasignable, id, exp));
        }
        //{id, tipo, type_generador?}
        else if (keys.length == 3) {

        }
      })
      return lista_instrucciones;
    }

    //LISTA_DECLARACIONES
    if (this.soyNodo('LISTA_DECLARACIONES', nodo)) {
      const lista_declaraciones = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        lista_declaraciones.push(this.recorrer(nodoHijo));
      });
      return lista_declaraciones;
    }

    //LISTA_EXPRESIONES
    if (this.soyNodo('LISTA_EXPRESIONES', nodo)) {
      //EXP coma EXP...
      const lista = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          const exp = this.recorrer(nodoHijo);
          lista.push(exp);
        }
      });
      return lista;
    }

    //DEC_ID
    if (this.soyNodo('DEC_ID', nodo)) {
      //id
      return { id: nodo.hijos[0] };
    }

    // DEC_ID_TIPO
    if (this.soyNodo('DEC_ID_TIPO', nodo)) {
      // id dos_puntos TIPO_VARIABLE_NATIVA
      const tipo_var_nat = this.recorrer(nodo.hijos[2]) as Object;
      return { id: nodo.hijos[0], ...tipo_var_nat }
    }

    //DEC_ID_EXP
    if (this.soyNodo('DEC_ID_EXP', nodo)) {
      //id igual EXP
      const id = nodo.hijos[0] as string;
      const exp = this.recorrer(nodo.hijos[2]) as Object;
      return { id, exp };
    }

    //TIPO_DEC_VARIABLE
    if (this.soyNodo('TIPO_DEC_VARIABLE', nodo)) {
      //let || const
      return nodo.hijos[0] == 'let';
    }

    //TIPO_VARIABLE_NATIVA
    if (this.soyNodo('TIPO_VARIABLE_NATIVA', nodo)) {
      if (nodo.hijos[0] == 'string') {
        return { tipo: TIPO_DATO.STRING };
      }
      if (nodo.hijos[0] == 'number') {
        return { tipo: TIPO_DATO.NUMBER };
      }
      if (nodo.hijos[0] == 'boolean') {
        return { tipo: TIPO_DATO.BOOLEAN };
      }
      if (nodo.hijos[0] == 'void') {
        return { tipo: TIPO_DATO.VOID };
      }
      return { tipo: TIPO_DATO.TYPE, type_generador: this.recorrer(nodo.hijos[0]) }
    }

    //ID
    if (this.soyNodo('ID', nodo)) {
      return nodo.hijos[0];
    }

    //EXP
    if (this.soyNodo('EXP', nodo)) {
      switch (nodo.hijos.length) {
        case 1:
          {
            const exp = this.recorrer(nodo.hijos[0]);;
            //Si es un string es una llamada a un id de variable
            if (typeof exp == 'string') return new Id(nodo.linea, exp.toString());

            //Si es un objeto
            if (exp instanceof Object) return exp;
          }
        case 2:
          //cor_izq cor_der
          if (nodo.hijos[0] == '[' && nodo.hijos[1] == ']') {
            return new Arreglo(nodo.linea);
          }
        case 3:
          //EXP mas EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Suma(linea, expIzq, expDer);
          }

          //cor_izq LISTA_EXPRESIONES cor_der
          if(nodo.hijos[0] == '[' && this.soyNodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == ']'){
            const lista_expresiones = this.recorrer(nodo.hijos[1]);
            return new Arreglo(nodo.linea, lista_expresiones);
          }
      }
    }

    //NUMBER
    if (this.soyNodo('NUMBER', nodo)) {
      const str_num = nodo.hijos[0];
      return new Nativo(nodo.linea, Number(str_num));
    }

    //STRING
    if (this.soyNodo('STRING', nodo)) {
      const str = nodo.hijos[0] as string;
      const str2 = str.substr(1, str.length - 2);
      return new Nativo(nodo.linea, str2);
    }

    // BOOLEAN
    if (this.soyNodo('BOOLEAN', nodo)) {
      if (nodo.hijos[0] == 'true') {
        return new Nativo(nodo.linea, true);
      }
      return new Nativo(nodo.linea, false);
    }

    //NULL
    if (this.soyNodo('NULL', nodo)) {
      return new Nativo(nodo.linea, null);
    }

    //CONSOLE_LOG
    if (this.soyNodo('CONSOLE_LOG', nodo)) {
      //console punto log par_izq LISTA_EXPRESIONES par_der punto_coma
      const lista = this.recorrer(nodo.hijos[4]) as Array<Instruccion>;
      return new Log(nodo.linea, lista);
    }

    // ATRIBUTO
    if (this.soyNodo('ATRIBUTO', nodo)) {
      // id dos_puntos TIPO_VARIABLE_NATIVA
      // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
      const id = nodo.hijos[0];
      const tipo = this.recorrer(nodo.hijos[2]) as Object;
      const atributo = { id, ...tipo };
      if (nodo.hijos.length == 4 && this.soyNodo('LISTA_CORCHETES', nodo.hijos[3])) {
        atributo['corchetes'] = this.recorrer(nodo.hijos[3]) as Number;
      }
      return atributo; //{id, tipo, type_generador?, corchetes?}
    }

    //LISTA_CORCHETES
    if (this.soyNodo('LISTA_CORCHETES', nodo)) {
      let size = 0;
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo == '[]') size++;
      });
      return size;
    }

    //LISTA_ATRIBUTOS
    if (this.soyNodo('LISTA_ATRIBUTOS', nodo)) {
      const lista_atributos: Object[] = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          lista_atributos.push(this.recorrer(nodoHijo));
        }
      });
      return lista_atributos; //{id, tipo, type_generador?, corchetes?}
    }

    //DECLARACION_TYPE
    if (this.soyNodo('DECLARACION_TYPE', nodo)) {
      // type id igual llave_izq LISTA_ATRIBUTOS llave_der
      const id = nodo.hijos[1];
      const lista_atributos = this.recorrer(nodo.hijos[4]) as Array<Object>;
      //cada atributo = {id, tipo, type_generador?, corchetes?}
      return new DecType(nodo.linea, id, lista_atributos);
    }

    //LISTA_ACCESOS_ARREGLO
    if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo)) {
      //Regreso una lista de EXP donde cada una representa un acceso al arreglo
      const lista: Instruccion[] = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          const exp = this.recorrer(nodoHijo);
          if (exp instanceof Instruccion) {
            lista.push(exp);
          }
        }
      });
      return lista; // [EXP]
    }

    //LISTA_ACCESOS_TYPE
    if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo)) {
      const lista: Array<Object | String> = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        //Si es un objeto
        if (nodoHijo instanceof Object) {
          const res = this.recorrer(nodoHijo);
          lista.push(res);
        }
        //Si no es un objeto lo agrego solo si es diferente al punto
        if (typeof nodoHijo == 'string' && nodoHijo != '.') {
          lista.push(nodoHijo);
        }
      });
      return lista; //[id | [EXP]]
    }

    //TIPO_IGUAL
    if (this.soyNodo('TIPO_IGUAL', nodo)) {
      switch (nodo.hijos.length) {
        case 1:
          return '=';
        case 2:
          if (nodo.hijos[0] == '+') return '+=';
          if (nodo.hijos[0] == '-') return '-=';
      }
    }

    //ASIGNACION
    if (this.soyNodo('ASIGNACION', nodo)) {
      switch (nodo.hijos.length) {
        // id LISTA_ACCESOS_TYPE TIPO_IGUAL EXP punto_coma
        case 5: {
          const id = nodo.hijos[0];
          const lista = this.recorrer(nodo.hijos[1]);
          const tipo_igual = this.recorrer(nodo.hijos[2]);
          const exp = this.recorrer(nodo.hijos[3]);

          /*******************************************
           *
           *
           * PENDIENTE TERMINAR PORQUE VOY A HACER PRIMERO LA ASIGNACION SIMPLE DEL TYPE
           *
           * *****************************************
           */
        }
        case 4: {
          //ACCESO_ARREGLO TIPO_IGUAL EXP punto_coma
          if (this.soyNodo('ACCESO_ARREGLO', nodo.hijos[0])) {

          }
          //id TIPO_IGUAL EXP punto_coma
          if (typeof nodo.hijos[0] == 'string') {
            const id = nodo.hijos[0];
            const tipo_igual = this.recorrer(nodo.hijos[1]);
            const exp = this.recorrer(nodo.hijos[2]);

            return new Asignacion(nodo.linea, id, tipo_igual, exp);
          }
        }
      }
    }

    //ATRIBUTO_TYPE
    if (this.soyNodo('ATRIBUTO_TYPE', nodo)) {
      //id dos_puntos EXP
      const id = nodo.hijos[0];
      const exp = this.recorrer(nodo.hijos[2]);
      return { id, exp };
    }

    //ATRIBUTOS_TYPE
    if (this.soyNodo('ATRIBUTOS_TYPE', nodo)) {
      //ATRIBUTO_TYPE coma ATRIBUTO_TYPE....
      const atributos: Array<Object> = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          const res = this.recorrer(nodoHijo);
          atributos.push(res);
        }
      });
      return atributos; //[{id, exp}]
    }

    //TYPE
    if (this.soyNodo('TYPE', nodo)) {
      //llave_izq ATRIBUTOS_TYPE llave_der
      const lista_atributos = this.recorrer(nodo.hijos[1]);
      return new Type(nodo.linea, lista_atributos);
    }

    //ACCESO_ARREGLO
    if (this.soyNodo('ACCESO_ARREGLO', nodo)){
      //id LISTA_ACCESOS_ARREGLO
      const id = nodo.hijos[0];
      const lista_accesos_arreglo = this.recorrer(nodo.hijos[1]);
      return new AccesoArregloSimple(nodo.linea, id, lista_accesos_arreglo);
    }

    //ACCESO_TYPE
    if(this.soyNodo('ACCESO_TYPE', nodo)){
      //id LISTA_ACCESOS_TYPE
      const id = nodo.hijos[0];
      //[id | [EXP]]
      const lista_accesos_type = this.recorrer(nodo.hijos[1]);

    }



  }

  /**
   * Funcion para determinar en que tipo de nodo estoy
   * @param label
   * @param nodo
   */
  soyNodo(label: string, nodo: any): boolean {
    if (nodo == null || !(nodo instanceof Object)) {
      return false;
    }
    if (nodo.hasOwnProperty('label') && nodo.label != null) {
      return nodo.label === label;
    }
    return false;
  }
}
