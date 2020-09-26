"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecType = void 0;
const error_1 = require("../../../arbol/error");
const errores_1 = require("../../../arbol/errores");
const entorno_1 = require("../../entorno");
const instruccion_1 = require("../../instruccion");
const type_1 = require("../../type");
const variable_1 = require("../../variable");
class DecType extends instruccion_1.Instruccion {
    constructor(linea, id, lista_atributos) {
        super(linea);
        Object.assign(this, { id, lista_atributos });
    }
    ejecutar(e) {
        //Verifico que no exista
        const type = e.getType(this.id);
        if (type) {
            errores_1.Errores.getInstance().push(new error_1.Error({ tipo: 'semantico', linea: this.linea, descripcion: `Ya existe un type con el nombre ${this.id} registrado en este entorno` }));
            return;
        }
        //Si aun no existe creo el entorno que va a contener y asigno los valores por defecto de sus atributos
        const atributos = new entorno_1.Entorno();
        this.lista_atributos.forEach((atributo) => {
            const id = atributo['id'];
            const tipo_asignado = atributo['tipo'];
            const type_generador = atributo['type_generador'];
            const dimensiones = atributo['corchetes'];
            //Valores comunnes
            const reasignable = true;
            // {id, tipo}
            if (id && tipo_asignado != null && !type_generador && !dimensiones) {
                const atributo = new variable_1.Variable({ reasignable, id, tipo_asignado });
                atributos.setVariable(atributo);
            }
            // {id, tipo, type_generador}
            if (id && tipo_asignado != null && type_generador && !dimensiones) {
                const atributo = new variable_1.Variable({ reasignable, id, tipo_asignado, type_generador });
                atributos.setVariable(atributo);
            }
            // {id, tipo, dimensiones}
            if (id && tipo_asignado != null && !type_generador && dimensiones) {
                const atributo = new variable_1.Variable({ reasignable, id, tipo_asignado, dimensiones });
                atributos.setVariable(atributo);
            }
            // {id, tipo, type_generador, dimensiones}
            if (id && tipo_asignado != null && type_generador && dimensiones) {
                const atributo = new variable_1.Variable({ reasignable, id, tipo_asignado, type_generador, dimensiones });
                atributos.setVariable(atributo);
            }
        });
        e.setType(new type_1.Type(this.id, atributos.variables));
    }
}
exports.DecType = DecType;
