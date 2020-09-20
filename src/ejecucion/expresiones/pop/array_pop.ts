import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class ArrayPop extends Instruccion{
  id: string;

  constructor(linea: string, id: string){
    super(linea);
    Object.assign(this, {id});
  }

  ejecutar(e: Entorno) {
    const variable = e.getVariable(this.id);
    //Si no se encuentra la variable
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}`}));
      return;
    }
    //Si no es un array
    if(!variable.isArray()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede ejecutar pop() en ${this.id} porque no es un Arreglo`}));
      return;
    }

    const arreglo = variable.getValor() as Arreglo;
    return arreglo.pop();
  }

}
