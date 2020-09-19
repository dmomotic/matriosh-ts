import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { Return } from "../return";

export class LlamadaFuncion extends Instruccion{
  id: string;

  constructor(linea: string, id: string){
    super(linea);
    Object.assign(this, {id});
  }

  ejecutar(e: Entorno) {
    //Busco la funcion en el entorno
    const funcion = e.getFuncion(this.id);
    if(!funcion){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la funcion ${this.id} en este entorno`}));
      return;
    }

    const instrucciones = funcion.instrucciones;

    const entorno = new Entorno(e);
    for(let instruccion of instrucciones){
      const resp = instruccion.ejecutar(entorno);
      if(resp instanceof Return){
        //Si no tiene un valor de retorno solo paro la funcion
        if(!resp.hasValue()) return;
        //De lo contrario retorno el valor
        return resp.getValue();
      }
    }
  }

}
