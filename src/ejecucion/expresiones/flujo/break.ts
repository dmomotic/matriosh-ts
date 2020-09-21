import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Break as InstanciaBreak } from '../../break';

export class Break extends Instruccion{

  constructor(linea: string){
    super(linea);
  }

  ejecutar(e: Entorno) {
    return new InstanciaBreak();
  }

}
