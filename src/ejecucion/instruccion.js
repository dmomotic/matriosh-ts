"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruccion = void 0;
class Instruccion {
    constructor(linea) {
        const valor = +linea + 1;
        Object.assign(this, { linea: valor.toString() });
    }
    getLinea() {
        return this.linea;
    }
}
exports.Instruccion = Instruccion;
