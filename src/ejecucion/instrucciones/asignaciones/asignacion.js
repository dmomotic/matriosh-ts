"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
const tipo_1 = require("../../tipo");
const _ = require("lodash");
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
        let valor = this.exp.ejecutar(e);
        valor = _.cloneDeep(valor);
        //Si no tiene tipo asignado le asigno lo que venga
        if (!variable.hasTipoAsignado()) {
            if (valor != null) {
                variable.tipo_asignado = tipo_1.getTipo(valor);
            }
        }
        //Si tiene tipo asignado
        else {
            //Validación de tipos
            if (variable.tipo_asignado != tipo_1.getTipo(valor) && valor != null) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo de dato diferente a la variable ${this.id}` }));
                return;
            }
        }
        if (this.tipo_igual == '=') {
            variable.valor = valor;
        }
        else {
            const res = this.tipo_igual == '+=' ? variable.getValor() + valor : variable.getValor() - valor;
            if (res == null) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La operacion de datos ${this.tipo_igual} no puede ser null` }));
                return;
            }
            if (typeof res != 'number' && typeof res != 'string') {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El resultado de la operacion ${this.tipo_igual} no es un tipo de dato valido ${tipo_1.getTipo(res)}` }));
                return;
            }
            if (variable.hasTipoAsignado() && variable.tipo_asignado != tipo_1.getTipo(res)) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo de dato diferente a la variable ${this.id}` }));
                return;
            }
            variable.valor = res;
        }
    }
}
exports.Asignacion = Asignacion;
