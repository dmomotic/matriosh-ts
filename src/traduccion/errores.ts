import { Error } from '../arbol/error';

export class Errores {
  private static instance: Errores;
  lista: Object[];

  private constructor() {
    this.lista = [];
  }

  public static getInstance(): Errores {
    if (!Errores.instance) {
      Errores.instance = new Errores();
    }
    return Errores.instance;
  }

  public push(error: Error): void {
    this.lista.push(error);
  }
}
