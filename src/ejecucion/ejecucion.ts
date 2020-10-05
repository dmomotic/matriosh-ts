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
import { AccesoType } from './expresiones/acceso_type';
import { AsignacionAtributoType } from './instrucciones/asignaciones/asignacion_atributo_type';
import { AsignacionArreglo } from './instrucciones/asignaciones/asignacion_arreglo';
import { DeclaracionFuncion } from './instrucciones/declaraciones/declaracion_funcion';
import { LlamadaFuncion } from './expresiones/llamada_funcion';
import { Return } from './expresiones/flujo/return';
import { Resta } from './expresiones/aritmeticas/resta';
import { Multiplicacion } from './expresiones/aritmeticas/multiplicacion';
import { Division } from './expresiones/aritmeticas/division';
import { Modular } from './expresiones/aritmeticas/modular';
import { Potencia } from './expresiones/aritmeticas/potencia';
import { Mayor } from './expresiones/relacionales/mayor';
import { Menor } from './expresiones/relacionales/menor';
import { MayorIgual } from './expresiones/relacionales/mayor_igual';
import { MenorIgual } from './expresiones/relacionales/menor_igual';
import { Igual } from './expresiones/relacionales/igual';
import { Diferente } from './expresiones/relacionales/diferente';
import { And } from './expresiones/logicas/And';
import { Or } from './expresiones/logicas/Or';
import { Not } from './expresiones/logicas/Not';
import { ArrayLengthSimple } from './expresiones/length/array_length_simple';
import { ArrayLengthAccesosArreglo } from './expresiones/length/array_length_accesos_arreglo';
import { ArrayLengthAccesosType } from './expresiones/length/array_length_accesos_type';
import { ArrayPop } from './expresiones/pop/array_pop';
import { ArrayPopAccesosArreglo } from './expresiones/pop/array_pop_accesos_arreglo';
import { ArrayPopAccesosType } from './expresiones/pop/array_pop_accesos_type';
import { DecIdTipo } from './instrucciones/declaraciones/dec_id_tipo';
import * as _ from 'lodash';
import { DecIdTipoCorchetes } from './instrucciones/declaraciones/dec_id_tipo_corchetes';
import { DecIdTipoExp } from './instrucciones/declaraciones/dec_id_tipo_exp';
import { DecIdTipoCorchetesExp } from './instrucciones/declaraciones/dec_id_tipo_corchetes_exp';
import { PushArreglo } from './instrucciones/push/push_arreglo';
import { PushArregloAccesoType } from './instrucciones/push/push_arreglo_acceso_type';
import { Break } from './expresiones/flujo/break';
import { Continue } from './expresiones/flujo/continue';
import { If } from './if';
import { InstruccionIf } from './expresiones/condicionales/instruccion_if';
import { While } from './instrucciones/ciclos/while';
import { DoWhile } from './instrucciones/ciclos/do_while';
import { For } from './instrucciones/ciclos/for';
import { MasMas } from './expresiones/aritmeticas/mas_mas';
import { MenosMenos } from './expresiones/aritmeticas/menos_menos';
import { ForOf } from './instrucciones/ciclos/for_of';
import { ForIn } from './instrucciones/ciclos/for_in';
import { Variable } from './variable';
import { Ternario } from './expresiones/condicionales/ternario';
import { Case } from './case';
import { Switch } from './expresiones/condicionales/switch';
import { Entornos } from './entornos';
import { GraficarTS } from './instrucciones/graficar_ts';
import { IncrementoDecremento } from './instrucciones/incremento_decremento';

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
      Salida.getInstance().clear();
      instrucciones.forEach(element => {
        if (element instanceof Instruccion) {
          try {
            element.ejecutar(entorno);
          } catch (error) {

          }
        }
      });

      Entornos.getInstance().push(entorno);
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
      //Realizo el primer recorrido para las declaraciones
      nodo.hijos.forEach((nodoHijo: any) => {
        if (/* this.soyNodo('DECLARACION_VARIABLE', nodoHijo) ||  */this.soyNodo('DECLARACION_FUNCION', nodoHijo) || this.soyNodo('DECLARACION_TYPE', nodoHijo)) {
          const inst = this.recorrer(nodoHijo);
          if (inst instanceof Array) {
            instrucciones = instrucciones.concat(inst);
          }
          else {
            instrucciones.push(inst);
          }
        }
      });

      //Recorro las demas instrucciones
      nodo.hijos.forEach((nodoHijo: any) => {
        if (/* !this.soyNodo('DECLARACION_VARIABLE', nodoHijo) && */ !this.soyNodo('DECLARACION_FUNCION', nodoHijo) && !this.soyNodo('DECLARACION_TYPE', nodoHijo)) {
          const inst = this.recorrer(nodoHijo);
          if (inst instanceof Array) {
            instrucciones = instrucciones.concat(inst);
          }
          else {
            instrucciones.push(inst);
          }
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
        const linea = nodo.linea;
        const id = item['id'];
        //{id, tipo, dimensiones, exp, type_generador? }
        if (_.has(item, 'id') && _.has(item, 'tipo') && _.has(item, 'dimensiones') && _.has(item, 'exp')) {
          const tipo = item['tipo'];
          const dimensiones = item['dimensiones'];
          const exp = item['exp'];
          const type_generador = item['type_generador'] ?? null;
          lista_instrucciones.push(new DecIdTipoCorchetesExp(nodo.linea, reasignable, id, tipo, dimensiones, exp, type_generador));
        }
        //{id, tipo, dimensiones, type_generador? }
        else if (_.has(item, 'id') && _.has(item, 'tipo') && _.has(item, 'dimensiones')) {
          const tipo = item['tipo'];
          const dimensiones = item['dimensiones'];
          const type_generador = item['type_generador'] ?? null;
          lista_instrucciones.push(new DecIdTipoCorchetes(nodo.linea, reasignable, id, tipo, dimensiones, type_generador));
        }
        //{id, tipo, exp, type_generador?}
        else if (_.has(item, 'id') && _.has(item, 'tipo') && _.has(item, 'exp')) {
          const tipo = item['tipo'];
          const exp = item['exp'];
          const type_generador = item['type_generador'] ?? null;
          lista_instrucciones.push(new DecIdTipoExp(nodo.linea, reasignable, id, tipo, exp, type_generador));
        }
        //{id, tipo, type_generador?}
        else if (_.has(item, 'id') && _.has(item, 'tipo')) {
          const tipo = item['tipo'];
          const type_generador = item['type_generador'] ?? null;
          lista_instrucciones.push(new DecIdTipo(nodo.linea, reasignable, id, tipo, type_generador));
        }
        //{id, exp}
        else if (_.has(item, 'id') && _.has(item, 'exp')) {
          const exp = item['exp'];
          lista_instrucciones.push(new DecIdExp(linea, reasignable, id, exp));
        }
        //{id}
        else if (_.has(item, 'id')) {
          lista_instrucciones.push(new DecId(linea, reasignable, id));
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

    //DEC_ID_TIPO_EXP
    if (this.soyNodo('DEC_ID_TIPO_EXP', nodo)) {
      //id dos_puntos TIPO_VARIABLE_NATIVA igual EXP
      const tipo_var_nat = this.recorrer(nodo.hijos[2]) as Object;
      const exp = this.recorrer(nodo.hijos[4]);
      return { id: nodo.hijos[0], ...tipo_var_nat, exp };
    }

    //DEC_ID_EXP
    if (this.soyNodo('DEC_ID_EXP', nodo)) {
      //id igual EXP
      const id = nodo.hijos[0] as string;
      const exp = this.recorrer(nodo.hijos[2]) as Object;
      return { id, exp };
    }

    //DEC_ID_TIPO_CORCHETES
    if (this.soyNodo('DEC_ID_TIPO_CORCHETES', nodo)) {
      //id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
      const id = nodo.hijos[0];
      const tipo_var_nat = this.recorrer(nodo.hijos[2]);
      const dimensiones = this.recorrer(nodo.hijos[3]);
      return { id, ...tipo_var_nat, dimensiones };
      //{id, tipo, dimensiones, type_generador? }
    }

    //DEC_ID_TIPO_CORCHETES_EXP
    if (this.soyNodo('DEC_ID_TIPO_CORCHETES_EXP', nodo)) {
      //id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES igual EXP
      const id = nodo.hijos[0];
      const tipo_var_nat = this.recorrer(nodo.hijos[2]);
      const dimensiones = this.recorrer(nodo.hijos[3]);
      const exp = this.recorrer(nodo.hijos[5]);
      return { id, ...tipo_var_nat, dimensiones, exp };
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
          //menos EXP
          if (nodo.hijos[0] == '-' && this.soyNodo('EXP', nodo.hijos[1])) {
            const expIzq = new Nativo(nodo.linea, -1);
            const expDer = this.recorrer(nodo.hijos[1]);
            return new Multiplicacion(nodo.linea, expIzq, expDer);
          }
          //cor_izq cor_der
          if (nodo.hijos[0] == '[' && nodo.hijos[1] == ']') {
            return new Arreglo(nodo.linea);
          }
          //id mas_mas
          if (nodo.hijos[1] == '++') {
            const id = nodo.hijos[0];
            return new MasMas(nodo.linea, id);
          }
          //id menos_menos
          if (nodo.hijos[1] == '--') {
            const id = nodo.hijos[0];
            return new MenosMenos(nodo.linea, id);
          }
          //not EXP
          if (nodo.hijos[0] == '!' && this.soyNodo('EXP', nodo.hijos[1])) {
            const exp = this.recorrer(nodo.hijos[1]);
            return new Not(nodo.linea, exp);
          }
        case 3:
          //EXP mas EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Suma(linea, expIzq, expDer);
          }
          //EXP menos EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '-' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Resta(linea, expIzq, expDer);
          }
          //EXP por EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '*' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Multiplicacion(linea, expIzq, expDer);
          }
          //EXP div EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '/' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Division(linea, expIzq, expDer);
          }
          //EXP mod EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '%' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Modular(linea, expIzq, expDer);
          }
          //EXP potencia EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '**' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Potencia(linea, expIzq, expDer);
          }
          //par_izq EXP par_der
          if (nodo.hijos[0] == '(' && this.soyNodo('EXP', nodo.hijos[1]) && nodo.hijos[2] == ')') {
            return this.recorrer(nodo.hijos[1]);
          }
          //EXP mayor EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Mayor(linea, expIzq, expDer);
          }
          //EXP menor EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Menor(linea, expIzq, expDer);
          }
          //EXP mayor_igual EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>=' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new MayorIgual(linea, expIzq, expDer);
          }
          //EXP menor_igual EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<=' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new MenorIgual(linea, expIzq, expDer);
          }
          //EXP igual_que EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '==' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Igual(linea, expIzq, expDer);
          }
          //EXP dif_que EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '!=' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Diferente(linea, expIzq, expDer);
          }
          //EXP and EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '&&' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new And(linea, expIzq, expDer);
          }
          //EXP or EXP
          if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '||' && this.soyNodo('EXP', nodo.hijos[2])) {
            const expIzq = this.recorrer(nodo.hijos[0]);
            const expDer = this.recorrer(nodo.hijos[2]);
            const linea = nodo.linea;
            return new Or(linea, expIzq, expDer);
          }

          //cor_izq LISTA_EXPRESIONES cor_der
          if (nodo.hijos[0] == '[' && this.soyNodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == ']') {
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
      return lista_atributos; //[{id, tipo, type_generador?, corchetes?}]
    }

    //DECLARACION_TYPE
    if (this.soyNodo('DECLARACION_TYPE', nodo)) {
      // type id igual llave_izq LISTA_ATRIBUTOS llave_der
      // type id igual llave_izq LISTA_ATRIBUTOS llave_der punto_coma
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
          const lista_accesos = this.recorrer(nodo.hijos[1]); //[id | [EXP]]
          const tipo_igual = this.recorrer(nodo.hijos[2]);
          const exp = this.recorrer(nodo.hijos[3]);

          return new AsignacionAtributoType(nodo.linea, id, lista_accesos, tipo_igual, exp);
        }
        case 4: {
          //ACCESO_ARREGLO TIPO_IGUAL EXP punto_coma
          if (this.soyNodo('ACCESO_ARREGLO', nodo.hijos[0])) {
            const acceso_arreglo_simple: AccesoArregloSimple = this.recorrer(nodo.hijos[0]);
            const tipo_igual = this.recorrer(nodo.hijos[1]);
            const exp = this.recorrer(nodo.hijos[2]);

            const id = acceso_arreglo_simple.id;
            const lista_accesos = acceso_arreglo_simple.lista_accesos;

            return new AsignacionArreglo(nodo.linea, id, lista_accesos, tipo_igual, exp);
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
    if (this.soyNodo('ACCESO_ARREGLO', nodo)) {
      //id LISTA_ACCESOS_ARREGLO
      const id = nodo.hijos[0];
      const lista_accesos_arreglo = this.recorrer(nodo.hijos[1]);
      return new AccesoArregloSimple(nodo.linea, id, lista_accesos_arreglo);
    }

    //ACCESO_TYPE
    if (this.soyNodo('ACCESO_TYPE', nodo)) {
      //id LISTA_ACCESOS_TYPE
      const id = nodo.hijos[0];
      //[id | [EXP]]
      const lista_accesos_type = this.recorrer(nodo.hijos[1]);
      return new AccesoType(nodo.linea, id, lista_accesos_type);
    }

    //DECLARACION_FUNCION
    if (this.soyNodo('DECLARACION_FUNCION', nodo)) {
      switch (nodo.hijos.length) {
        //function id par_izq par_der llave_izq INSTRUCCIONES llave_der
        case 7: {
          const id = nodo.hijos[1];
          const instrucciones = this.recorrer(nodo.hijos[5]);
          return new DeclaracionFuncion(nodo.linea, id, instrucciones);
        }
        //function id par_izq LISTA_PARAMETROS par_der llave_izq INSTRUCCIONES llave_der
        case 8: {
          const id = nodo.hijos[1];
          const lista_parametros = this.recorrer(nodo.hijos[3]);
          const instrucciones = this.recorrer(nodo.hijos[6]);
          return new DeclaracionFuncion(nodo.linea, id, instrucciones, TIPO_DATO.VOID, lista_parametros);
        }
        //function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
        case 9: {
          const id = nodo.hijos[1];
          // {tipo, type_generador?}
          const tipo_variable_nativa = this.recorrer(nodo.hijos[5]);
          const tipo_return = tipo_variable_nativa.tipo;
          const instrucciones = this.recorrer(nodo.hijos[7]);
          return new DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return);
        }
        case 10: {
          // function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES llave_izq INSTRUCCIONES llave_der
          if(this.soyNodo('LISTA_CORCHETES', nodo.hijos[6])){
            const id = nodo.hijos[1];
            const tipo_return = TIPO_DATO.ARRAY;
            const instrucciones = this.recorrer(nodo.hijos[8]);
            return new DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return);
          }
          //function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
          else if(this.soyNodo('LISTA_PARAMETROS', nodo.hijos[3])){
            const id = nodo.hijos[1];
            //[Variable ...]
            const lista_parametros = this.recorrer(nodo.hijos[3]);

            // {tipo, type_generador?}
            const tipo_variable_nativa = this.recorrer(nodo.hijos[6]);
            const tipo_return = tipo_variable_nativa.tipo;
            const instrucciones = this.recorrer(nodo.hijos[8]);
            return new DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return, lista_parametros);
          }
        }
        // function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES llave_izq INSTRUCCIONES llave_der
        case 11: {
          const id = nodo.hijos[1];
          //[Variable ...]
          const lista_parametros = this.recorrer(nodo.hijos[3]);
          const tipo_return = TIPO_DATO.ARRAY;
          const instrucciones = this.recorrer(nodo.hijos[9]);
          return new DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return, lista_parametros);
        }
      }
    }

    //LLAMADA_FUNCION
    if (this.soyNodo('LLAMADA_FUNCION', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        //id par_izq par_der punto_coma
        case 4:
          return new LlamadaFuncion(nodo.linea, id);
        //id par_izq LISTA_EXPRESIONES par_der punto_coma
        case 5:
          //[EXP ...]
          const lista_expresiones = this.recorrer(nodo.hijos[2]);
          return new LlamadaFuncion(nodo.linea, id, lista_expresiones);
      }
    }

    //LLAMADA_FUNCION_EXP
    if (this.soyNodo('LLAMADA_FUNCION_EXP', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        //id par_izq par_der
        case 3:
          return new LlamadaFuncion(nodo.linea, id);
        //id par_izq LISTA_EXPRESIONES par_der
        case 4:
          //[EXP ...]
          const lista_expresiones = this.recorrer(nodo.hijos[2]);
          return new LlamadaFuncion(nodo.linea, id, lista_expresiones);
      }
    }

    //RETURN
    if (this.soyNodo('RETURN', nodo)) {
      switch (nodo.hijos.length) {
        //return EXP punto_coma
        case 3:
          const exp = this.recorrer(nodo.hijos[1]);
          return new Return(nodo.linea, true, exp);
        //return punto_coma
        case 2:
          return new Return(nodo.linea, false);
      }
    }

    //ARRAY_LENGTH
    if (this.soyNodo('ARRAY_LENGTH', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        //id punto length
        case 3:
          return new ArrayLengthSimple(nodo.linea, id);
        case 4:
          //id LISTA_ACCESOS_ARREGLO punto length
          if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo.hijos[1])) {
            const lista_accesos = this.recorrer(nodo.hijos[1]);
            return new ArrayLengthAccesosArreglo(nodo.linea, id, lista_accesos);
          }
          //id LISTA_ACCESOS_TYPE punto length
          if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo.hijos[1])) {
            //[id | [EXP]]
            const lista_accesos = this.recorrer(nodo.hijos[1]);
            return new ArrayLengthAccesosType(nodo.linea, id, lista_accesos);
          }
      }
    }

    //ARRAY_POP
    if (this.soyNodo('ARRAY_POP', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        //id punto pop par_izq par_der
        case 5:
          return new ArrayPop(nodo.linea, id);
        case 6:
          //id LISTA_ACCESOS_ARREGLO punto pop par_izq par_der
          if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo.hijos[1])) {
            const lista_accesos = this.recorrer(nodo.hijos[1]);
            return new ArrayPopAccesosArreglo(nodo.linea, id, lista_accesos);
          }
          //id LISTA_ACCESOS_TYPE punto pop par_izq par_der
          if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo.hijos[1])) {
            const lista_accesos = this.recorrer(nodo.hijos[1]);
            return new ArrayPopAccesosType(nodo.linea, id, lista_accesos);
          }
      }
    }

    //PUSH_ARREGLO
    if (this.soyNodo('PUSH_ARREGLO', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        // id punto push par_izq EXP par_der punto_coma
        case 7: {
          const exp = this.recorrer(nodo.hijos[4]);
          return new PushArreglo(nodo.linea, id, exp);
        }
        // id LISTA_ACCESOS_TYPE punto push par_izq EXP par_der punto_coma
        case 8: {
          const lista_accesos = this.recorrer(nodo.hijos[1]);
          const exp = this.recorrer(nodo.hijos[5]);
          return new PushArregloAccesoType(nodo.linea, id, lista_accesos, exp);
        }
      }
    }

    //BREAK
    if (this.soyNodo('BREAK', nodo)) {
      //break punto_coma
      return new Break(nodo.linea);
    }

    //CONTINUE
    if (this.soyNodo('CONTINUE', nodo)) {
      //continue punto_coma
      return new Continue(nodo.linea);
    }

    //INSTRUCCION_IF
    if (this.soyNodo('INSTRUCCION_IF', nodo)) {
      switch (nodo.hijos.length) {
        //IF
        case 1:
          const inst = this.recorrer(nodo.hijos[0]);
          return new InstruccionIf(nodo.linea, [inst]);
        case 2:
          //IF ELSE
          if (this.soyNodo('IF', nodo.hijos[0]) && this.soyNodo('ELSE', nodo.hijos[1])) {
            const inst_if = this.recorrer(nodo.hijos[0]);
            const inst_else = this.recorrer(nodo.hijos[1]);
            return new InstruccionIf(nodo.linea, [inst_if, inst_else]);
          }
          //IF LISTA_ELSE_IF
          if (this.soyNodo('IF', nodo.hijos[0]) && this.soyNodo('LISTA_ELSE_IF', nodo.hijos[1])) {
            const inst_if = this.recorrer(nodo.hijos[0]);
            const lista_ifs = this.recorrer(nodo.hijos[1]);
            return new InstruccionIf(nodo.linea, [inst_if, ...lista_ifs]);
          }
        //IF LISTA_ELSE_IF ELSE
        case 3:
          const inst_if = this.recorrer(nodo.hijos[0]);
          const lista_ifs = this.recorrer(nodo.hijos[1]);
          const inst_else = this.recorrer(nodo.hijos[2]);
          return new InstruccionIf(nodo.linea, [inst_if, ...lista_ifs, inst_else]);
      }
    }

    //IF
    if (this.soyNodo('IF', nodo)) {
      //if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
      const condicion = this.recorrer(nodo.hijos[2]);
      const instrucciones = this.recorrer(nodo.hijos[5]);
      return new If(condicion, instrucciones);
    }

    //ELSE
    if (this.soyNodo('ELSE', nodo)) {
      //else llave_izq INSTRUCCIONES llave_der
      const condicion = new Nativo(nodo.linea, true);
      const instrucciones = this.recorrer(nodo.hijos[2]);
      return new If(condicion, instrucciones);
    }

    //ELSE_IF
    if (this.soyNodo('ELSE_IF', nodo)) {
      //else if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
      const condicion = this.recorrer(nodo.hijos[3]);
      const instrucciones = this.recorrer(nodo.hijos[6]);
      return new If(condicion, instrucciones);
    }

    //LISTA_ELSE_IF
    if (this.soyNodo('LISTA_ELSE_IF', nodo)) {
      const lista = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        const resp = this.recorrer(nodoHijo);
        if (resp instanceof If) {
          lista.push(resp);
        }
      });
      return lista;
    }

    //WHILE
    if (this.soyNodo('WHILE', nodo)) {
      //while par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
      const condicion = this.recorrer(nodo.hijos[2]);
      const instrucciones = this.recorrer(nodo.hijos[5]);
      return new While(nodo.linea, condicion, instrucciones);
    }

    //DO_WHILE
    if (this.soyNodo('DO_WHILE', nodo)) {
      //do llave_izq INSTRUCCIONES llave_der while par_izq EXP par_der punto_coma
      const instrucciones = this.recorrer(nodo.hijos[2]);
      const condicion = this.recorrer(nodo.hijos[6]);
      return new DoWhile(nodo.linea, instrucciones, condicion);
    }

    //ASIGNACION_FOR
    if (this.soyNodo('ASIGNACION_FOR', nodo)) {
      const id = nodo.hijos[0];
      switch (nodo.hijos.length) {
        // id TIPO_IGUAL EXP
        case 3:
          const tipo_igual = this.recorrer(nodo.hijos[1]);
          const exp = this.recorrer(nodo.hijos[2]);
          return new Asignacion(nodo.linea, id, tipo_igual, exp);
        //id mas_mas | id menos_menos
        case 2:
          if (nodo.hijos[1] == '++')
            return new MasMas(nodo.linea, id);
          if (nodo.hijos[1] == '--')
            return new MenosMenos(nodo.linea, id);
      }
    }

    //FOR
    if (this.soyNodo('FOR', nodo)) {
      const condicion = this.recorrer(nodo.hijos[3]);
      const asignacion_for = this.recorrer(nodo.hijos[5]);
      const instrucciones = this.recorrer(nodo.hijos[8]);
      //for par_izq DECLARACION_VARIABLE EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der
      if (this.soyNodo('DECLARACION_VARIABLE', nodo.hijos[2])) {
        const lista_instrucciones = this.recorrer(nodo.hijos[2]);
        const declaracion = lista_instrucciones[0];
        return new For(nodo.linea, declaracion, null, condicion, asignacion_for, instrucciones);
      }
      //for par_izq ASIGNACION EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der
      if (this.soyNodo('ASIGNACION', nodo.hijos[2])) {
        const asignacion = this.recorrer(nodo.hijos[2]);
        return new For(nodo.linea, null, asignacion, condicion, asignacion_for, instrucciones);
      }
    }

    //FOR_OF
    if (this.soyNodo('FOR_OF', nodo)) {
      //for par_izq TIPO_DEC_VARIABLE id of EXP par_der llave_izq INSTRUCCIONES llave_der
      const tipo_declaracion = this.recorrer(nodo.hijos[2]);
      const id = nodo.hijos[3];
      const exp = this.recorrer(nodo.hijos[5]);
      const instrucciones = this.recorrer(nodo.hijos[8]);
      return new ForOf(nodo.linea, tipo_declaracion, id, exp, instrucciones);
    }

    //FOR_IN
    if (this.soyNodo('FOR_IN', nodo)) {
      //for par_izq TIPO_DEC_VARIABLE id in EXP par_der llave_izq INSTRUCCIONES llave_der
      const tipo_declaracion = this.recorrer(nodo.hijos[2]);
      const id = nodo.hijos[3];
      const exp = this.recorrer(nodo.hijos[5]);
      const instrucciones = this.recorrer(nodo.hijos[8]);
      return new ForIn(nodo.linea, tipo_declaracion, id, exp, instrucciones);
    }

    //PARAMETRO
    if (this.soyNodo('PARAMETRO', nodo)) {
      const id = nodo.hijos[0];

      switch (nodo.hijos.length) {
        //id dos_puntos TIPO_VARIABLE_NATIVA
        case 3: {
          //{tipo, tpe_generador?}
          const tipo_variable_nativa = this.recorrer(nodo.hijos[2]);
          const tipo = tipo_variable_nativa.tipo;
          return new Variable({ reasignable: true, id, tipo_asignado: tipo });
        }

        //id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
        case 4: {
          //{tipo, tpe_generador?}
          const tipo_variable_nativa = this.recorrer(nodo.hijos[2]);
          const tipo = tipo_variable_nativa.tipo;
          const dimensiones = this.recorrer(nodo.hijos[3]);
          return new Variable({ reasignable: true, id, tipo_asignado: TIPO_DATO.ARRAY, dimensiones });
        }
        // id dos_puntos Array menor TIPO_VARIABLE_NATIVA mayor
        case 6: {
          //{tipo, tpe_generador?}
          const tipo_variable_nativa = this.recorrer(nodo.hijos[4]);
          const tipo = tipo_variable_nativa.tipo;
          return new Variable({ reasignable: true, id, tipo_asignado: TIPO_DATO.ARRAY, dimensiones: 1});
        }
      }
    }

    //LISTA_PARAMETROS
    if (this.soyNodo('LISTA_PARAMETROS', nodo)) {
      const variables = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          const resp = this.recorrer(nodoHijo);
          if (resp instanceof Variable) {
            variables.push(resp);
          }
        }
      });
      return variables; //[Variable...]
    }

    //TERNARIO
    if (this.soyNodo('TERNARIO', nodo)) {
      //EXP interrogacion EXP dos_puntos EXP
      const condicion = this.recorrer(nodo.hijos[0]);
      const exp_true = this.recorrer(nodo.hijos[2]);
      const exp_false = this.recorrer(nodo.hijos[4]);
      return new Ternario(nodo.linea, condicion, exp_true, exp_false);
    }

    //SWITCH
    if (this.soyNodo('SWITCH', nodo)) {
      //switch par_izq EXP par_der llave_izq LISTA_CASE llave_der
      const exp = this.recorrer(nodo.hijos[2]);
      const lista_case = this.recorrer(nodo.hijos[5]);
      return new Switch(nodo.linea, exp, lista_case);
    }

    //CASE
    if (this.soyNodo('CASE', nodo)) {
      //case EXP dos_puntos INSTRUCCIONES
      const exp = this.recorrer(nodo.hijos[1]);
      const instrucciones = this.recorrer(nodo.hijos[3]);
      return new Case(exp, instrucciones);
    }

    //DEFAULT
    if (this.soyNodo('DEFAULT', nodo)) {
      //default dos_puntos INSTRUCCIONES
      const instrucciones = this.recorrer(nodo.hijos[2]);
      return new Case(null, instrucciones, true);
    }

    //LISTA_CASE
    if (this.soyNodo('LISTA_CASE', nodo)) {
      const lista = [];
      nodo.hijos.forEach((nodoHijo: any) => {
        if (nodoHijo instanceof Object) {
          const resp = this.recorrer(nodoHijo);
          if (resp instanceof Case) {
            lista.push(resp);
          }
        }
      });
      return lista; //[Case ...]
    }

    //GRAFICAR_TS
    if (this.soyNodo('GRAFICAR_TS', nodo)) {
      //graficar_ts par_izq par_der punto_coma
      return new GraficarTS(nodo.linea);
    }

    //INCREMENTO_DECREMENTO
    if (this.soyNodo('INCREMENTO_DECREMENTO', nodo)) {
      //id mas_mas punto_coma || id menos_menos punto_coma
      const id = nodo.hijos[0];
      const incremento = nodo.hijos[1] == '++';
      return new IncrementoDecremento(nodo.linea, id, incremento);
    }
  }

  /**
   * Funcion para determinar si no tengo funciones anidadas
   * @param nodo
   */
  puedoEjecutar(nodo: any): boolean {

    //S
    if (this.soyNodo('S', nodo)) {
      for (let nodoHijo of nodo.hijos) {
        const resp = this.puedoEjecutar(nodoHijo);
        if (!resp) return false;
      }
    }

    //INSTRUCCIONES
    if (this.soyNodo('INSTRUCCIONES', nodo)) {
      for (let nodoHijo of nodo.hijos) {
        //Ejecuto solo los nodos que sean DECLARACION_FUNCION
        if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
          const res = this.puedoEjecutar(nodoHijo);
          if (!res) return false;
        }
      }
    }

    //DECLARACION_FUNCION
    if (this.soyNodo('DECLARACION_FUNCION', nodo)) {
      for (let nodoHijo of nodo.hijos) {
        //Si es el nodo INSTRUCCIONES
        if (this.soyNodo('INSTRUCCIONES', nodoHijo)) {
          for (let nodoInst of nodoHijo.hijos) {
            if (this.soyNodo('DECLARACION_FUNCION', nodoInst)) {
              return false;
            }
          }
        }
      }
    }

    return true;
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
