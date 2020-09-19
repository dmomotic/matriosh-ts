export class EntornoAux {
  private static instance: EntornoAux;
  estoyBuscandoEnFuncion: boolean;

  private constructor() {
    this.estoyBuscandoEnFuncion = false;
  }

  public static getInstance(): EntornoAux {
    if (!EntornoAux.instance) {
      EntornoAux.instance = new EntornoAux();
    }
    return EntornoAux.instance;
  }
}
