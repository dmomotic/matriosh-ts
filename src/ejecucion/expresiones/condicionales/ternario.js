"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const instruccion_1 = require("../../instruccion");
class Ternario extends instruccion_1.Instruccion {
    constructor(linea, condicion, exp_true, exp_false) {
        super(linea);
        Object.assign(this, { condicion, exp_true, exp_false });
    }
    ejecutar(e) {
        return this.condicion.ejecutar(e) ? this.exp_true.ejecutar(e) : this.exp_false.ejecutar(e);
    }
}
exports.Ternario = Ternario;
