import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class Ternario extends Instruccion{
  condicion: Instruccion;
  exp_true: Instruccion;
  exp_false: Instruccion;

  constructor(linea: string, condicion: Instruccion, exp_true: Instruccion, exp_false: Instruccion){
    super(linea);
    Object.assign(this, {condicion, exp_true, exp_false});
  }

  ejecutar(e: Entorno) {
    return this.condicion.ejecutar(e) ? this.exp_true.ejecutar(e) : this.exp_false.ejecutar(e);
  }

}
