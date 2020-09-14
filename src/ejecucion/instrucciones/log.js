"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const salida_1 = require("../../arbol/salida");
const instruccion_1 = require("../instruccion");
class Log extends instruccion_1.Instruccion {
    constructor(linea, instrucciones) {
        super(linea);
        Object.assign(this, { instrucciones });
    }
    ejecutar(e) {
        this.instrucciones.forEach(inst => {
            const res = inst.ejecutar(e);
            salida_1.Salida.getInstance().push(res);
        });
    }
}
exports.Log = Log;
