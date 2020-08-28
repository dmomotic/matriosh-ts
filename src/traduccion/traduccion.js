"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Traduccion = void 0;
const variable_1 = require("./variable");
class Traduccion {
    constructor(raiz) {
        this.raiz = raiz;
        this.codigo = '';
        this.contador = 0;
        this.dot = '';
    }
    getDot() {
        this.contador = 0;
        this.dot = "digraph G {\n";
        if (this.raiz != null) {
            this.generacionDot(this.raiz);
        }
        this.dot += "\n}";
        return this.dot;
    }
    generacionDot(nodo) {
        if (nodo instanceof Object) {
            let idPadre = this.contador;
            this.dot += `node${idPadre}[label="${nodo.label}"];\n`;
            if (nodo.hasOwnProperty("hijos")) {
                nodo.hijos.forEach((nodoHijo) => {
                    let idHijo = ++this.contador;
                    this.dot += `node${idPadre} -> node${idHijo};\n`;
                    if (nodoHijo instanceof Object) {
                        this.generacionDot(nodoHijo);
                    }
                    else {
                        this.dot += `node${idHijo}[label="${nodoHijo}"];`;
                    }
                });
            }
        }
    }
    traducir() {
        this.codigo = '';
        return this.codigo;
    }
    recorrer(nodo, e) {
        if (this.nodoActual('S', nodo)) {
            nodo.hijos.forEach((item) => {
                this.recorrer(item, e);
            });
        }
        if (this.nodoActual('INSTRUCCIONES', nodo)) {
            nodo.hijos.forEach((item) => {
                this.recorrer(item, e);
            });
        }
        if (this.nodoActual('DECLARACION_VARIABLE', nodo)) {
            switch (nodo.hijos.length) {
                case 3:
                    //TIPO_DEC_VARIABLE id punto_coma
                    const tipo = this.getValorDeNodo(nodo.hijos[0]);
                    const id = nodo.hijos[1];
                    const reasignable = tipo === 'let' ? true : false;
                    //Si fue declarada dentro de una funcion
                    if (e.generadoPorFuncion()) {
                    }
                    //Si no fue declarada dentro de una funcion
                    {
                        e.setVariable(new variable_1.Variable({ id: id, tipo: 4 /* SIN_ASIGNAR */, reasignable: reasignable }));
                    }
                    break;
            }
        }
    }
    nodoActual(label, nodo) {
        if (nodo == null || !(nodo instanceof Object)) {
            return false;
        }
        if (nodo.hasOwnProperty('label') && nodo.label != null) {
            return nodo.label === label;
        }
        return false;
    }
    getValorDeNodo(nodo) {
        if (nodo == null || !(nodo instanceof Object))
            return '';
        if (nodo.hasOwnProperty('hijos') && nodo.hijos instanceof Array && nodo.hijos[0] != null)
            return nodo.hijos[0];
        return '';
    }
}
exports.Traduccion = Traduccion;
