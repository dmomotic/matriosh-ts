import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class And extends Instruccion{
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
    // if(exp1 == null || exp2 == null){
    //   Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion menor que con un operador null`}));
    //   return;
    // }

    return exp1 && exp2;

    //Solo se pueden realizar operacion mayor que con numbers y strings
    // if((typeof exp1 == 'number' || typeof exp1 == 'string') && (typeof exp2 == 'number' || typeof exp2 == 'string')){
    //   return exp1 > exp2;
    // }

    //Si no es error
    // Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion mayor que entre un operando tipo ${typeof exp1} y un operando tipo ${typeof exp2}`}));
  }
}
