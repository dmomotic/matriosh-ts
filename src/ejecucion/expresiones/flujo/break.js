"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const instruccion_1 = require("../../instruccion");
const break_1 = require("../../break");
class Break extends instruccion_1.Instruccion {
    constructor(linea) {
        super(linea);
    }
    ejecutar(e) {
        return new break_1.Break();
    }
}
exports.Break = Break;
