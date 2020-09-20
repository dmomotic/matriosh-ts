"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Not = void 0;
const instruccion_1 = require("../../instruccion");
class Not extends instruccion_1.Instruccion {
    constructor(linea, exp) {
        super(linea);
        Object.assign(this, { exp });
    }
    ejecutar(e) {
        const exp1 = this.exp.ejecutar(e);
        //Validacion de errores
        // if(exp1 == null || exp2 == null){
        //   Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion menor que con un operador null`}));
        //   return;
        // }
        return !exp1;
        //Solo se pueden realizar operacion mayor que con numbers y strings
        // if((typeof exp1 == 'number' || typeof exp1 == 'string') && (typeof exp2 == 'number' || typeof exp2 == 'string')){
        //   return exp1 > exp2;
        // }
        //Si no es error
        // Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede realizar una operacion mayor que entre un operando tipo ${typeof exp1} y un operando tipo ${typeof exp2}`}));
    }
}
exports.Not = Not;
