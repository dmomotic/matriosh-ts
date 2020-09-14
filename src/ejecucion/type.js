"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
class Type {
    constructor(id, atributos) {
        Object.assign(this, { id, atributos });
    }
    hasAtributo(id) {
        return this.atributos.hasVariable(id);
    }
    setAtributo(variable) {
        this.atributos.setVariable(variable);
    }
}
exports.Type = Type;
