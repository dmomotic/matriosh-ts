"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ejecucion = void 0;
const errores_1 = require("../arbol/errores");
const salida_1 = require("../arbol/salida");
const entorno_1 = require("./entorno");
const id_1 = require("./expresiones/id");
const nativo_1 = require("./expresiones/nativo");
const instruccion_1 = require("./instruccion");
const dec_id_1 = require("./instrucciones/declaraciones/dec_id");
const dec_id_exp_1 = require("./instrucciones/declaraciones/dec_id_exp");
const log_1 = require("./instrucciones/log");
const suma_1 = require("./expresiones/aritmeticas/suma");
const dec_type_1 = require("./instrucciones/declaraciones/dec_type");
const type_1 = require("./expresiones/type");
const asignacion_1 = require("./instrucciones/asignaciones/asignacion");
const arreglo_1 = require("./expresiones/arreglo");
const acceso_arreglo_simple_1 = require("./expresiones/acceso_arreglo_simple");
const acceso_type_1 = require("./expresiones/acceso_type");
const asignacion_atributo_type_1 = require("./instrucciones/asignaciones/asignacion_atributo_type");
class Ejecucion {
    constructor(raiz) {
        Object.assign(this, { raiz, contador: 0, dot: '' });
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
            this.dot += `node${idPadre}[label="${this.getStringValue(nodo.label)}"];\n`;
            if (nodo.hasOwnProperty("hijos")) {
                nodo.hijos.forEach((nodoHijo) => {
                    let idHijo = ++this.contador;
                    this.dot += `node${idPadre} -> node${idHijo};\n`;
                    if (nodoHijo instanceof Object) {
                        this.generacionDot(nodoHijo);
                    }
                    else {
                        this.dot += `node${idHijo}[label="${this.getStringValue(nodoHijo)}"];`;
                    }
                });
            }
        }
    }
    getStringValue(label) {
        if (label.startsWith("\"") || label.startsWith("'") || label.startsWith("`")) {
            return label.substr(1, label.length - 2);
        }
        return label;
    }
    ejecutar() {
        const instrucciones = this.recorrer(this.raiz);
        if (instrucciones instanceof Array) {
            //Entorno global, limpieza de errores y limpieza de la salida
            const entorno = new entorno_1.Entorno();
            errores_1.Errores.getInstance().clear();
            salida_1.Salida.getInstance().clear();
            instrucciones.forEach(element => {
                if (element instanceof instruccion_1.Instruccion) {
                    try {
                        element.ejecutar(entorno);
                    }
                    catch (error) {
                    }
                }
            });
        }
    }
    getSalida() {
        return salida_1.Salida.getInstance().lista;
    }
    imprimirErrores() {
        if (errores_1.Errores.getInstance().hasErrors()) {
            errores_1.Errores.getInstance().getErrors().forEach((error) => {
                console.log(error.descripcion);
            });
        }
    }
    recorrer(nodo) {
        //S
        if (this.soyNodo('S', nodo)) {
            return this.recorrer(nodo.hijos[0]);
        }
        //INSTRUCCIONES
        if (this.soyNodo('INSTRUCCIONES', nodo)) {
            let instrucciones = [];
            nodo.hijos.forEach((nodoHijo) => {
                const inst = this.recorrer(nodoHijo);
                if (inst instanceof Array) {
                    instrucciones = instrucciones.concat(inst);
                }
                else {
                    instrucciones.push(inst);
                }
            });
            return instrucciones;
        }
        //DECLARACION_VARIABLE
        if (this.soyNodo('DECLARACION_VARIABLE', nodo)) {
            //TIPO_DEC_VARIABLE LISTA_DECLARACIONES punto_coma
            const reasignable = this.recorrer(nodo.hijos[0]);
            const lista_declaraciones = this.recorrer(nodo.hijos[1]);
            const lista_instrucciones = [];
            lista_declaraciones.forEach((item) => {
                const keys = Object.keys(item);
                const linea = nodo.linea;
                const id = item['id'];
                //{id}
                if (keys.length == 1) {
                    lista_instrucciones.push(new dec_id_1.DecId(linea, reasignable, id));
                }
                //{id, exp}
                else if (keys.length == 2) {
                    const exp = item['exp'];
                    lista_instrucciones.push(new dec_id_exp_1.DecIdExp(linea, reasignable, id, exp));
                }
                //{id, tipo, type_generador?}
                else if (keys.length == 3) {
                }
            });
            return lista_instrucciones;
        }
        //LISTA_DECLARACIONES
        if (this.soyNodo('LISTA_DECLARACIONES', nodo)) {
            const lista_declaraciones = [];
            nodo.hijos.forEach((nodoHijo) => {
                lista_declaraciones.push(this.recorrer(nodoHijo));
            });
            return lista_declaraciones;
        }
        //LISTA_EXPRESIONES
        if (this.soyNodo('LISTA_EXPRESIONES', nodo)) {
            //EXP coma EXP...
            const lista = [];
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    const exp = this.recorrer(nodoHijo);
                    lista.push(exp);
                }
            });
            return lista;
        }
        //DEC_ID
        if (this.soyNodo('DEC_ID', nodo)) {
            //id
            return { id: nodo.hijos[0] };
        }
        // DEC_ID_TIPO
        if (this.soyNodo('DEC_ID_TIPO', nodo)) {
            // id dos_puntos TIPO_VARIABLE_NATIVA
            const tipo_var_nat = this.recorrer(nodo.hijos[2]);
            return Object.assign({ id: nodo.hijos[0] }, tipo_var_nat);
        }
        //DEC_ID_EXP
        if (this.soyNodo('DEC_ID_EXP', nodo)) {
            //id igual EXP
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[2]);
            return { id, exp };
        }
        //TIPO_DEC_VARIABLE
        if (this.soyNodo('TIPO_DEC_VARIABLE', nodo)) {
            //let || const
            return nodo.hijos[0] == 'let';
        }
        //TIPO_VARIABLE_NATIVA
        if (this.soyNodo('TIPO_VARIABLE_NATIVA', nodo)) {
            if (nodo.hijos[0] == 'string') {
                return { tipo: 0 /* STRING */ };
            }
            if (nodo.hijos[0] == 'number') {
                return { tipo: 1 /* NUMBER */ };
            }
            if (nodo.hijos[0] == 'boolean') {
                return { tipo: 2 /* BOOLEAN */ };
            }
            if (nodo.hijos[0] == 'void') {
                return { tipo: 5 /* VOID */ };
            }
            return { tipo: 3 /* TYPE */, type_generador: this.recorrer(nodo.hijos[0]) };
        }
        //ID
        if (this.soyNodo('ID', nodo)) {
            return nodo.hijos[0];
        }
        //EXP
        if (this.soyNodo('EXP', nodo)) {
            switch (nodo.hijos.length) {
                case 1:
                    {
                        const exp = this.recorrer(nodo.hijos[0]);
                        ;
                        //Si es un string es una llamada a un id de variable
                        if (typeof exp == 'string')
                            return new id_1.Id(nodo.linea, exp.toString());
                        //Si es un objeto
                        if (exp instanceof Object)
                            return exp;
                    }
                case 2:
                    //cor_izq cor_der
                    if (nodo.hijos[0] == '[' && nodo.hijos[1] == ']') {
                        return new arreglo_1.Arreglo(nodo.linea);
                    }
                case 3:
                    //EXP mas EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new suma_1.Suma(linea, expIzq, expDer);
                    }
                    //cor_izq LISTA_EXPRESIONES cor_der
                    if (nodo.hijos[0] == '[' && this.soyNodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == ']') {
                        const lista_expresiones = this.recorrer(nodo.hijos[1]);
                        return new arreglo_1.Arreglo(nodo.linea, lista_expresiones);
                    }
            }
        }
        //NUMBER
        if (this.soyNodo('NUMBER', nodo)) {
            const str_num = nodo.hijos[0];
            return new nativo_1.Nativo(nodo.linea, Number(str_num));
        }
        //STRING
        if (this.soyNodo('STRING', nodo)) {
            const str = nodo.hijos[0];
            const str2 = str.substr(1, str.length - 2);
            return new nativo_1.Nativo(nodo.linea, str2);
        }
        // BOOLEAN
        if (this.soyNodo('BOOLEAN', nodo)) {
            if (nodo.hijos[0] == 'true') {
                return new nativo_1.Nativo(nodo.linea, true);
            }
            return new nativo_1.Nativo(nodo.linea, false);
        }
        //NULL
        if (this.soyNodo('NULL', nodo)) {
            return new nativo_1.Nativo(nodo.linea, null);
        }
        //CONSOLE_LOG
        if (this.soyNodo('CONSOLE_LOG', nodo)) {
            //console punto log par_izq LISTA_EXPRESIONES par_der punto_coma
            const lista = this.recorrer(nodo.hijos[4]);
            return new log_1.Log(nodo.linea, lista);
        }
        // ATRIBUTO
        if (this.soyNodo('ATRIBUTO', nodo)) {
            // id dos_puntos TIPO_VARIABLE_NATIVA
            // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
            const id = nodo.hijos[0];
            const tipo = this.recorrer(nodo.hijos[2]);
            const atributo = Object.assign({ id }, tipo);
            if (nodo.hijos.length == 4 && this.soyNodo('LISTA_CORCHETES', nodo.hijos[3])) {
                atributo['corchetes'] = this.recorrer(nodo.hijos[3]);
            }
            return atributo; //{id, tipo, type_generador?, corchetes?}
        }
        //LISTA_CORCHETES
        if (this.soyNodo('LISTA_CORCHETES', nodo)) {
            let size = 0;
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo == '[]')
                    size++;
            });
            return size;
        }
        //LISTA_ATRIBUTOS
        if (this.soyNodo('LISTA_ATRIBUTOS', nodo)) {
            const lista_atributos = [];
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    lista_atributos.push(this.recorrer(nodoHijo));
                }
            });
            return lista_atributos; //{id, tipo, type_generador?, corchetes?}
        }
        //DECLARACION_TYPE
        if (this.soyNodo('DECLARACION_TYPE', nodo)) {
            // type id igual llave_izq LISTA_ATRIBUTOS llave_der
            const id = nodo.hijos[1];
            const lista_atributos = this.recorrer(nodo.hijos[4]);
            //cada atributo = {id, tipo, type_generador?, corchetes?}
            return new dec_type_1.DecType(nodo.linea, id, lista_atributos);
        }
        //LISTA_ACCESOS_ARREGLO
        if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo)) {
            //Regreso una lista de EXP donde cada una representa un acceso al arreglo
            const lista = [];
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    const exp = this.recorrer(nodoHijo);
                    if (exp instanceof instruccion_1.Instruccion) {
                        lista.push(exp);
                    }
                }
            });
            return lista; // [EXP]
        }
        //LISTA_ACCESOS_TYPE
        if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo)) {
            const lista = [];
            nodo.hijos.forEach((nodoHijo) => {
                //Si es un objeto
                if (nodoHijo instanceof Object) {
                    const res = this.recorrer(nodoHijo);
                    lista.push(res);
                }
                //Si no es un objeto lo agrego solo si es diferente al punto
                if (typeof nodoHijo == 'string' && nodoHijo != '.') {
                    lista.push(nodoHijo);
                }
            });
            return lista; //[id | [EXP]]
        }
        //TIPO_IGUAL
        if (this.soyNodo('TIPO_IGUAL', nodo)) {
            switch (nodo.hijos.length) {
                case 1:
                    return '=';
                case 2:
                    if (nodo.hijos[0] == '+')
                        return '+=';
                    if (nodo.hijos[0] == '-')
                        return '-=';
            }
        }
        //ASIGNACION
        if (this.soyNodo('ASIGNACION', nodo)) {
            switch (nodo.hijos.length) {
                // id LISTA_ACCESOS_TYPE TIPO_IGUAL EXP punto_coma
                case 5: {
                    const id = nodo.hijos[0];
                    const lista_accesos = this.recorrer(nodo.hijos[1]); //[id | [EXP]]
                    const tipo_igual = this.recorrer(nodo.hijos[2]);
                    const exp = this.recorrer(nodo.hijos[3]);
                    return new asignacion_atributo_type_1.AsignacionAtributoType(nodo.linea, id, lista_accesos, tipo_igual, exp);
                }
                case 4: {
                    //ACCESO_ARREGLO TIPO_IGUAL EXP punto_coma
                    if (this.soyNodo('ACCESO_ARREGLO', nodo.hijos[0])) {
                    }
                    //id TIPO_IGUAL EXP punto_coma
                    if (typeof nodo.hijos[0] == 'string') {
                        const id = nodo.hijos[0];
                        const tipo_igual = this.recorrer(nodo.hijos[1]);
                        const exp = this.recorrer(nodo.hijos[2]);
                        return new asignacion_1.Asignacion(nodo.linea, id, tipo_igual, exp);
                    }
                }
            }
        }
        //ATRIBUTO_TYPE
        if (this.soyNodo('ATRIBUTO_TYPE', nodo)) {
            //id dos_puntos EXP
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[2]);
            return { id, exp };
        }
        //ATRIBUTOS_TYPE
        if (this.soyNodo('ATRIBUTOS_TYPE', nodo)) {
            //ATRIBUTO_TYPE coma ATRIBUTO_TYPE....
            const atributos = [];
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    const res = this.recorrer(nodoHijo);
                    atributos.push(res);
                }
            });
            return atributos; //[{id, exp}]
        }
        //TYPE
        if (this.soyNodo('TYPE', nodo)) {
            //llave_izq ATRIBUTOS_TYPE llave_der
            const lista_atributos = this.recorrer(nodo.hijos[1]);
            return new type_1.Type(nodo.linea, lista_atributos);
        }
        //ACCESO_ARREGLO
        if (this.soyNodo('ACCESO_ARREGLO', nodo)) {
            //id LISTA_ACCESOS_ARREGLO
            const id = nodo.hijos[0];
            const lista_accesos_arreglo = this.recorrer(nodo.hijos[1]);
            return new acceso_arreglo_simple_1.AccesoArregloSimple(nodo.linea, id, lista_accesos_arreglo);
        }
        //ACCESO_TYPE
        if (this.soyNodo('ACCESO_TYPE', nodo)) {
            //id LISTA_ACCESOS_TYPE
            const id = nodo.hijos[0];
            //[id | [EXP]]
            const lista_accesos_type = this.recorrer(nodo.hijos[1]);
            return new acceso_type_1.AccesoType(nodo.linea, id, lista_accesos_type);
        }
    }
    /**
     * Funcion para determinar en que tipo de nodo estoy
     * @param label
     * @param nodo
     */
    soyNodo(label, nodo) {
        if (nodo == null || !(nodo instanceof Object)) {
            return false;
        }
        if (nodo.hasOwnProperty('label') && nodo.label != null) {
            return nodo.label === label;
        }
        return false;
    }
}
exports.Ejecucion = Ejecucion;
