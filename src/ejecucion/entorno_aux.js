"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntornoAux = void 0;
class EntornoAux {
    constructor() {
        this.estoyBuscandoEnFuncion = false;
    }
    static getInstance() {
        if (!EntornoAux.instance) {
            EntornoAux.instance = new EntornoAux();
        }
        return EntornoAux.instance;
    }
}
exports.EntornoAux = EntornoAux;
