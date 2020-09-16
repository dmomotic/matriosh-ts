"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const variable_1 = require("./variable");
class Type {
    constructor(id, atributos) {
        Object.assign(this, { id, atributos });
    }
    hasAtributo(id) {
        return this.atributos.has(id);
    }
    setAtributo(variable) {
        this.atributos.set(variable.id, variable);
    }
    toString() {
        let salida = '{';
        for (let [key, value] of this.atributos) {
            salida += `${key}: `;
            if (value instanceof variable_1.Variable) {
                salida += `${value.valor}, `;
            }
            else {
                salida += `${value}, `;
            }
        }
        salida += '}';
        return salida;
    }
}
exports.Type = Type;
