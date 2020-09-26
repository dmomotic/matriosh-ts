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
    getAtributo(id) {
        return this.atributos.get(id);
    }
    setAtributo(variable) {
        this.atributos.set(variable.id, variable);
    }
    toString() {
        let salida = '{';
        let i = 0;
        const size = this.atributos.size - 1;
        for (let [key, value] of this.atributos) {
            salida += `${key}: `;
            if (value instanceof variable_1.Variable) {
                salida += `${value.valor}`;
            }
            else {
                salida += `${value}`;
            }
            if (i != size) {
                salida += ', ';
            }
            i++;
        }
        salida += '}';
        return salida;
    }
    getSalidaBase() {
        let salida = `${this.id} = {`;
        let i = 0;
        const size = this.atributos.size - 1;
        for (let [key, value] of this.atributos) {
            salida += `${key}`;
            if (i != size) {
                salida += ', ';
            }
            i++;
        }
        salida += '}';
        return salida;
    }
}
exports.Type = Type;
