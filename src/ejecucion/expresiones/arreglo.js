"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
const instruccion_1 = require("../instruccion");
const arreglo_1 = require("../arreglo");
class Arreglo extends instruccion_1.Instruccion {
    constructor(linea, lista_expresiones = null) {
        super(linea);
        this.lista_expresiones = lista_expresiones;
    }
    ejecutar(e) {
        var _a;
        const arreglo = [];
        (_a = this.lista_expresiones) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
            if (item instanceof instruccion_1.Instruccion) {
                const valor = item.ejecutar(e);
                arreglo.push(valor);
            }
        });
        return new arreglo_1.Arreglo(arreglo);
    }
}
exports.Arreglo = Arreglo;
