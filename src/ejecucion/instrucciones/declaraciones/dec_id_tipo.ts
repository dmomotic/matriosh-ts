import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { EntornoAux } from "../../entorno_aux";
import { Instruccion } from "../../instruccion";
import { TIPO_DATO } from '../../tipo';
import { Variable } from "../../variable";

export class DecIdTipo extends Instruccion{
  reasignable: boolean;
  id: string;
  tipo: TIPO_DATO;
  type_generador: string;

  constructor(linea: string, reasignable: boolean, id: string, tipo: TIPO_DATO, type_generador: String){
    super(linea);
    Object.assign(this, {reasignable, id, tipo, type_generador});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable existente
    let variable = e.getVariable(this.id);
    if(variable && !EntornoAux.getInstance().estoyEjecutandoFuncion()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Ya existe una variable con el nombre ${this.id} declarada en este entorno`}));
      return;
    }
    //Si es const es un error porque debe tener un valor asignado
    if(!this.reasignable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} es tipo const, se debe asignar un valor`}));
      return;
    }
    //Si es un type busco el type para comprobar que exista
    if(this.tipo == TIPO_DATO.TYPE && this.type_generador != null){
      const type = e.getType(this.type_generador);
      if(!type){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede declarar la variable ${this.id} del tipo ${this.type_generador} porque no existe ningún type con ese identificador`}));
        return;
      }
    }

    variable = new Variable({reasignable: this.reasignable, id: this.id, tipo_asignado: this.tipo, type_generador: this.type_generador});
    e.setVariable(variable);
  }

}
