"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayLengthAccesosArreglo = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const arreglo_1 = require("../../arreglo");
const instruccion_1 = require("../../instruccion");
class ArrayLengthAccesosArreglo extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        const variable = e.getVariable(this.id);
        //Si no se encontro la variable
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
            return;
        }
        //Si no es un array
        if (!variable.isArray()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede obtener la longitud de la variable ${this.id} porque no es un arreglo` }));
            return;
        }
        //Realizo los accesos al arreglo de forma recursiva
        let arreglo = variable.getValor();
        for (let instruccion of this.lista_accesos) {
            const index = instruccion.ejecutar(e);
            //Validacion de index
            if (index == null || typeof index != 'number') {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al index ${index} en ${this.id}` }));
                return;
            }
            //Validacion de arreglo
            if (!(arreglo instanceof arreglo_1.Arreglo)) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al length de un arreglo` }));
                return;
            }
            //Arreglo debe tener el indice
            if (!arreglo.hasIndex(index)) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                return;
            }
            arreglo = arreglo.getValue(index);
        }
        if (arreglo == null || !(arreglo instanceof arreglo_1.Arreglo)) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al length de un arreglo` }));
            return;
        }
        return arreglo.getSize();
    }
}
exports.ArrayLengthAccesosArreglo = ArrayLengthAccesosArreglo;
