import { format } from 'quasar';
import { Funcion } from './funcion';
import { Variable } from './variable';

export class Entorno {
  variables: Map<String, Variable>;
  padre: Entorno;
  nombre: string;
  funciones: Map<String, Funcion>;

  constructor(padre? : Entorno, nombre? : string){
    this.padre = padre != null ? padre : null;
    this.nombre = nombre != null ? nombre : null;
    this.variables = new Map();
    this.funciones = new Map();
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
      let variable = e.variables.get(id);
      if(variable != null) return variable;
    }
    return null;
  }

  getNombreFuncion(id: string) : string{
    let nombre = id;
    let flag = false;
    for(let e : Entorno = this; e != null; e = e.padre){
      if(e.generadoPorFuncion()){
        flag = true;
        nombre = e.getNombreFuncionGeneradora() + '_' + nombre;
      }
    }
    return flag ? nombre + '_' : nombre;
  }

  setFuncion(funcion: Funcion):void{
    let e : Entorno = this;
    if(e.padre != null){
      e = e.padre;
    }
    e.funciones.set(funcion.id, funcion);
  }

  getFuncion(id: string):Funcion{
    for(let e : Entorno = this; e != null; e = e.padre){
      const fn = e.funciones.get(id);
      if( fn != null) return fn;
    }
    return null;
  }

}
