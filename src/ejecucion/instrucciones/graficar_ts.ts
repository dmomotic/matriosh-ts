import { Entorno } from "../entorno";
import { Entornos } from "../entornos";
import { Instruccion } from "../instruccion";

export class GraficarTS extends Instruccion{

  constructor(linea: string){
    super(linea);
  }

  ejecutar(e: Entorno) {
    Entornos.getInstance().push(e);
  }

}
