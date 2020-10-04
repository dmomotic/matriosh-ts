"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mayor = void 0;
const instruccion_1 = require("../../instruccion");
class Mayor extends instruccion_1.Instruccion {
    constructor(linea, expIzq, expDer) {
        super(linea);
        Object.assign(this, { expIzq, expDer });
    }
    ejecutar(e) {
        const exp1 = this.expIzq.ejecutar(e);
        const exp2 = this.expDer.ejecutar(e);
        //Validacion de errores
        if (exp1 == null || exp2 == null) {
            //Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion mayor que con un operador null`}));
            return false;
        }
        return exp1 > exp2;
        //Solo se pueden realizar operacion mayor que con numbers y strings
        // if((typeof exp1 == 'number' || typeof exp1 == 'string') && (typeof exp2 == 'number' || typeof exp2 == 'string')){
        //   return exp1 > exp2;
        // }
        //Si no es error
        // Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion mayor que entre un operando tipo ${typeof exp1} y un operando tipo ${typeof exp2}`}));
    }
}
exports.Mayor = Mayor;
