"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayLengthAccesosType = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const arreglo_1 = require("../../arreglo");
const instruccion_1 = require("../../instruccion");
const type_1 = require("../../type");
class ArrayLengthAccesosType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        //Busqueda y validaciones de variable
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
            return;
        }
        //Si no es un type
        if (!variable.isType()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} no es de tipo Type` }));
            return;
        }
        let actual = variable.getValor();
        //Realizo los accesos al type
        for (let acceso of this.lista_accesos) {
            //Si es un acceso a un atributo
            if (typeof acceso == 'string') {
                //El valor actual debe ser un type
                if (!(actual instanceof type_1.Type)) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al atributo ${acceso} porque no es un type` }));
                    return;
                }
                //Si es un type verifico que exista la propiedad
                if (!actual.hasAtributo(acceso)) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la propiedad ${acceso} en ${actual}` }));
                    return;
                }
                const variable = actual.getAtributo(acceso);
                actual = variable.getValor();
            }
            //Si es un acceso de un arreglo
            else if (acceso instanceof Array) {
                //Realizo el acceso
                for (let exp of acceso) {
                    const index = exp.ejecutar(e);
                    //Validacion de index
                    if (index == null || typeof index != 'number') {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al index ${index} en ${this.id}` }));
                        return;
                    }
                    //Validacion de arreglo
                    if (!(actual instanceof arreglo_1.Arreglo)) {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al length de un arreglo` }));
                        return;
                    }
                    //Arreglo debe tener el indice
                    if (!actual.hasIndex(index)) {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                        return;
                    }
                    actual = actual.getValue(index);
                }
            }
        }
        if (!(actual instanceof arreglo_1.Arreglo)) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al atributo length en un arreglo verificar: ${this.id}` }));
            return;
        }
        return actual.getSize();
    }
}
exports.ArrayLengthAccesosType = ArrayLengthAccesosType;
