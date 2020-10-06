"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamadaFuncion = void 0;
const error_1 = require("../../arbol/error");
const errores_1 = require("../../arbol/errores");
const entorno_1 = require("../entorno");
const instruccion_1 = require("../instruccion");
const return_1 = require("../return");
const _ = require("lodash");
const tipo_1 = require("../tipo");
const continue_1 = require("../continue");
const break_1 = require("../break");
const entorno_aux_1 = require("../entorno_aux");
class LlamadaFuncion extends instruccion_1.Instruccion {
    constructor(linea, id, lista_parametros = null) {
        super(linea);
        Object.assign(this, { id, lista_parametros });
    }
    ejecutar(e) {
        const entorno_aux = new entorno_1.Entorno();
        const entorno_local = new entorno_1.Entorno(e);
        const funcion = _.cloneDeep(e.getFuncion(this.id));
        //Validacion de funcion existente
        if (!funcion) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No existe ninguna funcion con el nombre ${this.id}` }));
            return;
        }
        //Si la llamada  de la funcion trae parametros
        if (this.lista_parametros) {
            //Si la funcion no tiene parametros
            if (!funcion.hasParametros()) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} no recibe parametros` }));
                return;
            }
            //Si la funcion tiene parametros debe ser la misma cantidad
            if (this.lista_parametros.length != funcion.lista_parametros.length) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La cantidad de parametros no coincide ${this.id}` }));
                return;
            }
            //Declaro los parametros
            for (let i = 0; i < this.lista_parametros.length; i++) {
                const exp = this.lista_parametros[i];
                const variable = funcion.lista_parametros[i];
                const valor = exp.ejecutar(entorno_local);
                //Validacion de tipo a asignar
                if (valor != null && variable.hasTipoAsignado() && variable.tipo_asignado != tipo_1.getTipo(valor)) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El parametro ${variable.id} de la funcion ${this.id} no es del tipo enviado en la llamada de la funcion` }));
                    return;
                }
                variable.valor = valor;
                entorno_aux.setVariable(variable);
            }
        }
        //Si la llamada de la funcion no trae parametros
        else {
            //Es un error solo si la funcion tiene paremetros
            if (funcion.hasParametros()) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} debe recibir ${funcion.getParametrosSize()} parametros` }));
                return;
            }
        }
        entorno_local.variables = entorno_aux.variables;
        //Si es una funcion anidada que estoy ejecutando y estoy dentro de una funcion
        if (entorno_aux_1.EntornoAux.getInstance().estoyEjecutandoFuncion() && this.id.endsWith('_')) {
            //No debo cambiar el entorno padre, lo dejo aqui por si acaso :D
        }
        else {
            entorno_local.padre = e.getEntornoGlobal();
        }
        entorno_aux_1.EntornoAux.getInstance().inicioEjecucionFuncion();
        //Ejecuto las instrucciones
        for (let instruccion of funcion.instrucciones) {
            const resp = instruccion.ejecutar(entorno_local);
            //Validacion Return
            if (resp instanceof return_1.Return) {
                //Validacion de retorno en funcion
                if (funcion.hasReturn() && resp.hasValue()) {
                    //Valido el tipo del retorno
                    let val = resp.getValue();
                    if (val != null && tipo_1.getTipo(val) != funcion.tipo_return) {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} esta retornando un tipo distinto al declarado` }));
                        entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
                        return;
                    }
                    entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
                    return val;
                }
                //Si la funcion tiene return pero el return no trae valor
                if (funcion.hasReturn() && !resp.hasValue()) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} debe retornar un valor` }));
                    entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
                    return;
                }
                //Si la funcion no debe tener return y el return trae un valor
                if (!funcion.hasReturn() && resp.hasValue()) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} no debe retornar un valor` }));
                    entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
                    return;
                }
                //Si solo es un return
                entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
                return;
            }
            //Validacion Break o Continue
            if (resp instanceof break_1.Break || resp instanceof continue_1.Continue) {
                errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Las instrucciones Break/Continue solo pueden ser utilizadas dentro de ciclos` }));
                entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
                return;
            }
        }
        //Valido si la funcion debia retornar algo
        if (funcion.hasReturn()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `La funcion ${this.id} debe retornar un valor` }));
            entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
            return;
        }
        entorno_aux_1.EntornoAux.getInstance().finEjecucionFuncion();
    }
}
exports.LlamadaFuncion = LlamadaFuncion;
