import { Instruccion } from "./instruccion";

export class If {
  condicion: Instruccion;
  instrucciones: Array<Instruccion>;

  constructor(condicion: Instruccion, instrucciones: Array<Instruccion>){
    Object.assign(this, {condicion, instrucciones});
  }
}
