"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraficarTS = void 0;
const entornos_1 = require("../entornos");
const instruccion_1 = require("../instruccion");
class GraficarTS extends instruccion_1.Instruccion {
    constructor(linea) {
        super(linea);
    }
    ejecutar(e) {
        entornos_1.Entornos.getInstance().push(e);
    }
}
exports.GraficarTS = GraficarTS;
