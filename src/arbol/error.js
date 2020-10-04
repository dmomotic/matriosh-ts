"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor({ tipo, linea, descripcion }) {
        // const valor = tipo == 'lexico' ? +linea + 1 : linea;
        const valor = linea;
        Object.assign(this, { tipo, linea: valor.toString(), descripcion });
    }
}
exports.Error = Error;
