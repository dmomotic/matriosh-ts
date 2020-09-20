"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayPop = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
class ArrayPop extends instruccion_1.Instruccion {
    constructor(linea, id) {
        super(linea);
        Object.assign(this, { id });
    }
    ejecutar(e) {
        const variable = e.getVariable(this.id);
        //Si no se encuentra la variable
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
            return;
        }
        //Si no es un array
        if (!variable.isArray()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede ejecutar pop() en ${this.id} porque no es un Arreglo` }));
            return;
        }
        const arreglo = variable.getValor();
        return arreglo.pop();
    }
}
exports.ArrayPop = ArrayPop;
