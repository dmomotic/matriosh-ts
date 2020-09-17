"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionAtributoType = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const arreglo_1 = require("../../arreglo");
const instruccion_1 = require("../../instruccion");
const type_1 = require("../../type");
const variable_1 = require("../../variable");
const _ = require("lodash");
class AsignacionAtributoType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos, tipo_igual, exp) {
        super(linea);
        Object.assign(this, { id, lista_accesos, tipo_igual, exp });
    }
    ejecutar(e) {
        let variable = e.getVariable(this.id);
        //Si no existe la variable
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se contro ninguna varaible con el id ${this.id}` }));
            return;
        }
        let valor = variable.getValor();
        //Si no es un type
        if (!(valor instanceof type_1.Type)) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} no es un Type` }));
            return;
        }
        const size = this.lista_accesos.length;
        //Inicio los accesos
        for (let i = 0; i < size; i++) {
            const exp = this.lista_accesos[i];
            if (valor instanceof variable_1.Variable) {
                valor = valor.getValor();
            }
            //Si el valor actual es un type
            if (valor instanceof type_1.Type) {
                //Exp solo puede ser string que representa el acceso a un atributo
                if (typeof exp != 'string') {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al atributo ${exp}` }));
                    return;
                }
                //Valido que exista la propiedad en el type
                if (!valor.hasAtributo(exp)) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la propiedad ${exp}` }));
                    return;
                }
                //Capturo el atributo
                valor = valor.getAtributo(exp); //Devuelve una instancia de variable
            }
            //Si el valor actual es un arreglo
            else if (valor instanceof arreglo_1.Arreglo) {
                //Exp solo puede ser una lista de exp
                if (!(exp instanceof Array)) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `${exp} no es de tipo arreglo` }));
                    return;
                }
                //Si soy el ultimo y mi valor actual es un arreglo salgo
                if (i == size - 1)
                    break;
                //Si no, debo obtener el valor
                //Si es una lista de exp realizo los accesos
                for (let j = 0; j < exp.length; j++) {
                    const index = exp[j].ejecutar(e);
                    //Validación de indice
                    if (typeof index != 'number') {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El indice ${index} no es de tipo numerico` }));
                        return;
                    }
                    if (valor instanceof arreglo_1.Arreglo) {
                        //Reviso si el arreglo tiene el indice que buscamos
                        if (!valor.hasIndex(index)) {
                            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                            return;
                        }
                        valor = valor.getValue(index);
                    }
                    //TODO el else creo que es error
                }
            }
        }
        let valor_a_asignar = this.exp.ejecutar(e);
        _.cloneDeep(valor_a_asignar);
        if (valor instanceof variable_1.Variable) {
            if (this.tipo_igual == '=') {
                valor.valor = valor_a_asignar;
            }
            else {
                const res = this.tipo_igual == '+=' ? valor.getValor() + valor_a_asignar : valor.getValor() - valor_a_asignar;
                valor.valor = res;
            }
        }
        else if (valor instanceof arreglo_1.Arreglo) {
            const lista_exps = this.lista_accesos[size - 1];
            for (let i = 0; i < lista_exps.length; i++) {
                const index = lista_exps[i].ejecutar(e);
                //Validación de indice
                if (typeof index != 'number') {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El indice ${index} no es de tipo numerico` }));
                    return;
                }
                if (valor instanceof arreglo_1.Arreglo) {
                    //Reviso si el arreglo tiene el indice que buscamos
                    if (!valor.hasIndex(index)) {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                        return;
                    }
                    //Si soy el ultimo indice
                    if (i == lista_exps.length - 1) {
                        if (this.tipo_igual == '=') {
                            valor.setValue(index, valor_a_asignar);
                        }
                        else {
                            const res = this.tipo_igual == '+=' ? valor.getValue(index) + valor_a_asignar : valor.getValue(index) - valor_a_asignar;
                            valor.setValue(index, res);
                        }
                    }
                    else {
                        valor = valor.getValue(index);
                    }
                }
            }
        }
        else {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Algo salio mal durante la asignacion pero no se que :()` }));
        }
    }
}
exports.AsignacionAtributoType = AsignacionAtributoType;
