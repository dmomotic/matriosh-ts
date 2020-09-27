export class EntornoAux {
  private static instance: EntornoAux;
  lista: Array<any>;

  private constructor() {
    this.lista = [];
  }

  public static getInstance(): EntornoAux {
    if (!EntornoAux.instance) {
      EntornoAux.instance = new EntornoAux();
    }
    return EntornoAux.instance;
  }

  public estoyEjecutandoFuncion(): boolean {
    return this.lista.length > 0;
  }

  public inicioEjecucionFuncion(): void {
    this.lista.push(true);
  }

  public finEjecucionFuncion(): void {
    this.lista.pop();
  }
}
