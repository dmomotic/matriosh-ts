"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Suma = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
class Suma extends instruccion_1.Instruccion {
    constructor(linea, expIzq, expDer) {
        super(linea);
        Object.assign(this, { expIzq, expDer });
    }
    ejecutar(e) {
        const exp1 = this.expIzq.ejecutar(e);
        const exp2 = this.expDer.ejecutar(e);
        //Validacion de errores
        if (exp1 == null || exp2 == null) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una suma con un operador null` }));
            return;
        }
        //Solo se pueden sumar strings y numbers
        if (typeof exp1 == 'boolean' || typeof exp2 == 'boolean' || exp1 instanceof Object || exp2 instanceof Object) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una suma entre un operando tipo ${typeof exp1} y un operando tipo ${typeof exp2}` }));
            return typeof exp1 == 'number' && typeof exp2 == 'number' ? 0 : ''; //Retorno valor por defecto para que continue
        }
        //Si se puede realizar la suma retorno el valor
        return exp1 + exp2;
    }
}
exports.Suma = Suma;
