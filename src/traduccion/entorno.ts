import { Variable } from './variable';

export class Entorno {
  variables: Map<String, Variable>;
  padre: Entorno;
  nombre: string;

  constructor(padre : Entorno, nombre : string){
    this.padre = padre != null ? padre : null;
    this.nombre = nombre != null ? nombre : null;
  }

  generadoPorFuncion() : boolean{
    return this.nombre != null;
  }

  getNombreFuncionGeneradora() : string {
    return this.nombre;
  }

  setVariable(variable : Variable) : void{
    this.variables.set(variable.id, variable);
  }

  getVariable(id : string) : Variable {
    for(let e : Entorno = this; e != null ; e = e.padre){
      let variable = e.variables.get('id');
      if(variable != null) return variable;
    }
    return null;
  }

}
