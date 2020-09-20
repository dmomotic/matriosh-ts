import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class Not extends Instruccion{
  exp: Instruccion;

  constructor(linea: string, exp: Instruccion){
    super(linea);
    Object.assign(this, {exp});
  }

  ejecutar(e: Entorno) {
    const exp1 = this.exp.ejecutar(e);

    //Validacion de errores
    // if(exp1 == null || exp2 == null){
    //   Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion menor que con un operador null`}));
    //   return;
    // }

    return !exp1;

    //Solo se pueden realizar operacion mayor que con numbers y strings
    // if((typeof exp1 == 'number' || typeof exp1 == 'string') && (typeof exp2 == 'number' || typeof exp2 == 'string')){
    //   return exp1 > exp2;
    // }

    //Si no es error
    // Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion mayor que entre un operando tipo ${typeof exp1} y un operando tipo ${typeof exp2}`}));
  }
}
