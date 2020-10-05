"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entorno = void 0;
class Entorno {
    constructor(padre, nombre) {
        this.padre = padre != null ? padre : null;
        this.nombre = nombre != null ? nombre : null;
        this.variables = new Map();
        this.funciones = new Map();
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
            let variable = e.variables.get(id);
            if (variable != null)
                return variable;
        }
        return null;
    }
    getNombreFuncion(id) {
        let nombre = id;
        let flag = false;
        for (let e = this; e != null; e = e.padre) {
            if (e.generadoPorFuncion()) {
                flag = true;
                nombre = e.getNombreFuncionGeneradora() + '_' + nombre;
            }
        }
        return flag ? nombre + '_' : nombre;
    }
    setFuncion(funcion) {
        let e = this;
        if (e.padre != null) {
            e = e.padre;
        }
        e.funciones.set(funcion.id, funcion);
    }
    getFuncion(id) {
        for (let e = this; e != null; e = e.padre) {
            const fn = e.funciones.get(id);
            if (fn != null)
                return fn;
        }
        return null;
    }
}
exports.Entorno = Entorno;
