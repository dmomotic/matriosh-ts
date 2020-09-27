"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecIdExp = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
const tipo_1 = require("../../tipo");
const variable_1 = require("../../variable");
const _ = require("lodash");
const entorno_aux_1 = require("../../entorno_aux");
class DecIdExp extends instruccion_1.Instruccion {
    constructor(linea, reasignable, id, exp) {
        super(linea);
        Object.assign(this, { reasignable, id, exp });
    }
    ejecutar(e) {
        //Validacion de variable existente
        let variable = e.getVariable(this.id);
        if (variable && !entorno_aux_1.EntornoAux.getInstance().estoyEjecutandoFuncion()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Ya existe una variable declarada con el id ${this.id}` }));
            return;
        }
        //Creacion de variable en el entorno
        let valor = this.exp.ejecutar(e);
        valor = _.cloneDeep(valor);
        const tipo_asignado = tipo_1.getTipo(valor);
        variable = new variable_1.Variable({ reasignable: this.reasignable, id: this.id, tipo_asignado, valor });
        e.setVariable(variable);
    }
}
exports.DecIdExp = DecIdExp;
