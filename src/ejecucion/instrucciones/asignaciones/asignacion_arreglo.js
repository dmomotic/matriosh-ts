"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArreglo = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const arreglo_1 = require("../../arreglo");
const instruccion_1 = require("../../instruccion");
const tipo_1 = require("../../tipo");
const _ = require("lodash");
class AsignacionArreglo extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos, tipo_igual, exp) {
        super(linea);
        Object.assign(this, { id, lista_accesos, tipo_igual, exp });
    }
    ejecutar(e) {
        //Busqueda en el entorno
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la varaible con id ${this.id}` }));
            return;
        }
        let res = variable.getValor();
        let valor_a_asignar = this.exp.ejecutar(e);
        valor_a_asignar = _.cloneDeep(valor_a_asignar);
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
            if (res instanceof arreglo_1.Arreglo) {
                //Reviso si el arreglo tiene el indice que buscamos
                if (!res.hasIndex(index)) {
                    /**
                     * Comente esta seccion porque si el arreglo no tiene el indice le debo asignar el valor
                     * de igual forma segun los requerimientos del lenguaje
                     */
                    // Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                    // return;
                }
                //Si ya es el ultimo acceso
                if (i == this.lista_accesos.length - 1) {
                    if (this.tipo_igual == '=') {
                        res.setValue(index, valor_a_asignar);
                    }
                    else {
                        const nuevo_valor = this.tipo_igual == '+=' ? res.getValue(index) + valor_a_asignar : res.getValue(index) - valor_a_asignar;
                        res.setValue(index, nuevo_valor);
                    }
                }
                //Si aun no es el ultimo acceso
                else {
                    res = res.getValue(index);
                }
            }
        }
    }
}
exports.AsignacionArreglo = AsignacionArreglo;
