"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
const tipo_1 = require("../../tipo");
class Asignacion extends instruccion_1.Instruccion {
    constructor(linea, id, tipo_igual, exp) {
        super(linea);
        Object.assign(this, { id, tipo_igual, exp });
    }
    ejecutar(e) {
        //Busqueda de id
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No fue posible encontrar la variable ${this.id}, para realizar la asignación` }));
            return;
        }
        //Si no es reasignable
        if (!variable.isReasignable()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede volver a asignar la variable ${this.id}` }));
            return;
        }
        //Si es una asignacion normal
        if (this.tipo_igual == '=') {
            const valor = this.exp.ejecutar(e);
            //Si no tiene tipo asignado le asigno lo que venga
            if (!variable.hasTipoAsignado()) {
                variable.tipo_asignado = tipo_1.getTipo(valor);
                variable.valor = valor;
            }
            //Si tiene tipo asignado
            else {
                //Validación de tipos
                if (variable.tipo_asignado != tipo_1.getTipo(valor) && valor != null) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo de dato diferente a la variable ${this.id}` }));
                    return;
                }
                //Asigno el valor recibido
                variable.valor = valor;
            }
        }
        //Si es mas igual o menos igual
        else if (this.tipo_igual == '+=' || this.tipo_igual == '-=') {
        }
    }
}
exports.Asignacion = Asignacion;
