"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayLengthSimple = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
class ArrayLengthSimple extends instruccion_1.Instruccion {
    constructor(linea, id) {
        super(linea);
        Object.assign(this, { id });
    }
    ejecutar(e) {
        //Busqueda de la variable en el entorno
        const variable = e.getVariable(this.id);
        //Si no existe la variable
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
            return;
        }
        //Si la variable no contiene ningun arreglo
        if (!variable.isArray()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} no es de tipo array, no se puede ejecutar la funcion length` }));
            return;
        }
        //Retorno su longitud
        const arreglo = variable.getValor();
        return arreglo.getSize();
    }
}
exports.ArrayLengthSimple = ArrayLengthSimple;
