"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const salida_1 = require("../../arbol/salida");
const instruccion_1 = require("../instruccion");
const _ = require("lodash");
class Log extends instruccion_1.Instruccion {
    constructor(linea, instrucciones) {
        super(linea);
        Object.assign(this, { instrucciones });
    }
    ejecutar(e) {
        this.instrucciones.forEach(inst => {
            let res = inst.ejecutar(e);
            res = _.cloneDeep(res);
            const salida = res !== null && res !== void 0 ? res : 'null';
            salida_1.Salida.getInstance().push(salida);
        });
    }
}
exports.Log = Log;
