import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class MenosMenos extends Instruccion{

  id: string;

  constructor(linea: string, id: string){
    super(linea);
    Object.assign(this, {id});
  }

  ejecutar(e: Entorno) {
    //Validacion de variable
    const variable = e.getVariable(this.id);
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable con id ${this.id}`}));
      return;
    }

    const valor = variable.getValor();
    //Si no es un numero es error
    if(!variable.isNumber()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede aplicar el operador -- en la variable ${this.id} porque no es de tipo numerico`}));
      return;
    }
    //Si el valor no esta definido
    if(valor == null || typeof valor != 'number'){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} no tiene un valor asignado de tipo numerico`}));
      return;
    }

    variable.valor = valor - 1;
    return valor;
  }

}
