"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entornos = void 0;
const _ = require("lodash");
class Entornos {
    constructor() {
        this.lista = [];
    }
    static getInstance() {
        if (!Entornos.instance) {
            Entornos.instance = new Entornos();
        }
        return Entornos.instance;
    }
    push(entorno) {
        this.lista.push(_.cloneDeep(entorno));
    }
    clear() {
        this.lista = [];
    }
}
exports.Entornos = Entornos;
