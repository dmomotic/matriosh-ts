"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasMas = void 0;
const instruccion_1 = require("../../instruccion");
class MasMas extends instruccion_1.Instruccion {
    constructor(linea, exp) {
        super(linea);
        Object.assign(this, { exp });
    }
    ejecutar(e) {
        //TODO: Hacer porque esta bien yuca
        throw new Error("Method not implemented.");
    }
}
exports.MasMas = MasMas;
