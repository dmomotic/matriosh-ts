"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
class Funcion {
    constructor({ id }) {
        Object.assign(this, { id });
    }
    setIdNuevo(nuevo) {
        this.idNuevo = nuevo;
    }
    getIdNuevo() {
        return this.idNuevo != null && this.idNuevo.trim() !== '' ? this.idNuevo : this.id;
    }
}
exports.Funcion = Funcion;
