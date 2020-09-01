"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor({ tipo, linea, descripcion }) {
        Object.assign(this, { tipo, linea, descripcion });
    }
}
exports.Error = Error;
