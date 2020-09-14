"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salida = void 0;
class Salida {
    constructor() {
        this.lista = [];
    }
    static getInstance() {
        if (!Salida.instance) {
            Salida.instance = new Salida();
        }
        return Salida.instance;
    }
    push(linea) {
        this.lista.push(linea);
    }
    clear() {
        this.lista = [];
    }
}
exports.Salida = Salida;
