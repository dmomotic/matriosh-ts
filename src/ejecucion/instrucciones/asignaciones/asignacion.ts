import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { getTipo } from "../../tipo";

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
      const valor = this.exp.ejecutar(e);

      //Si no tiene tipo asignado le asigno lo que venga
      if(!variable.hasTipoAsignado()){
        variable.tipo_asignado = getTipo(valor);
        variable.valor = valor;
      }
      //Si tiene tipo asignado
      else {
        //Validación de tipos
        if(variable.tipo_asignado != getTipo(valor) && valor != null){
          Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo de dato diferente a la variable ${this.id}`}));
          return;
        }
        //Asigno el valor recibido
        variable.valor = valor;
      }
    }
    //Si es mas igual o menos igual
    else if(this.tipo_igual == '+=' || this.tipo_igual == '-='){

    }
  }

}
