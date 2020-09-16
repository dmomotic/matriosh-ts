"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoArregloSimple = void 0;
const error_1 = require("../../arbol/error");
const errores_1 = require("../../arbol/errores");
const arreglo_1 = require("../arreglo");
const instruccion_1 = require("../instruccion");
const tipo_1 = require("../tipo");
class AccesoArregloSimple extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        //Busqueda de variable en la tabla de simbolos
        const variable = e.getVariable(this.id);
        //Si no se encontro la variable
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro ninguna variable con el id ${this.id} en este entorno` }));
            ;
            return;
        }
        let res = variable.getValor();
        //Si la variable no es de tipo Array
        if (tipo_1.getTipo(res) != 4 /* ARRAY */) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La variable con id ${this.id} no a sido asignada con un valor de tipo Array` }));
            ;
            return;
        }
        for (let i = 0; i < this.lista_accesos.length; i++) {
            const index = this.lista_accesos[i].ejecutar(e);
            //Validacion de indice
            if (index == null || typeof index != 'number') {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `${index} no es un indice valido` }));
                ;
                return;
            }
            //Si ya es el ultimo acceso
            if (i == this.lista_accesos.length - 1) {
                if (res instanceof arreglo_1.Arreglo) {
                    //Reviso si el arreglo tiene el indice que buscamos
                    if (!res.hasIndex(index)) {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                        return;
                    }
                    return res.getValue(index);
                }
            }
            //Si aun no es el ultimo acceso
            else {
                if (res instanceof arreglo_1.Arreglo) {
                    //Reviso si el arreglo tiene el indice que buscamos
                    if (!res.hasIndex(index)) {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                        return;
                    }
                    res = res.getValue(index);
                }
            }
        }
    }
}
exports.AccesoArregloSimple = AccesoArregloSimple;