"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
class Variable {
    constructor({ id, tipo = 4 /* SIN_ASIGNAR */, reasignable = false }) {
        Object.assign(this, { id, tipo, reasignable, idnuevo: null });
    }
    getTipo() {
        return this.tipo;
    }
    setTipo(tipo) {
        this.tipo = tipo;
    }
    isReasignable() {
        return this.reasignable;
    }
    setIdNuevo(nuevo) {
        //this.idNuevo = nuevo;
    }
    getIdNuevo() {
        return this.idNuevo != null && this.idNuevo.trim() !== '' ? this.idNuevo : this.id;
    }
}
exports.Variable = Variable;
