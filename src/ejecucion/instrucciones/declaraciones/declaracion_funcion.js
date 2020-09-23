"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionFuncion = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const funcion_1 = require("../../funcion");
const instruccion_1 = require("../../instruccion");
class DeclaracionFuncion extends instruccion_1.Instruccion {
    constructor(linea, id, instrucciones, tipo_return = 5 /* VOID */, lista_parametros = null) {
        super(linea);
        Object.assign(this, { id, instrucciones, tipo_return, lista_parametros });
    }
    ejecutar(e) {
        const funcion = e.getFuncion(this.id);
        //Validación de funcion con nombre unico en el entorno
        if (funcion) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Ya existe una funcion con el nombre ${this.id} en este ambito` }));
            return;
        }
        //Validacion nombre de parametros unicos
        if (this.lista_parametros) {
            const items = [];
            for (let variable of this.lista_parametros) {
                if (items.includes(variable.id)) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'Semantico', linea: this.linea, descripcion: `La funcion ${this.id} ya tiene un parametro declarado con el nombre ${variable.id}` }));
                    return;
                }
                items.push(variable.id);
            }
        }
        e.setFuncion(new funcion_1.Funcion(this.id, this.instrucciones, this.tipo_return, this.lista_parametros));
    }
}
exports.DeclaracionFuncion = DeclaracionFuncion;
