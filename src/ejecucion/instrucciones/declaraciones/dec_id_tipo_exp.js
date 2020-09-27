"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecIdTipoExp = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const entorno_aux_1 = require("../../entorno_aux");
const instruccion_1 = require("../../instruccion");
const tipo_1 = require("../../tipo");
const variable_1 = require("../../variable");
class DecIdTipoExp extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id, tipo, exp, type_generador) {
        super(linea);
        Object.assign(this, { reasignable, id, tipo, exp, type_generador });
    }
    ejecutar(e) {
        //Validacion de variable existente
        let variable = e.getVariable(this.id);
        if (variable && !entorno_aux_1.EntornoAux.getInstance().estoyEjecutandoFuncion()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Ya existe una variable con el nombre ${this.id} declarada en este entorno` }));
            return;
        }
        //Si es un type busco el type para comprobar que exista
        if (this.tipo == 3 /* TYPE */ && this.type_generador != null) {
            const type = e.getType(this.type_generador);
            if (!type) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede declarar la variable ${this.id} del tipo ${this.type_generador} porque no existe ningún type con ese identificador` }));
                return;
            }
        }
        const valor = this.exp.ejecutar(e);
        if (this.tipo != tipo_1.getTipo(valor)) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo diferente a la variable ${this.id}` }));
            return;
        }
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id, tipo_asignado: this.tipo, type_generador: this.type_generador, valor });
        e.setVariable(variable);
    }
}
exports.DecIdTipoExp = DecIdTipoExp;
