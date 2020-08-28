"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entorno = void 0;
class Entorno {
    constructor(padre, nombre) {
        this.padre = padre != null ? padre : null;
        this.nombre = nombre != null ? nombre : null;
    }
    generadoPorFuncion() {
        return this.nombre != null;
    }
    getNombreFuncionGeneradora() {
        return this.nombre;
    }
    setVariable(variable) {
        this.variables.set(variable.id, variable);
    }
    getVariable(id) {
        for (let e = this; e != null; e = e.padre) {
            let variable = e.variables.get('id');
            if (variable != null)
                return variable;
        }
        return null;
    }
}
exports.Entorno = Entorno;
