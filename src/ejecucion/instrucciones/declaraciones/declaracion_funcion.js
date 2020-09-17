"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionFuncion = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const funcion_1 = require("../../funcion");
const instruccion_1 = require("../../instruccion");
class DeclaracionFuncion extends instruccion_1.Instruccion {
    constructor(linea, id, instrucciones) {
        super(linea);
        Object.assign(this, { id, instrucciones });
    }
    ejecutar(e) {
        const funcion = e.getFuncion(this.id);
        //Validación de funcion con nombre unico en el entorno
        if (funcion) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Ya existe una funcion con el nombre ${this.id} en este ambito` }));
            return;
        }
        e.setFuncion(new funcion_1.Funcion(this.id, this.instrucciones));
    }
}
exports.DeclaracionFuncion = DeclaracionFuncion;
