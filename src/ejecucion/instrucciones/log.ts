import { Salida } from "../../arbol/salida";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";

export class Log extends Instruccion{

  instrucciones : Instruccion[];

  constructor(linea: string, instrucciones: Instruccion[]){
    super(linea);
    Object.assign(this, {instrucciones});
  }

  ejecutar(e: Entorno) {
    this.instrucciones.forEach(inst => {
      const res = inst.ejecutar(e);
      Salida.getInstance().push(res);
    });
  }

}
