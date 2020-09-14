"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTipo = void 0;
function getTipo(valor) {
    if (typeof valor == 'string')
        return 0 /* STRING */;
    if (typeof valor == 'number')
        return 1 /* NUMBER */;
    if (typeof valor == 'boolean')
        return 2 /* BOOLEAN */;
    //TODO: Terminar para los demas tipos
    return null;
}
exports.getTipo = getTipo;
