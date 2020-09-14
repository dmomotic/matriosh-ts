import { Error } from './error';

export class Errores {
  private static instance: Errores;
  lista: Error[];

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

  public clear(): void{
    this.lista = [];
  }

  public hasErrors() : boolean{
    return this.lista.length > 0;
  }

  public getErrors(): Error[]{
    return this.lista;
  }
}
