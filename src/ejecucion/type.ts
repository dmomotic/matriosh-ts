import { Entorno } from "./entorno";
import { Variable } from "./variable";

export class Type{
  id: string;
  atributos: Entorno;

  constructor(id: string, atributos: Entorno){
    Object.assign(this, {id, atributos});
  }

  hasAtributo(id: string){
    return this.atributos.hasVariable(id);
  }

  setAtributo(variable : Variable){
    this.atributos.setVariable(variable);
  }
}
