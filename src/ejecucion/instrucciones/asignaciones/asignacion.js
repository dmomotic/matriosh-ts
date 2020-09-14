"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const instruccion_1 = require("../../instruccion");
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
        }
        //Si es mas igual o menos igual
        if (this.tipo_igual == '+=' || this.tipo_igual == '-=') {
        }
    }
}
exports.Asignacion = Asignacion;
