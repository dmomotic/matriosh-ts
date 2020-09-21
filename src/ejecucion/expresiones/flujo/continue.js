"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continue = void 0;
const instruccion_1 = require("../../instruccion");
const continue_1 = require("../../continue");
class Continue extends instruccion_1.Instruccion {
    constructor(linea) {
        super(linea);
    }
    ejecutar(e) {
        return new continue_1.Continue();
    }
}
exports.Continue = Continue;
