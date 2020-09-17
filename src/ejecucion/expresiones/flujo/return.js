"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const instruccion_1 = require("../../instruccion");
const return_1 = require("../../return");
class Return extends instruccion_1.Instruccion {
    constructor(linea, has_value, value = null) {
        super(linea);
        Object.assign(this, { has_value, value });
    }
    ejecutar(e) {
        if (this.has_value && this.value != null) {
            const valor = this.value.ejecutar(e);
            return new return_1.Return(this.has_value, valor);
        }
        else {
            return new return_1.Return(this.has_value);
        }
    }
}
exports.Return = Return;
