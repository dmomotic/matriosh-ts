import { Entorno } from '../entorno';
import { Instruccion } from '../instruccion';

export class Nativo extends Instruccion{
  valor: any;

  constructor(linea: string, valor: any){
    super(linea);
    Object.assign(this, {valor});
  }

  ejecutar(e: Entorno) {
    return this.valor;
  }

}
