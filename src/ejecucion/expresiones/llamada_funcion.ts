import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { Return } from "../return";
import * as _ from 'lodash';
import { getTipo } from "../tipo";
import { Continue } from "../continue";
import { Break } from "../break";

export class LlamadaFuncion extends Instruccion {
  id: string;
  lista_parametros: Array<Instruccion>;

  constructor(linea: string, id: string, lista_parametros: Array<Instruccion> = null) {
    super(linea);
    Object.assign(this, { id, lista_parametros });
  }

  ejecutar(e: Entorno) {
    const entorno_aux = new Entorno();
    const entorno_local = new Entorno(e);

    const funcion = _.cloneDeep(e.getFuncion(this.id));

    //Validacion de funcion existente
    if (!funcion) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No existe ninguna funcion con el nombre ${this.id}` }));
      return;
    }

    //Si la llamada  de la funcion trae parametros
    if (this.lista_parametros) {
      //Si la funcion no tiene parametros
      if (!funcion.hasParametros()) {
        Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} no recibe parametros` }));
        return;
      }
      //Si la funcion tiene parametros debe ser la misma cantidad
      if (this.lista_parametros.length != funcion.lista_parametros.length) {
        Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `La cantidad de parametros no coincide ${this.id}` }));
        return;
      }
      //Declaro los parametros
      for (let i = 0; i < this.lista_parametros.length; i++) {
        const exp = this.lista_parametros[i];
        const variable = funcion.lista_parametros[i];

        const valor = exp.ejecutar(entorno_local);

        //Validacion de tipo a asignar
        if(variable.hasTipoAsignado() && variable.tipo_asignado != getTipo(valor)){
          Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `El parametro ${variable.id} de la funcion ${this.id} no es del tipo enviado en la llamada de la funcion`}));
          return;
        }

        variable.valor = valor;
        entorno_aux.setVariable(variable);
      }
    }

    entorno_local.variables = _.cloneDeep(entorno_aux.variables);

    //Ejecuto las instrucciones
    for (let instruccion of funcion.instrucciones) {
      const resp = instruccion.ejecutar(entorno_local);
      //Validacion Return
      if (resp instanceof Return) {
        //Validacion de retorno en funcion
        if (funcion.hasReturn() && resp.hasValue()) {
          //Valido el tipo del retorno
          if(getTipo(resp.getValue()) != funcion.tipo_return){
            Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} esta retornando un tipo distinto al declarado`}));
            return;
          }
          return resp.getValue();
        }
        //Si la funcion tiene return pero el return no trae valor
        if (funcion.hasReturn() && !resp.hasValue()) {
          Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} debe retornar un valor` }));
          return;
        }
        //Si solo es un return
        return;
      }
      //Validacion Break o Continue
      if(resp instanceof Break || resp instanceof Continue){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Las instrucciones Break/Continue solo pueden ser utilizadas dentro de ciclos`}));
        return;
      }
    }

    //Valido si la funcion debia retornar algo
    if(funcion.hasReturn()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} debe retornar un valor`}));
      return;
    }
  }

}
