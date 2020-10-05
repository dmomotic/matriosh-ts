"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Igual = void 0;
const arreglo_1 = require("../../arreglo");
const instruccion_1 = require("../../instruccion");
class Igual extends instruccion_1.Instruccion {
    constructor(linea, expIzq, expDer) {
        super(linea);
        Object.assign(this, { expIzq, expDer });
    }
    ejecutar(e) {
        const exp1 = this.expIzq.ejecutar(e);
        const exp2 = this.expDer.ejecutar(e);
        //Validacion item por item solo si se esta comparando arreglos
        if (exp1 instanceof arreglo_1.Arreglo && exp2 instanceof arreglo_1.Arreglo) {
            //Si no tienen la misma cantidad de items no son iguales
            if (exp1.getSize() != exp2.getSize())
                return false;
            //Si tienen la misma longitud realizo un recorrido para comparar los items - Esta implementacion funciona solo para los valores nativos
            for (let i = 0; i < exp1.getSize(); i++) {
                if (exp1.getValue(i) != exp2.getValue(i))
                    return false;
            }
            return true;
        }
        return exp1 == exp2;
    }
}
exports.Igual = Igual;
