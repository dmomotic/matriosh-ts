"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errores = void 0;
class Errores {
    constructor() {
        this.lista = [];
    }
    static getInstance() {
        if (!Errores.instance) {
            Errores.instance = new Errores();
        }
        return Errores.instance;
    }
    push(error) {
        this.lista.push(error);
    }
}
exports.Errores = Errores;
