export class Salida {
  private static instance: Salida;
  lista: String[];

  private constructor() {
    this.lista = [];
  }

  public static getInstance(): Salida {
    if (!Salida.instance) {
      Salida.instance = new Salida();
    }
    return Salida.instance;
  }

  public push(linea: string): void {
    this.lista.push(linea);
  }

  public clear(): void{
    this.lista = [];
  }
}
