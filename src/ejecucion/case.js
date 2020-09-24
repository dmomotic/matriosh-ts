"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
class Case {
    constructor(exp, instrucciones, is_default = false) {
        Object.assign(this, { exp, instrucciones, is_default });
    }
    isDefault() {
        return this.is_default;
    }
}
exports.Case = Case;
