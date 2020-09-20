import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class ArrayLengthSimple extends Instruccion{
  id: string;

  constructor(linea: string, id: string){
    super(linea);
    Object.assign(this, {id});
  }

  ejecutar(e: Entorno) {
    //Busqueda de la variable en el entorno
    const variable = e.getVariable(this.id);
    //Si no existe la variable
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}`}));
      return;
    }
    //Si la variable no contiene ningun arreglo
    if(!variable.isArray()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} no es de tipo array, no se puede ejecutar la funcion length`}));
      return;
    }
    //Retorno su longitud
    const arreglo = variable.getValor() as Arreglo
    return arreglo.getSize();
  }

}
