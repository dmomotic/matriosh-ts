import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class Asignacion extends Instruccion{
  id: string;
  tipo_igual: string;
  exp: Instruccion;

  constructor(linea: string, id: string, tipo_igual: string, exp: Instruccion){
    super(linea);
    Object.assign(this, {id, tipo_igual, exp});
  }

  ejecutar(e: Entorno) {
    //Busqueda de id
    const variable = e.getVariable(this.id);
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No fue posible encontrar la variable ${this.id}, para realizar la asignación`}));
      return;
    }
    //Si no es reasignable
    if(!variable.isReasignable()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede volver a asignar la variable ${this.id}`}));
      return;
    }
    //Si es una asignacion normal
    if(this.tipo_igual == '='){

    }
    //Si es mas igual o menos igual
    if(this.tipo_igual == '+=' || this.tipo_igual == '-='){

    }
  }

}
