import { Entorno } from "./entorno";
import * as _ from 'lodash';

export class Entornos {
  private static instance: Entornos;
  lista: Entorno[];

  private constructor() {
    this.lista = [];
  }

  public static getInstance(): Entornos {
    if (!Entornos.instance) {
      Entornos.instance = new Entornos();
    }
    return Entornos.instance;
  }

  public push(entorno: Entorno): void {
    this.lista.push(_.cloneDeep(entorno));
  }

  public clear(): void{
    this.lista = [];
  }
}
