"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
class Variable {
    constructor({ reasignable, id, tipo_asignado = null, valor = null, dimensiones = 0, type_generador = null }) {
        Object.assign(this, { id, tipo_asignado, valor, reasignable, dimensiones, type_generador });
    }
    isArray() {
        return this.dimensiones > 0;
    }
    isType() {
        return this.tipo_asignado == 3 /* TYPE */ && !this.isArray() && this.type_generador != null;
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
}
exports.Variable = Variable;
