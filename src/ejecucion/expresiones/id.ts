import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import * as _ from 'lodash';

export class Id extends Instruccion{
  id: string;

  constructor(linea: string, id: string){
    super(linea);
    Object.assign(this, {id, linea});
  }

  ejecutar(e: Entorno) {
    //Busco el id en el entorno
    const variable = e.getVariable(this.id);
    if(variable){
      return variable.getValor();
    }
    //Error
    Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, 'descripcion': `No en contró ninguna variable con el id: ${this.id}`}));
    return null;
  }
}
