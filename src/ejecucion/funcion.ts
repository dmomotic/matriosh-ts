import { Instruccion } from "./instruccion";

export class Funcion{
  id: string;
  instrucciones: Array<Instruccion>;

  constructor(id: string, instrucciones: Array<Instruccion>){
    Object.assign(this, {id, instrucciones});
  }
}
