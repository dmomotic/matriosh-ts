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
    let entorno = new Entorno();
    this.codigo = this.recorrer(this.raiz, entorno);
    return this.codigo;
  }

  recorrer(nodo: any, e: Entorno): any {

    //S
    if (this.soyNodo('S', nodo)) {
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any) => {
        codigoAux += this.recorrer(nodoHijo, e);
      });
      return codigoAux;
    }

    //INSTRUCCIONES
    else if (this.soyNodo('INSTRUCCIONES', nodo)) {
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any, index: number) => {
        codigoAux += `${this.recorrer(nodoHijo, e)}\n`;
      });
      return codigoAux;
    }

    //DECLARACION_FUNCION
    else if (this.soyNodo('DECLARACION_FUNCION', nodo)) {
      switch (nodo.hijos.length) {
        // function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
        case 9:
          // function test() : TIPO { INSTRUCCIONES }
          {
            const id = nodo.hijos[1];
            const tipo = this.recorrer(nodo.hijos[5], e);

            //TODO: agregarla a la TS y hacer verificacion de errores

            let codigoAux = `${nodo.hijos[0]} ${id}() : ${tipo} {\n`;
            //Si no tiene funciones anidadas
            if (!this.tengoFuncionAnidada(nodo.hijos[7])) {
              codigoAux += this.recorrer(nodo.hijos[7], new Entorno(e));
              codigoAux += `}\n\n`;
            }
            //Si tiene funcion anidada
            else {
              //Realizo el primer recorrido para todas las instrucciones distintas de DECLARACION_FUNCION
              const entorno = new Entorno(e, id);
              nodo.hijos[7].hijos.forEach((nodoHijo: any) => {
                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
              codigoAux += `}\n\n`;

              //Realizo el recorrido para las funciones anidadas
              nodo.hijos[7].hijos.forEach((nodoHijo: any) => {
                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
            }
            return codigoAux;
          }
        // function id par_izq par_der llave_izq INSTRUCCIONES llave_der
        case 7:
          // function test() { INSTRUCCIONES }
          {
            const id = nodo.hijos[1];
            //TODO: agregarla a la TS y hacer verificacion de errores

            let codigoAux = `${nodo.hijos[0]} ${id}(){\n`;
            //Si no tiene funciones anidadas
            if (!this.tengoFuncionAnidada(nodo.hijos[5])) {
              codigoAux += this.recorrer(nodo.hijos[5], new Entorno(e));
              codigoAux += `}\n\n`;
            }
            //Si tiene funcion anidada
            else {
              //Realizo el primer recorrido para todas las instrucciones distintas de DECLARACION_FUNCION
              const entorno = new Entorno(e, id);
              nodo.hijos[5].hijos.forEach((nodoHijo: any) => {
                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
              codigoAux += `}\n\n`;

              //Realizo el recorrido para las funciones anidadas
              nodo.hijos[5].hijos.forEach((nodoHijo: any) => {
                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
            }
            return codigoAux;
          }
        // function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
        case 10:
          // function test ( LISTA_PARAMETROS ) : TIPO { INSTRUCCIONES }
          {
            const id = nodo.hijos[1];
            const lista_parametros = this.recorrer(nodo.hijos[3], e);
            const tipo = this.recorrer(nodo.hijos[6], e);

            //TODO: agregarla a la TS y hacer verificacion de errores

            let codigoAux = `${nodo.hijos[0]} ${id}(${lista_parametros}) : ${tipo} {\n`;
            //Si no tiene funciones anidadas
            if (!this.tengoFuncionAnidada(nodo.hijos[8])) {
              codigoAux += this.recorrer(nodo.hijos[8], new Entorno(e));
              codigoAux += `}\n\n`;
            }
            //Si tiene funcion anidada
            else {
              //Realizo el primer recorrido para todas las instrucciones distintas de DECLARACION_FUNCION
              const entorno = new Entorno(e, id);
              nodo.hijos[8].hijos.forEach((nodoHijo: any) => {
                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
              codigoAux += `}\n\n`;

              //Realizo el recorrido para las funciones anidadas
              nodo.hijos[8].hijos.forEach((nodoHijo: any) => {
                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
            }
            return codigoAux;
          }
        // function id par_izq LISTA_PARAMETROS par_der llave_izq INSTRUCCIONES llave_der
        case 8:
          // function test ( LISTA_PARAMETROS ) { INSTRUCCIONES }
          {
            const id = nodo.hijos[1];
            const lista_parametros = this.recorrer(nodo.hijos[3], e);

            //TODO: agregarla a la TS y hacer verificacion de errores
            let codigoAux = `${nodo.hijos[0]} ${id}(${lista_parametros}){\n`;
            //Si no tiene funciones anidadas
            if (!this.tengoFuncionAnidada(nodo.hijos[6])) {
              codigoAux += this.recorrer(nodo.hijos[6], new Entorno(e));
              codigoAux += `}\n\n`;
            }
            //Si tiene funcion anidada
            else {
              //Realizo el primer recorrido para todas las instrucciones distintas de DECLARACION_FUNCION
              const entorno = new Entorno(e, id);
              nodo.hijos[6].hijos.forEach((nodoHijo: any) => {
                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
              codigoAux += `}\n\n`;

              //Realizo el recorrido para las funciones anidadas
              nodo.hijos[6].hijos.forEach((nodoHijo: any) => {
                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                  codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                }
              });
            }
            return codigoAux;
          }
      }
    }

    //DECLARACION_TYPE
    else if (this.soyNodo('DECLARACION_TYPE', nodo)) {
      switch (nodo.hijos.length) {
        // type id igual llave_izq LISTA_ATRIBUTOS llave_der
        case 6:
          const id = nodo.hijos[1];
          const lista_atributos = this.recorrer(nodo.hijos[4], e);
          let codigoAux = `type ${id} = {\n${lista_atributos}\n}\n`;
          return codigoAux;
      }
    }

    //ASIGNACION
    else if (this.soyNodo('ASIGNACION', nodo)) {
      switch (nodo.hijos.length) {
        case 4:
          {
            //ACCESO_ARREGLO TIPO_IGUAL EXP punto_coma
            if (this.soyNodo('ACCESO_ARREGLO', nodo.hijos[0])) {
              const acceso_arreglo = this.recorrer(nodo.hijos[0], e);
              const igual = this.recorrer(nodo.hijos[1], e);
              const exp = this.recorrer(nodo.hijos[2], e);
              return `${acceso_arreglo} ${igual} ${exp};`;
            }
            //id TIPO_IGUAL EXP punto_coma
            else {
              const id = nodo.hijos[0];
              const igual = this.recorrer(nodo.hijos[1], e);
              const exp = this.recorrer(nodo.hijos[2], e);

              //TODO: validacion de error
              const variable = e.getVariable(id);
              if (variable) {
                let codigoAux = `${variable.getIdNuevo()} ${igual} ${exp};`;
                return codigoAux;
              } else {
                let codigoAux = `${id} ${igual} ${exp};`;
                return codigoAux;
              }
            }
          }
        //id LISTA_ACCESOS_TYPE TIPO_IGUAL EXP punto_coma
        case 5: {
          // type.accesos = EXP ; || type.accesos[][] = EXP;
          const id = nodo.hijos[0];
          const lista_accesos_type = this.recorrer(nodo.hijos[1], e);
          const igual = this.recorrer(nodo.hijos[2], e);
          const exp = this.recorrer(nodo.hijos[3], e);
          //TODO: validacion de error
          const variable = e.getVariable(id);
          if (variable) {
            return `${variable.getIdNuevo()}${lista_accesos_type} ${igual} ${exp};`;
          }
          return `${id}${lista_accesos_type} ${igual} ${exp};`;
        }
      }
    }

    //PUSH_ARREGLO
    else if (this.soyNodo('PUSH_ARREGLO', nodo)) {
      switch (nodo.hijos.length) {
        // id punto push par_izq EXP par_der punto_coma
        case 7:
          {
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[4], e);
            //TODO: validar errores
            const variable = e.getVariable(id);
            if (variable) {
              return `${variable.getIdNuevo()}.push(${exp});`;
            }
            return `${id}.push(${exp});`;
          }
        //id LISTA_ACCESOS_TYPE punto push par_izq EXP par_der punto_coma
        case 8:
          {
            const id = nodo.hijos[0];
            const lista_accesos = this.recorrer(nodo.hijos[1], e)

            const exp = this.recorrer(nodo.hijos[5], e);
            //TODO: validar errores
            const variable = e.getVariable(id);
            if (variable) {
              return `${variable.getIdNuevo()}${lista_accesos}.push(${exp});`;
            }
            return `${id}${lista_accesos}.push(${exp});`;
          }
      }
    }

    //CONSOLE_LOG
    else if (this.soyNodo('CONSOLE_LOG', nodo)) {
      //console punto log par_izq LISTA_EXPRESIONES par_der punto_coma
      const lista_exp = this.recorrer(nodo.hijos[4], e);
      return `console.log(${lista_exp});`;
    }

    //INSTRUCCION_IF
    else if (this.soyNodo('INSTRUCCION_IF', nodo)) {
      switch (nodo.hijos.length) {
        //IF
        case 1:
          return this.recorrer(nodo.hijos[0], e);
        //IF ELSE | IF LISTA_ELSE_IF
        case 2:
          return this.recorrer(nodo.hijos[0], e) + this.recorrer(nodo.hijos[1], e);
      }
    }

    //IF
    else if (this.soyNodo('IF', nodo)) {
      //if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
      const exp = this.recorrer(nodo.hijos[2], nodo);
      const entorno = new Entorno(e);
      const instrucciones = this.recorrer(nodo.hijos[5], entorno);
      return `if(${exp}){\n${instrucciones}\n}`;
    }

    //ELSE
    else if (this.soyNodo('ELSE', nodo)) {
      //else llave_izq INSTRUCCIONES llave_der
      const entorno = new Entorno(e);
      const instrucciones = this.recorrer(nodo.hijos[2], entorno);
      return `else{\n${instrucciones}\n}`;
    }

    else if(this.soyNodo('LISTA_ELSE_IF', nodo)){
/*************************** */
    }

    //ACCESO_ARREGLO
    else if (this.soyNodo('ACCESO_ARREGLO', nodo)) {
      // id LISTA_ACCESOS_ARREGLO
      const id = nodo.hijos[0];
      const lista_accesos = this.recorrer(nodo.hijos[1], e);
      //TODO: validacion de error
      const variable = e.getVariable(id);
      if (variable) {
        return `${variable.getIdNuevo()}${lista_accesos}`;
      }
      return `${id}${lista_accesos}`;
    }

    //LISTA_ACCESOS_TYPE
    else if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo)) {
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          codigoAux += this.recorrer(nodoHijo, e);
        } else {
          codigoAux += nodoHijo;
        }
      });
      return codigoAux;
    }

    //LISTA_ACCESOS_ARREGLO
    else if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo)) {
      //cor_izq EXP cor_der .....
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          codigoAux += this.recorrer(nodoHijo, e);
        } else {
          codigoAux += nodoHijo;
        }
      });
      return codigoAux;
    }

    //TIPO_IGUAL
    else if (this.soyNodo('TIPO_IGUAL', nodo)) {
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any) => {
        codigoAux += `${nodoHijo}`;
      });
      return codigoAux;
    }

    //TIPO_VARIABLE_NATIVA
    else if (this.soyNodo('TIPO_VARIABLE_NATIVA', nodo)) {
      if (this.soyNodo('ID', nodo.hijos[0])) {
        return this.recorrer(nodo.hijos[0], e);
      }
      return nodo.hijos[0];
    }

    // TIPO_DEC_VARIABLE
    else if (this.soyNodo('TIPO_DEC_VARIABLE', nodo)) {
      return nodo.hijos[0];
    }

    //DECLARACION_VARIABLE
    else if (this.soyNodo('DECLARACION_VARIABLE', nodo)) {
      let codigoAux = '';
      switch (nodo.hijos.length) {
        //TIPO_DEC_VARIABLE LISTA_DECLARACIONES punto_coma
        case 3:
          const tipo_let_const = this.recorrer(nodo.hijos[0], e);
          const reasignable = tipo_let_const == 'const' ? false : true;
          codigoAux += `${tipo_let_const} `;
          // {id, tipo, corchetes, exp}
          const declaraciones = this.recorrer(nodo.hijos[1], e);
          declaraciones.forEach((declaracion: Object, index: Number) => {
            const id = declaracion['id'];
            //{id}
            if (declaracion['id'] && !declaracion['tipo'] && !declaracion['corchetes'] && !declaracion['exp']) {
              const tipo = TIPOS.SIN_ASIGNAR;
              const variable = new Variable({ id, tipo, reasignable });
              //Si estoy en en entorno generado por una funcion
              if (e.generadoPorFuncion()) {
                variable.setIdNuevo(this.getIdNuevo(e, id));
              }
              e.setVariable(variable);
              codigoAux += `${variable.getIdNuevo()}`;
            }

            //{id, tipo}
            if (declaracion['id'] && declaracion['tipo'] && !declaracion['corchetes'] && !declaracion['exp']) {
              const tipo = declaracion['tipo'];
              const variable = new Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
              //Si estoy en en entorno generado por una funcion
              if (e.generadoPorFuncion()) {
                variable.setIdNuevo(this.getIdNuevo(e, id));
              }
              e.setVariable(variable);
              codigoAux += `${variable.getIdNuevo()} : ${tipo}`;
            }

            //{id, exp}
            if (declaracion['id'] && declaracion['exp'] && !declaracion['tipo'] && !declaracion['corchetes']) {
              //TODO: ASIGNAR EL TIPO BASADO EN LA EXPRESION
              const tipo = TIPOS.SIN_ASIGNAR;
              const variable = new Variable({ id, tipo, reasignable });
              //Si estoy en en entorno generado por una funcion
              if (e.generadoPorFuncion()) {
                variable.setIdNuevo(this.getIdNuevo(e, id));
              }
              e.setVariable(variable);
              codigoAux += `${variable.getIdNuevo()} = ${declaracion['exp']}`;
            }

            //{id, tipo, exp}
            if (declaracion['id'] && declaracion['tipo'] && declaracion['exp'] && !declaracion['corchetes']) {
              const tipo = declaracion['tipo'];
              //TODO: Validar que el tipo asignado y el tipo de la exp sean iguales
              const variable = new Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
              //Si estoy en en entorno generado por una funcion
              if (e.generadoPorFuncion()) {
                variable.setIdNuevo(this.getIdNuevo(e, id));
              }
              e.setVariable(variable);
              codigoAux += `${variable.getIdNuevo()} : ${tipo} = ${declaracion['exp']}`;
            }

            //{id, tipo, corchetes}
            if (declaracion['id'] && declaracion['tipo'] && !declaracion['exp'] && declaracion['corchetes']) {
              const tipo = declaracion['tipo'];
              const corchetes = declaracion['corchetes'];
              const variable = new Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
              //Si estoy en en entorno generado por una funcion
              if (e.generadoPorFuncion()) {
                variable.setIdNuevo(this.getIdNuevo(e, id));
              }
              e.setVariable(variable);
              codigoAux += `${variable.getIdNuevo()} : ${tipo}${corchetes}`;
            }

            //{id, tipo, corchetes, exp}
            if (declaracion['id'] && declaracion['tipo'] && declaracion['exp'] && declaracion['corchetes']) {
              const tipo = declaracion['tipo'];
              const corchetes = declaracion['corchetes'];
              //TODO: VALIDAR EL TIPO CON LA EXP ASIGNADA
              const variable = new Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
              //Si estoy en en entorno generado por una funcion
              if (e.generadoPorFuncion()) {
                variable.setIdNuevo(this.getIdNuevo(e, id));
              }
              e.setVariable(variable);
              codigoAux += `${variable.getIdNuevo()} : ${tipo}${corchetes} = ${declaracion['exp']}`;
            }

            //Si no soy el ultimo agrego una coma
            if (index < declaraciones.length - 1) codigoAux += ', ';
            //Si soy el ultimo agrego el punto y coma correspondiente
            else codigoAux += ';';
          });
          break;
      }
      return codigoAux;
    }

    //LISTA_DECLARACIONES
    else if (this.soyNodo('LISTA_DECLARACIONES', nodo)) {
      switch (nodo.hijos.length) {
        // DEC_ID | DEC_ID_TIPO | DEC_ID_TIPO_CORCHETES | DEC_ID_EXP ...
        case 1:
          return [this.recorrer(nodo.hijos[0], e)];
        default:
          const lista = [];
          nodo.hijos.forEach((nodoHijo: Object) => {
            const declaracion = this.recorrer(nodoHijo, e);
            lista.push(declaracion);
          });
          return lista;
      }
    }

    //DEC_ID
    else if (this.soyNodo('DEC_ID', nodo)) {
      switch (nodo.hijos.length) {
        //id
        case 1:
          return { id: nodo.hijos[0] };
      }
    }

    // DEC_ID_TIPO
    else if (this.soyNodo('DEC_ID_TIPO', nodo)) {
      switch (nodo.hijos.length) {
        // id dos_puntos TIPO_VARIABLE_NATIVA
        case 3:
          const id = nodo.hijos[0];
          const tipo = this.recorrer(nodo.hijos[2], e);
          return { id, tipo };
      }
    }

    //DEC_ID_EXP
    else if (this.soyNodo('DEC_ID_EXP', nodo)) {
      switch (nodo.hijos.length) {
        //id igual EXP
        case 3:
          const id = nodo.hijos[0];
          const exp = this.recorrer(nodo.hijos[2], e);
          return { id, exp };
      }
    }

    //DEC_ID_TIPO_EXP
    else if (this.soyNodo('DEC_ID_TIPO_EXP', nodo)) {
      switch (nodo.hijos.length) {
        // id dos_puntos TIPO_VARIABLE_NATIVA igual EXP
        case 5:
          const id = nodo.hijos[0];
          const tipo = this.recorrer(nodo.hijos[2], e);
          const exp = this.recorrer(nodo.hijos[4], e);
          return { id, tipo, exp };
      }
    }

    //DEC_ID_TIPO_CORCHETES
    else if (this.soyNodo('DEC_ID_TIPO_CORCHETES', nodo)) {
      switch (nodo.hijos.length) {
        // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
        case 4:
          const id = nodo.hijos[0];
          const tipo = this.recorrer(nodo.hijos[2], e);
          const corchetes = this.recorrer(nodo.hijos[3], e);
          return { id, tipo, corchetes }
      }
    }

    //DEC_ID_TIPO_CORCHETES_EXP
    else if (this.soyNodo('DEC_ID_TIPO_CORCHETES_EXP', nodo)) {
      switch (nodo.hijos.length) {
        // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES igual EXP
        case 6:
          const id = nodo.hijos[0];
          const tipo = this.recorrer(nodo.hijos[2], e);
          const corchetes = this.recorrer(nodo.hijos[3], e);
          const exp = this.recorrer(nodo.hijos[5], e);
          return { id, tipo, corchetes, exp };
      }
    }

    //EXP
    else if (this.soyNodo('EXP', nodo)) {

      switch (nodo.hijos.length) {
        case 1:
          return this.recorrer(nodo.hijos[0], e);
        case 3:
          //EXP mas EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` + ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP menos EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '-' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` - ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP por EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '*' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` * ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP div EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '/' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` / ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP mod EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '%' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` % ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP potencia EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '**' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` ** ` + this.recorrer(nodo.hijos[2], e);
          }
          //par_izq EXP par_der
          if (nodo.hijos[0] == '(' && this.soyNodo('EXP', nodo.hijos[1]) && nodo.hijos[2] == ')') {
            return '( ' + this.recorrer(nodo.hijos[1], e) + ' )'
          }
          //EXP mayor EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` > ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP menor EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` < ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP mayor_igual EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>=' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` >= ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP menor_igual EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<=' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` <= ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP igual_que EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '==' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` == ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP dif_que EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '!=' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` != ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP and EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '&&' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` && ` + this.recorrer(nodo.hijos[2], e);
          }
          //EXP or EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '||' && this.soyNodo('EXP', nodo.hijos[2])) {
            return this.recorrer(nodo.hijos[0], e) + ` || ` + this.recorrer(nodo.hijos[2], e);
          }


      }
    }

    //LISTA_EXPRESIONES
    else if (this.soyNodo('LISTA_EXPRESIONES', nodo)) {
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          codigoAux += this.recorrer(nodoHijo, e);
        } else {
          codigoAux += nodoHijo + ' ';
        }
      });
      return codigoAux;
    }

    //ID
    else if (this.soyNodo('ID', nodo)) {
      const id = nodo.hijos[0];
      const variable = e.getVariable(id);
      if (variable != null) {
        return variable.getIdNuevo();
      }
      return id;
    }

    //NUMBER
    else if (this.soyNodo('NUMBER', nodo)) {
      return nodo.hijos[0];
    }

    //STRING
    else if (this.soyNodo('STRING', nodo)) {
      return nodo.hijos[0];
    }

    //BOOLEAN
    else if (this.soyNodo('BOOLEAN', nodo)) {
      return nodo.hijos[0];
    }

    //NULL
    else if (this.soyNodo('NULL', nodo)) {
      return nodo.hijos[0];
    }

    //LISTA_CORCHETES
    else if (this.soyNodo('LISTA_CORCHETES', nodo)) {
      return nodo.hijos[0].repeat(nodo.hijos.length);
    }

    //LISTA_PARAMETROS
    else if (this.soyNodo('LISTA_PARAMETROS', nodo)) {
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any) => {
        if (this.soyNodo('PARAMETRO', nodoHijo)) {
          codigoAux += this.recorrer(nodoHijo, e);
        } else {
          codigoAux += `${nodoHijo} `; //coma
        }
      });
      return codigoAux;
    }

    //PARAMETRO
    else if (this.soyNodo('PARAMETRO', nodo)) {
      const id = nodo.hijos[0];
      const tipo = this.recorrer(nodo.hijos[2], e);
      switch (nodo.hijos.length) {
        // id dos_puntos TIPO_VARIABLE_NATIVA
        case 3:
          return `${id}: ${tipo}`;
        // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
        case 4:
          const corchetes = this.recorrer(nodo.hijos[3], e);
          return `${id} : ${tipo}${corchetes}`;
      }
    }

    //ATRIBUTO
    else if (this.soyNodo('ATRIBUTO', nodo)) {
      const id = nodo.hijos[0];
      const tipo = this.recorrer(nodo.hijos[2], e);
      switch (nodo.hijos.length) {
        // id dos_puntos TIPO_VARIABLE_NATIVA
        case 3:
          return `${id} : ${tipo}`;
        // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
        case 4:
          const corchetes = this.recorrer(nodo.hijos[3], e);
          return `${id} : ${tipo}${corchetes}`;
      }
    }

    //LISTA_ATRIBUTOS
    else if (this.soyNodo('LISTA_ATRIBUTOS', nodo)) {
      let codigoAux = '';
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          codigoAux += this.recorrer(nodoHijo, e);
        } else {
          codigoAux += `${nodoHijo}\n`;
        }
      });
      return codigoAux;
    }

    return '';
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

  /**
   * Retorna un elemento del enum TIPOS
   * @param tipo hijo de TIPO_VARIABLE_NATIVA
   * @param e entorno actual
   */
  getTipo(tipo: string, e: Entorno): TIPOS {
    if (tipo == 'string') return TIPOS.STRING;
    if (tipo == 'number') return TIPOS.NUMBER;
    if (tipo == 'boolean') return TIPOS.BOOLEAN;
    if (tipo == 'void') return TIPOS.VOID;
    //Si es un ID
    const variable = e.getVariable(tipo);
    if (variable != null) {
      return variable.getTipo();
    }

    return TIPOS.SIN_ASIGNAR;
  }
}
