"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenosMenos = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
class MenosMenos extends instruccion_1.Instruccion {
    constructor(linea, id) {
        super(linea);
        Object.assign(this, { id });
    }
    ejecutar(e) {
        //Validacion de variable
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable con id ${this.id}` }));
            return;
        }
        const valor = variable.getValor();
        //Si no es un numero es error
        if (!variable.isNumber()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede aplicar el operador -- en la variable ${this.id} porque no es de tipo numerico` }));
            return;
        }
        //Si el valor no esta definido
        if (valor == null || typeof valor != 'number') {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} no tiene un valor asignado de tipo numerico` }));
            return;
        }
        variable.valor = valor - 1;
        return valor;
    }
}
exports.MenosMenos = MenosMenos;
