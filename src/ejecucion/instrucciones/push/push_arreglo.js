"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushArreglo = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const arreglo_1 = require("../../arreglo");
const instruccion_1 = require("../../instruccion");
class PushArreglo extends instruccion_1.Instruccion {
    constructor(linea, id, exp) {
        super(linea);
        Object.assign(this, { id, exp });
    }
    ejecutar(e) {
        //Validacion de variable existente
        const variable = e.getVariable(this.id);
        if (!variable) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No existe ninguna variable con el id ${this.id}` }));
            return;
        }
        //Validacion de Arreglo
        if (!variable.isArray()) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede ejecutar el metodo push() en ${this.id} porque no es de tipo arreglo` }));
            return;
        }
        const arreglo = variable.getValor();
        //Verifico si el arreglo ya fue inicializado
        if (arreglo == null) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo en ${this.id} no ha sido inicializado` }));
            return;
        }
        const valor = this.exp.ejecutar(e);
        //Realizo el push en el arreglo
        if (arreglo instanceof arreglo_1.Arreglo) {
            arreglo.push(valor);
        }
    }
}
exports.PushArreglo = PushArreglo;
