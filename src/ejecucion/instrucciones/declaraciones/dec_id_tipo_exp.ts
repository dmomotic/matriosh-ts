import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { EntornoAux } from "../../entorno_aux";
import { Instruccion } from "../../instruccion";
import { getTipo, TIPO_DATO } from '../../tipo';
import { Variable } from "../../variable";

export class DecIdTipoExp extends Instruccion{
  reasignable: boolean;
  id: string;
  tipo: TIPO_DATO;
  exp: Instruccion;
  type_generador: string;

  constructor(linea: string, reasignable: boolean, id: string, tipo: TIPO_DATO, exp: Instruccion, type_generador: String){
    super(linea);
    Object.assign(this, {reasignable, id, tipo, exp, type_generador});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable existente
    let variable = e.getVariable(this.id);
    if(variable && !EntornoAux.getInstance().estoyEjecutandoFuncion()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Ya existe una variable con el nombre ${this.id} declarada en este entorno`}));
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

    const valor = this.exp.ejecutar(e);
    if(this.tipo != getTipo(valor)){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo diferente a la variable ${this.id}`}));
      return;
    }

    variable = new Variable({reasignable: this.reasignable, id: this.id, tipo_asignado: this.tipo, type_generador: this.type_generador, valor});
    e.setVariable(variable);
  }

}
