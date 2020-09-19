import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class MasMas extends Instruccion{
  exp: Instruccion;

  constructor(linea: string, exp: Instruccion){
    super(linea);
    Object.assign(this, {exp});
  }

  ejecutar(e: Entorno) {
    //TODO: Hacer porque esta bien yuca
    throw new Error("Method not implemented.");
  }

}
