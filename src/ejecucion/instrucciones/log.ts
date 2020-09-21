import { Salida } from "../../arbol/salida";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import * as _ from 'lodash';

export class Log extends Instruccion{

  instrucciones : Instruccion[];

  constructor(linea: string, instrucciones: Instruccion[]){
    super(linea);
    Object.assign(this, {instrucciones});
  }

  ejecutar(e: Entorno) {
    this.instrucciones.forEach(inst => {
      let res = inst.ejecutar(e);
      res = _.cloneDeep(res);
      const salida = res ?? 'null';
      Salida.getInstance().push(salida);
    });
  }

}
