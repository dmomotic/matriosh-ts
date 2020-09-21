import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Continue as InstanciaContinue } from '../../continue';

export class Continue extends Instruccion{

  constructor(linea: string){
    super(linea);
  }

  ejecutar(e: Entorno) {
    return new InstanciaContinue();
  }

}
