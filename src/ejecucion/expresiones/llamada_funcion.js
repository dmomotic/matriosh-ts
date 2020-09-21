"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamadaFuncion = void 0;
const error_1 = require("../../arbol/error");
const errores_1 = require("../../arbol/errores");
const entorno_1 = require("../entorno");
const instruccion_1 = require("../instruccion");
const return_1 = require("../return");
class LlamadaFuncion extends instruccion_1.Instruccion {
    constructor(linea, id) {
        super(linea);
        Object.assign(this, { id });
    }
    ejecutar(e) {
        //Busco la funcion en el entorno
        const funcion = e.getFuncion(this.id);
        if (!funcion) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la funcion ${this.id} en este entorno` }));
            return;
        }
        const instrucciones = funcion.instrucciones;
        const entorno = new entorno_1.Entorno(e);
        for (let instruccion of instrucciones) {
            const resp = instruccion.ejecutar(entorno);
            //Validacion instruccion Return
            if (resp instanceof return_1.Return) {
                //Si no tiene un valor de retorno solo paro la funcion
                if (!resp.hasValue())
                    return;
                //De lo contrario retorno el valor
                return resp.getValue();
            }
        }
    }
}
exports.LlamadaFuncion = LlamadaFuncion;
