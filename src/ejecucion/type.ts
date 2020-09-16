import { Variable } from "./variable";

export class Type{
  id: string;
  atributos: Map<String, Variable>;

  constructor(id: string, atributos: Map<String, Variable>){
    Object.assign(this, {id, atributos});
  }

  hasAtributo(id: string){
    return this.atributos.has(id);
  }

  setAtributo(variable : Variable){
    this.atributos.set(variable.id, variable);
  }

  public toString(): string{
    let salida = '{';
    for (let [key, value] of this.atributos) {
      salida += `${key}: `;
      if(value instanceof Variable){
        salida += `${value.valor}, `;
      }
      else{
        salida += `${value}, `;
      }
    }
    salida += '}'
    return salida;
  }
}
