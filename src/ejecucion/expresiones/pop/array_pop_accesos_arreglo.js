"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayPopAccesosArreglo = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const arreglo_1 = require("../../arreglo");
const instruccion_1 = require("../../instruccion");
class ArrayPopAccesosArreglo extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        const variable = e.getVariable(this.id);
        //Validacion variable
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
            return;
        }
        //Si la variable no es un arreglo
        if (!variable.isArray()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede ejecutar la funcion pop() porque la variable ${this.id} no es de tipo Arreglo` }));
            return;
        }
        //Realizo los accesos al arreglo
        let arreglo = variable.getValor();
        for (let exp of this.lista_accesos) {
            const index = exp.ejecutar(e);
            //Validacion de index
            if (index == null || typeof index != 'number') {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al index ${index} en ${this.id}` }));
                return;
            }
            //Validacion de arreglo
            if (!(arreglo instanceof arreglo_1.Arreglo)) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede ejecutar pop() en un arreglo` }));
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
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede ejecutar pop() en un arreglo` }));
            return;
        }
        return arreglo.pop();
    }
}
exports.ArrayPopAccesosArreglo = ArrayPopAccesosArreglo;
