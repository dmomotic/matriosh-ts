"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoType = void 0;
const error_1 = require("../../arbol/error");
const errores_1 = require("../../arbol/errores");
const instruccion_1 = require("../instruccion");
class AccesoType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        //Busqueda de variable en el entorno
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro ninguna variable con el id ${this.id}` }));
        }
    }
}
exports.AccesoType = AccesoType;
