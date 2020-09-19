import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class Modular extends Instruccion{
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
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion modular con un operador null`}));
      return;
    }

    //Solo se pueden calcular modular con numbers
    if(typeof exp1 == 'number' && typeof exp2 == 'number'){
      //No se puede dividir entre 0
      if(exp2 == 0){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No es posible realizar una operacion modular entre 0`}));
        return;
      }
      return exp1 % exp2;
    }

    //Si no es error
    Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion modular entre un operando tipo ${typeof exp1} y un operando tipo ${typeof exp2}`}));
  }
}
