"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntornoAux = void 0;
class EntornoAux {
    constructor() {
        this.lista = [];
    }
    static getInstance() {
        if (!EntornoAux.instance) {
            EntornoAux.instance = new EntornoAux();
        }
        return EntornoAux.instance;
    }
    estoyEjecutandoFuncion() {
        return this.lista.length > 0;
    }
    inicioEjecucionFuncion() {
        this.lista.push(true);
    }
    finEjecucionFuncion() {
        this.lista.pop();
    }
}
exports.EntornoAux = EntornoAux;
