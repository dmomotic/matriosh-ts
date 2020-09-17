"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
class Return {
    constructor(has_value, value = null) {
        Object.assign(this, { has_value, value });
    }
    hasValue() {
        return this.has_value;
    }
    getValue() {
        return this.value;
    }
}
exports.Return = Return;
