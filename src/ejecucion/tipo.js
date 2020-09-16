"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTipo = void 0;
const arreglo_1 = require("./arreglo");
const type_1 = require("./type");
function getTipo(valor) {
    if (typeof valor == 'string')
        return 0 /* STRING */;
    if (typeof valor == 'number')
        return 1 /* NUMBER */;
    if (typeof valor == 'boolean')
        return 2 /* BOOLEAN */;
    if (valor instanceof type_1.Type)
        return 3 /* TYPE */;
    if (valor instanceof arreglo_1.Arreglo)
        return 4 /* ARRAY */;
    if (valor == null)
        return null;
    return null;
}
exports.getTipo = getTipo;
