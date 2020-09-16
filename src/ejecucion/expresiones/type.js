"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const error_1 = require("../../arbol/error");
const errores_1 = require("../../arbol/errores");
const entorno_1 = require("../entorno");
const instruccion_1 = require("../instruccion");
const variable_1 = require("../variable");
const type_1 = require("../type");
class Type extends instruccion_1.Instruccion {
    constructor(linea, lista_atributos) {
        super(linea);
        Object.assign(this, { lista_atributos });
    }
    ejecutar(e) {
        const entorno = new entorno_1.Entorno();
        this.lista_atributos.forEach((atributo) => {
            //Validación objeto
            const id = atributo['id'];
            const exp = atributo['exp'];
            if (id && exp) {
                //Validacion de id unico
                let variable = entorno.getVariable(id);
                const reasignable = true;
                if (variable) {
                    errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `El id: ${id} esta repetido en el type` }));
                    return;
                }
                //Si se puede asignar
                const valor = exp.ejecutar(e);
                variable = new variable_1.Variable({ reasignable, id, valor });
                entorno.setVariable(variable);
            }
        });
        return new type_1.Type(null, entorno.variables);
    }
}
exports.Type = Type;
