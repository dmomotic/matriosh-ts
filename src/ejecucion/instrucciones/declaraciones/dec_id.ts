import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { EntornoAux } from "../../entorno_aux";
import { Instruccion } from "../../instruccion";
import { Variable } from "../../variable";

export class DecId extends Instruccion{
  id: string;
  reasignable: boolean;

  constructor(linea: string, reasignable: boolean, id: string){
    super(linea);
    Object.assign(this, {id, reasignable});
  }

  ejecutar(e: Entorno) {
    //Validacion de variabl existente
    let variable = e.getVariable(this.id);
    if(variable && !EntornoAux.getInstance().estoyEjecutandoFuncion()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `El id: ${this.id} ya fue declarado en este entorno`}));
      return;
    }
    //Si es const es un error ya que todo const debe tener un valor asignado
    if(!this.reasignable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Se debe asignar un valor a la variable ${this.id} de tipo const`}));
      return;
    }
    //Registro la variable en mi entorno
    variable = new Variable({reasignable: this.reasignable, id: this.id});
    e.setVariable(variable);
  }
}
