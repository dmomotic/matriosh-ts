"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor({ tipo, linea, descripcion }) {
        const valor = +linea + 1;
        Object.assign(this, { tipo, linea: valor.toString(), descripcion });
    }
}
exports.Error = Error;
