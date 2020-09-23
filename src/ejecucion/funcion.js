"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
class Funcion {
    constructor(id, instrucciones, tipo_return = 5 /* VOID */, lista_parametros = null) {
        Object.assign(this, { id, instrucciones, tipo_return, lista_parametros });
    }
    hasReturn() {
        return this.tipo_return != 5 /* VOID */;
    }
    hasParametros() {
        return this.lista_parametros != null;
    }
    getParametrosSize() {
        return this.hasParametros() ? this.lista_parametros.length : 0;
    }
}
exports.Funcion = Funcion;
