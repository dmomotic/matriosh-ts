import { Instruccion } from "./instruccion";

export class Case{
  exp: Instruccion;
  instrucciones: Array<Instruccion>;
  is_default: boolean;

  constructor(exp: Instruccion, instrucciones: Array<Instruccion>, is_default: boolean = false){
    Object.assign(this, {exp, instrucciones, is_default});
  }

  isDefault() : boolean{
    return this.is_default;
  }
}
