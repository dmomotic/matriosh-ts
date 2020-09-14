import { Entorno } from './entorno';

export abstract class Instruccion{
  linea: string;
  abstract ejecutar(e : Entorno) : any;

  constructor(linea: string){
    Object.assign(this, {linea});
  }

  getLinea() : string{
    return this.linea;
  }
}
