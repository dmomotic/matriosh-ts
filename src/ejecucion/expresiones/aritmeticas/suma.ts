import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class Suma extends Instruccion{
  expIzq: Instruccion;
  expDer: Instruccion;

  constructor(linea: string, expIzq: Instruccion, expDer: Instruccion){
    super(linea);
    Object.assign(this, {expIzq, expDer});
  }

  ejecutar(e: Entorno) {
    const exp1 = this.expIzq.ejecutar(e);
    const exp2 = this.expDer.ejecutar(e);

    //Validacion de errores
    if(exp1 == null || exp2 == null){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una suma con un operador null`}));
      return;
    }

    //Solo se pueden sumar strings y numbers
    if(typeof exp1 == 'boolean' || typeof exp2 == 'boolean' || exp1 instanceof Object || exp2 instanceof Object){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una suma entre un operando tipo ${typeof exp1} y un operando tipo ${typeof exp2}`}));
      return typeof exp1 == 'number' && typeof exp2 == 'number' ? 0 : ''; //Retorno valor por defecto para que continue
    }

    //Si se puede realizar la suma retorno el valor
    return exp1 + exp2;
  }

}
