import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Return as InstanciaReturn } from '../../return';

export class Return extends Instruccion {
  linea: string;
  has_value: boolean;
  value: Instruccion;

  constructor(linea: string, has_value: boolean, value: Instruccion = null) {
    super(linea);
    Object.assign(this, { has_value, value });
  }

  ejecutar(e: Entorno) {
    if(this.has_value && this.value != null){
      const valor = this.value.ejecutar(e);
      return new InstanciaReturn(this.has_value, valor);
    }
    else{
      return new InstanciaReturn(this.has_value);
    }
  }

}
