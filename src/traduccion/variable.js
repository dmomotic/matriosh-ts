"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
class Variable {
    constructor({ id, tipo = 4 /* SIN_ASIGNAR */, reasignable = false }) {
        Object.assign(this, { id, tipo, reasignable, idnuevo: id });
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
        this.idNuevo = nuevo;
    }
}
exports.Variable = Variable;
