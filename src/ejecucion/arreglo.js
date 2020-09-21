"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
class Arreglo {
    constructor(arreglo) {
        this.arreglo = arreglo;
    }
    isInitialized() {
        return this.arreglo != null;
    }
    getSize() {
        return this.arreglo.length;
    }
    hasIndex(index) {
        return this.isInitialized() && index < this.getSize();
    }
    setValue(index, value) {
        this.arreglo[index] = value;
    }
    getValue(index) {
        return this.arreglo[index];
    }
    toString() {
        let salida = '[';
        const size = this.arreglo.length;
        this.arreglo.forEach((item, index) => {
            if (item != null)
                salida += item.toString();
            else
                salida += "null";
            if (index != size - 1)
                salida += ', ';
        });
        salida += ']';
        return salida;
    }
    pop() {
        return this.arreglo.pop();
    }
    push(valor) {
        this.arreglo.push(valor);
    }
}
exports.Arreglo = Arreglo;
