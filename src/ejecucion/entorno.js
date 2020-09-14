"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entorno = void 0;
class Entorno {
    constructor(padre) {
        this.padre = padre != null ? padre : null;
        this.variables = new Map();
        this.types = new Map();
    }
    setVariable(variable) {
        this.variables.set(variable.id, variable);
    }
    getVariable(id) {
        for (let e = this; e != null; e = e.padre) {
            let variable = e.variables.get(id);
            if (variable != null)
                return variable;
        }
        return null;
    }
    hasVariable(id) {
        for (let e = this; e != null; e = e.padre) {
            if (e.variables.has(id)) {
                return true;
            }
        }
        return false;
    }
    updateValorVariable(id, valor) {
        const variable = this.getVariable(id);
        if (variable) {
            variable.valor = valor;
        }
    }
    getType(id) {
        for (let e = this; e != null; e = e.padre) {
            let type = e.types.get(id);
            if (type != null)
                return type;
        }
        return null;
    }
    setType(type) {
        this.types.set(type.id, type);
    }
}
exports.Entorno = Entorno;
