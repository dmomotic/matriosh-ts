import { Type } from './type';
import { Variable } from './variable';

export class Entorno{
  variables: Map<String, Variable>;
  padre: Entorno;
  types: Map<String, Type>

  constructor(padre? : Entorno){
    this.padre = padre != null ? padre : null;
    this.variables = new Map();
    this.types = new Map();
  }

  setVariable(variable : Variable) : void{
    this.variables.set(variable.id, variable);
  }

  getVariable(id : string) : Variable {
    for(let e : Entorno = this; e != null ; e = e.padre){
      let variable = e.variables.get(id);
      if(variable != null) return variable;
    }
    return null;
  }

  hasVariable(id: string) : boolean {
    for(let e : Entorno = this; e != null; e = e.padre){
      if(e.variables.has(id)){
        return true;
      }
    }
    return false;
  }

  updateValorVariable(id: string, valor: any){
    const variable = this.getVariable(id);
    if(variable){
      variable.valor = valor;
    }
  }

  getType(id : string) : Type {
    for(let e : Entorno = this; e != null ; e = e.padre){
      let type = e.types.get(id);
      if(type != null) return type;
    }
    return null;
  }

  setType(type : Type) : void{
    this.types.set(type.id, type);
  }
}
