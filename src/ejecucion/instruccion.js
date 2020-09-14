"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruccion = void 0;
class Instruccion {
    constructor(linea) {
        Object.assign(this, { linea });
    }
    getLinea() {
        return this.linea;
    }
}
exports.Instruccion = Instruccion;
