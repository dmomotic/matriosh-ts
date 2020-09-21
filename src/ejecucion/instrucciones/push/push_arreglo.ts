import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class PushArreglo extends Instruccion{
  id: string;
  exp: Instruccion;

  constructor(linea: string, id: string, exp: Instruccion){
    super(linea);
    Object.assign(this, {id, exp});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable existente
    const variable = e.getVariable(this.id);
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No existe ninguna variable con el id ${this.id}`}));
      return;
    }
    //Validacion de Arreglo
    if(!variable.isArray()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede ejecutar el metodo push() en ${this.id} porque no es de tipo arreglo`}));
      return;
    }

    const arreglo = variable.getValor();
    //Verifico si el arreglo ya fue inicializado
    if(arreglo == null){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `El arreglo en ${this.id} no ha sido inicializado`}));
      return;
    }

    const valor = this.exp.ejecutar(e);

    //Realizo el push en el arreglo
    if(arreglo instanceof Arreglo){
      arreglo.push(valor);
    }
  }

}
