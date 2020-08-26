export const NodoAST = class NodoAST {
  constructor({ label = 'SIN ETIQUETA', hijos = [], linea = 0} = {}) {
    this.label = label;
    this.hijos = hijos;
    this.linea = linea;
  }
}
