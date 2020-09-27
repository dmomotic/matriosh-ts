"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecId = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const entorno_aux_1 = require("../../entorno_aux");
const instruccion_1 = require("../../instruccion");
const variable_1 = require("../../variable");
class DecId extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id) {
        super(linea);
        Object.assign(this, { id, reasignable });
    }
    ejecutar(e) {
        //Validacion de variabl existente
        let variable = e.getVariable(this.id);
        if (variable && !entorno_aux_1.EntornoAux.getInstance().estoyEjecutandoFuncion()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El id: ${this.id} ya fue declarado en este entorno` }));
            return;
        }
        //Si es const es un error ya que todo const debe tener un valor asignado
        if (!this.reasignable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Se debe asignar un valor a la variable ${this.id} de tipo const` }));
            return;
        }
        //Registro la variable en mi entorno
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id });
        e.setVariable(variable);
    }
}
exports.DecId = DecId;
