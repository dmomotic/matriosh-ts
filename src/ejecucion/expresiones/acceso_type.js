"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoType = void 0;
const error_1 = require("../../arbol/error");
const errores_1 = require("../../arbol/errores");
const arreglo_1 = require("../arreglo");
const instruccion_1 = require("../instruccion");
const type_1 = require("../type");
class AccesoType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_accesos) {
        super(linea);
        Object.assign(this, { id, lista_accesos });
    }
    ejecutar(e) {
        //Busqueda de variable en el entorno
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro ninguna variable con el id ${this.id}` }));
            return;
        }
        let res = variable.getValor();
        //Verifico que sea un type para poder realizar los accesos
        if (!(res instanceof type_1.Type)) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El valor de la variable ${this.id} no es un Type` }));
            return;
        }
        for (let i = 0; i < this.lista_accesos.length; i++) {
            const exp = this.lista_accesos[i];
            //Si el valor actual es un type
            if (res instanceof type_1.Type) {
                res = res;
                //Si la exp un string es acceso a una propiedad
                if (typeof exp == 'string') {
                    //Si el type no contiene el atributo es un error
                    if (!res.hasAtributo(exp)) {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro el atributo: ${exp}` }));
                        return;
                    }
                    //Si existe el type capturlo la variable que retorna y actualizo el valor
                    const variable = res.getAtributo(exp);
                    res = variable.getValor();
                }
                //Si no es un string es un error ya que un atributo solo puede ser string
                else {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al atributo ${exp}` }));
                    return;
                }
            }
            //Si el valor actual es un Arreglo
            else if (res instanceof arreglo_1.Arreglo) {
                res = res;
                //La exp debe ser un arreglo de exp que representa la lista de accesos al arreglo
                if (!(exp instanceof Array)) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Error en los indices de acceso al arreglo` }));
                    return;
                }
                //Si es una lista de exp realizo los accesos
                for (let j = 0; j < exp.length; j++) {
                    const index = exp[j].ejecutar(e);
                    //Validación de indice
                    if (typeof index != 'number') {
                        errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El indice ${index} no es de tipo numerico` }));
                        return;
                    }
                    if (res instanceof arreglo_1.Arreglo) {
                        //Reviso si el arreglo tiene el indice que buscamos
                        if (!res.hasIndex(index)) {
                            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
                            return;
                        }
                        res = res.getValue(index);
                    }
                    //TODO el else creo que es error
                }
            }
            //TODO: creo que el else es error
        }
        //Si todo salio bien
        return res;
    }
}
exports.AccesoType = AccesoType;
