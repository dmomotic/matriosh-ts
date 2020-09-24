"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
const arreglo_1 = require("./arreglo");
const type_1 = require("./type");
class Variable {
    constructor({ reasignable, id, tipo_asignado = null, valor = null, dimensiones = 0, type_generador = null }) {
        Object.assign(this, { id, tipo_asignado, valor, reasignable, dimensiones, type_generador });
    }
    isArray() {
        // return this.dimensiones > 0;
        return this.tipo_asignado == 4 /* ARRAY */ || this.valor instanceof arreglo_1.Arreglo;
    }
    isType() {
        // return this.tipo_asignado == TIPO_DATO.TYPE && !this.isArray() && this.type_generador != null;
        return this.tipo_asignado == 3 /* TYPE */ || this.valor instanceof type_1.Type;
    }
    isNumber() {
        return this.tipo_asignado == 1 /* NUMBER */ || typeof this.valor == 'number';
    }
    hasTipoAsignado() {
        return this.tipo_asignado != null;
    }
    isReasignable() {
        return this.reasignable;
    }
    getValor() {
        return this.valor;
    }
    toString() {
        let salida = `Variable: ${this.id} - Valor: ${this.valor} - Constante: ${this.reasignable ? 'No' : 'Si'}`;
        return salida;
    }
}
exports.Variable = Variable;
