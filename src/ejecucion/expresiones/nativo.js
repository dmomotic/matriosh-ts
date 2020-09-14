"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nativo = void 0;
const instruccion_1 = require("../instruccion");
class Nativo extends instruccion_1.Instruccion {
    constructor(linea, valor) {
        super(linea);
        Object.assign(this, { valor });
    }
    ejecutar(e) {
        return this.valor;
    }
}
exports.Nativo = Nativo;
