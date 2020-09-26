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

  getAtributo(id: string) : Variable{
    return this.atributos.get(id);
  }

  setAtributo(variable : Variable){
    this.atributos.set(variable.id, variable);
  }

  public toString(): string{
    let salida = '{';
    let i = 0;
    const size = this.atributos.size - 1;
    for (let [key, value] of this.atributos) {
      salida += `${key}: `;
      if(value instanceof Variable){
        salida += `${value.valor}`;
      }
      else{
        salida += `${value}`;
      }
      if(i != size){
        salida += ', '
      }
      i++;
    }
    salida += '}'
    return salida;
  }

  public getSalidaBase() : String{
    let salida = `${this.id} = {`;
    let i = 0;
    const size = this.atributos.size - 1;
    for (let [key, value] of this.atributos) {
      salida += `${key}`;
      if(i != size){
        salida += ', '
      }
      i++;
    }
    salida += '}'
    return salida;
  }
}
