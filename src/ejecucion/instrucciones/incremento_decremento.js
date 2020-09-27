"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncrementoDecremento = void 0;
const errores_1 = require("../../arbol/errores");
const error_1 = require("../../arbol/error");
const instruccion_1 = require("../instruccion");
class IncrementoDecremento extends instruccion_1.Instruccion {
    constructor(linea, id, incremento) {
        super(linea);
        Object.assign(this, { id, incremento });
    }
    ejecutar(e) {
        //Comprobacion de variable existente
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
            return;
        }
        //Si la variable tiene un valor asignado
        if (variable.getValor() == null) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar la operacion con un null` }));
            return;
        }
        //Si es un incremento
        if (this.incremento) {
            variable.valor++;
        }
        //Si es un decremento
        else {
            variable.valor--;
        }
    }
}
exports.IncrementoDecremento = IncrementoDecremento;
