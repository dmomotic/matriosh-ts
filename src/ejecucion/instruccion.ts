import { Entorno } from './entorno';

export abstract class Instruccion{
  linea: string;
  abstract ejecutar(e : Entorno) : any;

  constructor(linea: string){
    const valor = +linea + 1;
    Object.assign(this, {linea: valor.toString()});
  }

  getLinea() : string{
    return this.linea;
  }
}
