import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { Arreglo as InstanciaArreglo } from '../arreglo';

export class Arreglo extends Instruccion {
  lista_expresiones: Array<Instruccion>;

  constructor(linea : string, lista_expresiones: Array<Instruccion> = null){
    super(linea);
    this.lista_expresiones = lista_expresiones;
  }

  ejecutar(e: Entorno) {
    const arreglo = [];
    this.lista_expresiones?.forEach((item : Object) => {
      if(item instanceof Instruccion){
        const valor = item.ejecutar(e);
        arreglo.push(valor);
      }
    });
    return new InstanciaArreglo(arreglo);
  }

}
