"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Traduccion = void 0;
const entorno_1 = require("./entorno");
const variable_1 = require("./variable");
const funcion_1 = require("./funcion");
class Traduccion {
    constructor(raiz) {
        this.raiz = raiz;
        this.codigo = '';
        this.contador = 0;
        this.dot = '';
        this.declaracionesGlobales = '';
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
    traducir() {
        let entorno = new entorno_1.Entorno();
        this.codigo = this.recorrer(this.raiz, entorno);
        return this.codigo;
    }
    recorrer(nodo, e) {
        //S
        if (this.soyNodo('S', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                codigoAux += this.recorrer(nodoHijo, e);
            });
            return codigoAux;
        }
        //INSTRUCCIONES
        else if (this.soyNodo('INSTRUCCIONES', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo, index) => {
                codigoAux += `${this.recorrer(nodoHijo, e)}\n`;
            });
            return codigoAux;
        }
        //DECLARACION_FUNCION
        else if (this.soyNodo('DECLARACION_FUNCION', nodo)) {
            switch (nodo.hijos.length) {
                // function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
                case 9:
                    // function test() : TIPO { INSTRUCCIONES }
                    {
                        const nombre = nodo.hijos[1];
                        const id = e.getNombreFuncion(nombre);
                        //Almaceno la funcion en mi entorno
                        const fn = new funcion_1.Funcion({ id: nombre });
                        if (nombre != id) {
                            fn.setIdNuevo(id);
                        }
                        e.setFuncion(fn);
                        const tipo = this.recorrer(nodo.hijos[5], e);
                        let codigoAux = `${nodo.hijos[0]} ${id}() : ${tipo} {\n`;
                        let codigoFn = '\n';
                        //Si no tiene funciones anidadas
                        if (!this.tengoFuncionAnidada(nodo.hijos[7])) {
                            codigoAux += this.recorrer(nodo.hijos[7], new entorno_1.Entorno(e));
                            codigoAux += `}\n\n`;
                        }
                        //Si tiene funcion anidada
                        else {
                            //Realizo el primer recorrido para todas las instrucciones distintas de DECLARACION_FUNCION que sean DECLARACION_VARIABLE
                            const entorno = new entorno_1.Entorno(e, nombre);
                            //Realizo el recorrido para las funciones anidadas
                            nodo.hijos[7].hijos.forEach((nodoHijo) => {
                                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoFn += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            //Realizo el recorrido para todas las intrucciones disntitas a DECLARACION_FUNCION
                            nodo.hijos[7].hijos.forEach((nodoHijo) => {
                                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            codigoAux += `}\n\n`;
                        }
                        return codigoAux + codigoFn;
                    }
                // function id par_izq par_der llave_izq INSTRUCCIONES llave_der
                case 7:
                    // function test() { INSTRUCCIONES }
                    {
                        const nombre = nodo.hijos[1];
                        const id = e.getNombreFuncion(nombre);
                        //Almaceno la funcion en mi entorno
                        const fn = new funcion_1.Funcion({ id: nombre });
                        if (nombre != id) {
                            fn.setIdNuevo(id);
                        }
                        e.setFuncion(fn);
                        let codigoAux = `${nodo.hijos[0]} ${id}(){\n`;
                        let codigoFn = '\n';
                        //Si no tiene funciones anidadas
                        if (!this.tengoFuncionAnidada(nodo.hijos[5])) {
                            codigoAux += this.recorrer(nodo.hijos[5], new entorno_1.Entorno(e));
                            codigoAux += `}\n\n`;
                        }
                        //Si tiene funcion anidada
                        else {
                            const entorno = new entorno_1.Entorno(e, nombre);
                            //Realizo el recorrido para las funciones anidadas
                            nodo.hijos[5].hijos.forEach((nodoHijo) => {
                                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoFn += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            //Realizo el recorrido para todas las instrucciones distintas de DECLARACION_FUNCION y DECLARACION DE VARIABLE
                            nodo.hijos[5].hijos.forEach((nodoHijo) => {
                                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            codigoAux += `}\n\n`;
                        }
                        return codigoAux + codigoFn;
                    }
                // function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
                case 10:
                    // function test() : TIPO[][] { INSTRUCCIONES }
                    if (this.soyNodo('LISTA_CORCHETES', nodo.hijos[6])) {
                        const nombre = nodo.hijos[1];
                        const id = e.getNombreFuncion(nombre);
                        //Almaceno la funcion en mi entorno
                        const fn = new funcion_1.Funcion({ id: nombre });
                        if (nombre != id) {
                            fn.setIdNuevo(id);
                        }
                        e.setFuncion(fn);
                        const tipo = this.recorrer(nodo.hijos[5], e);
                        const lista_corchetes = this.recorrer(nodo.hijos[6], e);
                        let codigoAux = `${nodo.hijos[0]} ${id}() : ${tipo}${lista_corchetes} {\n`;
                        let codigoFn = '\n';
                        //Si no tiene funciones anidadas
                        if (!this.tengoFuncionAnidada(nodo.hijos[8])) {
                            codigoAux += this.recorrer(nodo.hijos[8], new entorno_1.Entorno(e));
                            codigoAux += `}\n\n`;
                        }
                        //Si tiene funcion anidada
                        else {
                            //Realizo el primer recorrido para todas las instrucciones distintas de DECLARACION_FUNCION que sean DECLARACION_VARIABLE
                            const entorno = new entorno_1.Entorno(e, nombre);
                            //Realizo el recorrido para las funciones anidadas
                            nodo.hijos[8].hijos.forEach((nodoHijo) => {
                                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoFn += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            //Realizo el recorrido para todas las instrucciones distintas de DECLARACION_FUNCION y DECLARACION DE VARIABLE
                            nodo.hijos[8].hijos.forEach((nodoHijo) => {
                                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            codigoAux += `}\n\n`;
                        }
                        return codigoAux + codigoFn;
                    }
                    // function test ( LISTA_PARAMETROS ) : TIPO { INSTRUCCIONES }
                    else if (this.soyNodo('LISTA_PARAMETROS', nodo.hijos[3])) {
                        const nombre = nodo.hijos[1];
                        const id = e.getNombreFuncion(nombre);
                        //Almaceno la funcion en mi entorno
                        const fn = new funcion_1.Funcion({ id: nombre });
                        if (nombre != id) {
                            fn.setIdNuevo(id);
                        }
                        e.setFuncion(fn);
                        const lista_parametros = this.recorrer(nodo.hijos[3], e);
                        const tipo = this.recorrer(nodo.hijos[6], e);
                        let codigoAux = `${nodo.hijos[0]} ${id}(${lista_parametros}) : ${tipo} {\n`;
                        let codigoFn = '\n';
                        //Si no tiene funciones anidadas
                        if (!this.tengoFuncionAnidada(nodo.hijos[8])) {
                            codigoAux += this.recorrer(nodo.hijos[8], new entorno_1.Entorno(e));
                            codigoAux += `}\n\n`;
                        }
                        //Si tiene funcion anidada
                        else {
                            const entorno = new entorno_1.Entorno(e, nombre);
                            //Realizo el recorrido para las funciones anidadas
                            nodo.hijos[8].hijos.forEach((nodoHijo) => {
                                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoFn += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            //Realizo el recorrido para todas las instrucciones distintas de DECLARACION_FUNCION
                            nodo.hijos[8].hijos.forEach((nodoHijo) => {
                                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            codigoAux += `}\n\n`;
                        }
                        return codigoAux + codigoFn;
                    }
                // function id par_izq LISTA_PARAMETROS par_der llave_izq INSTRUCCIONES llave_der
                case 8:
                    // function test ( LISTA_PARAMETROS ) { INSTRUCCIONES }
                    {
                        const nombre = nodo.hijos[1];
                        const id = e.getNombreFuncion(nombre);
                        //Almaceno la funcion en mi entorno
                        const fn = new funcion_1.Funcion({ id: nombre });
                        if (nombre != id) {
                            fn.setIdNuevo(id);
                        }
                        e.setFuncion(fn);
                        const lista_parametros = this.recorrer(nodo.hijos[3], e);
                        let codigoAux = `${nodo.hijos[0]} ${id}(${lista_parametros}){\n`;
                        let codigoFn = '\n';
                        //Si no tiene funciones anidadas
                        if (!this.tengoFuncionAnidada(nodo.hijos[6])) {
                            codigoAux += this.recorrer(nodo.hijos[6], new entorno_1.Entorno(e));
                            codigoAux += `}\n\n`;
                        }
                        //Si tiene funcion anidada
                        else {
                            const entorno = new entorno_1.Entorno(e, nombre);
                            //Realizo el recorrido para las funciones anidadas
                            nodo.hijos[6].hijos.forEach((nodoHijo) => {
                                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoFn += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            //Realizo el recorrido para todas las instrucciones distintas de DECLARACION_FUNCION y DECLARACION DE VARIABLE
                            nodo.hijos[6].hijos.forEach((nodoHijo) => {
                                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            codigoAux += `}\n\n`;
                        }
                        return codigoAux + codigoFn;
                    }
                // function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES llave_izq INSTRUCCIONES llave_der
                case 11:
                    {
                        const nombre = nodo.hijos[1];
                        const id = e.getNombreFuncion(nombre);
                        //Almaceno la funcion en mi entorno
                        const fn = new funcion_1.Funcion({ id: nombre });
                        if (nombre != id) {
                            fn.setIdNuevo(id);
                        }
                        e.setFuncion(fn);
                        const lista_parametros = this.recorrer(nodo.hijos[3], e);
                        const tipo = this.recorrer(nodo.hijos[6], e);
                        const lista_corchetes = this.recorrer(nodo.hijos[7], e);
                        let codigoAux = `${nodo.hijos[0]} ${id}(${lista_parametros}) : ${tipo}${lista_corchetes} {\n`;
                        let codigoFn = '\n';
                        //Si no tiene funciones anidadas
                        if (!this.tengoFuncionAnidada(nodo.hijos[9])) {
                            codigoAux += this.recorrer(nodo.hijos[9], new entorno_1.Entorno(e));
                            codigoAux += `}\n\n`;
                        }
                        //Si tiene funcion anidada
                        else {
                            const entorno = new entorno_1.Entorno(e, nombre);
                            //Realizo el recorrido para las funciones anidadas
                            nodo.hijos[9].hijos.forEach((nodoHijo) => {
                                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoFn += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            //Realizo el recorrido para todas las instrucciones distintas de DECLARACION_FUNCION
                            nodo.hijos[9].hijos.forEach((nodoHijo) => {
                                if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                    codigoAux += this.recorrer(nodoHijo, entorno) + '\n';
                                }
                            });
                            codigoAux += `}\n\n`;
                        }
                        return codigoAux + codigoFn;
                    }
            }
        }
        //DECLARACION_TYPE
        else if (this.soyNodo('DECLARACION_TYPE', nodo)) {
            const id = nodo.hijos[1];
            const lista_atributos = this.recorrer(nodo.hijos[4], e);
            switch (nodo.hijos.length) {
                // type id igual llave_izq LISTA_ATRIBUTOS llave_der
                case 6:
                    return `type ${id} = {\n${lista_atributos}\n}\n`;
                // type id igual llave_izq LISTA_ATRIBUTOS llave_der punto_coma
                case 7:
                    return `type ${id} = {\n${lista_atributos}\n};\n`;
            }
        }
        //ASIGNACION
        else if (this.soyNodo('ASIGNACION', nodo)) {
            switch (nodo.hijos.length) {
                case 4:
                    {
                        //ACCESO_ARREGLO TIPO_IGUAL EXP punto_coma
                        if (this.soyNodo('ACCESO_ARREGLO', nodo.hijos[0])) {
                            const acceso_arreglo = this.recorrer(nodo.hijos[0], e);
                            const igual = this.recorrer(nodo.hijos[1], e);
                            const exp = this.recorrer(nodo.hijos[2], e);
                            return `${acceso_arreglo} ${igual} ${exp};`;
                        }
                        //id TIPO_IGUAL EXP punto_coma
                        else {
                            const id = nodo.hijos[0];
                            const igual = this.recorrer(nodo.hijos[1], e);
                            const exp = this.recorrer(nodo.hijos[2], e);
                            //TODO: validacion de error
                            const variable = e.getVariable(id);
                            if (variable) {
                                let codigoAux = `${variable.getIdNuevo()} ${igual} ${exp};`;
                                return codigoAux;
                            }
                            else {
                                let codigoAux = `${id} ${igual} ${exp};`;
                                return codigoAux;
                            }
                        }
                    }
                //id LISTA_ACCESOS_TYPE TIPO_IGUAL EXP punto_coma
                case 5: {
                    // type.accesos = EXP ; || type.accesos[][] = EXP;
                    const id = nodo.hijos[0];
                    const lista_accesos_type = this.recorrer(nodo.hijos[1], e);
                    const igual = this.recorrer(nodo.hijos[2], e);
                    const exp = this.recorrer(nodo.hijos[3], e);
                    //TODO: validacion de error
                    const variable = e.getVariable(id);
                    if (variable) {
                        return `${variable.getIdNuevo()}${lista_accesos_type} ${igual} ${exp};`;
                    }
                    return `${id}${lista_accesos_type} ${igual} ${exp};`;
                }
            }
        }
        //PUSH_ARREGLO
        else if (this.soyNodo('PUSH_ARREGLO', nodo)) {
            switch (nodo.hijos.length) {
                // id punto push par_izq EXP par_der punto_coma
                case 7:
                    {
                        const id = nodo.hijos[0];
                        const exp = this.recorrer(nodo.hijos[4], e);
                        //TODO: validar errores
                        const variable = e.getVariable(id);
                        if (variable) {
                            return `${variable.getIdNuevo()}.push(${exp});`;
                        }
                        return `${id}.push(${exp});`;
                    }
                //id LISTA_ACCESOS_TYPE punto push par_izq EXP par_der punto_coma
                case 8:
                    {
                        const id = nodo.hijos[0];
                        const lista_accesos = this.recorrer(nodo.hijos[1], e);
                        const exp = this.recorrer(nodo.hijos[5], e);
                        //TODO: validar errores
                        const variable = e.getVariable(id);
                        if (variable) {
                            return `${variable.getIdNuevo()}${lista_accesos}.push(${exp});`;
                        }
                        return `${id}${lista_accesos}.push(${exp});`;
                    }
            }
        }
        //CONSOLE_LOG
        else if (this.soyNodo('CONSOLE_LOG', nodo)) {
            //console punto log par_izq LISTA_EXPRESIONES par_der punto_coma
            const lista_exp = this.recorrer(nodo.hijos[4], e);
            return `console.log(${lista_exp});`;
        }
        //INSTRUCCION_IF
        else if (this.soyNodo('INSTRUCCION_IF', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
            });
            return codigoAux;
        }
        //SWITCH
        else if (this.soyNodo('SWITCH', nodo)) {
            //switch par_izq EXP par_der llave_izq LISTA_CASE llave_der
            const exp = this.recorrer(nodo.hijos[2], e);
            const lista_case = this.recorrer(nodo.hijos[5], e);
            return `switch(${exp}){\n${lista_case}}`;
        }
        //BREAK
        else if (this.soyNodo('BREAK', nodo)) {
            //break punto_coma
            return 'break;';
        }
        //RETURN
        else if (this.soyNodo('RETURN', nodo)) {
            switch (nodo.hijos.length) {
                // return punto_coma
                case 2:
                    return 'return;';
                // return EXP punto_coma
                case 3:
                    const exp = this.recorrer(nodo.hijos[1], e);
                    return `return ${exp};`;
            }
        }
        //CONTINUE
        else if (this.soyNodo('CONTINUE', nodo)) {
            //continue punto_coma
            return 'continue;';
        }
        //WHILE
        else if (this.soyNodo('WHILE', nodo)) {
            // while par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
            const exp = this.recorrer(nodo.hijos[2], e);
            const entorno = new entorno_1.Entorno(e);
            const instrucciones = this.recorrer(nodo.hijos[5], entorno);
            return `while(${exp}){\n${instrucciones}}`;
        }
        //DO_WHILE
        else if (this.soyNodo('DO_WHILE', nodo)) {
            // do llave_izq INSTRUCCIONES llave_der while par_izq EXP par_der punto_coma
            const entorno = new entorno_1.Entorno(e);
            const instrucciones = this.recorrer(nodo.hijos[2], entorno);
            const exp = this.recorrer(nodo.hijos[6], e);
            return `do{\n${instrucciones}}while(${exp});`;
        }
        //FOR
        else if (this.soyNodo('FOR', nodo)) {
            switch (nodo.hijos.length) {
                case 10:
                    //for par_izq DECLARACION_VARIABLE EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der
                    if (this.soyNodo('DECLARACION_VARIABLE', nodo.hijos[2])) {
                        const entorno = new entorno_1.Entorno(e);
                        const dec_var = this.recorrer(nodo.hijos[2], entorno);
                        const exp = this.recorrer(nodo.hijos[3], entorno);
                        const asig_for = this.recorrer(nodo.hijos[5], entorno);
                        const instrucciones = this.recorrer(nodo.hijos[8], new entorno_1.Entorno(entorno));
                        return `for(${dec_var} ${exp}; ${asig_for}){\n${instrucciones}}`;
                    }
                    //for par_izq ASIGNACION EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der
                    if (this.soyNodo('ASIGNACION', nodo.hijos[2])) {
                        const asig = this.recorrer(nodo.hijos[2], e);
                        const exp = this.recorrer(nodo.hijos[3], e);
                        const asig_for = this.recorrer(nodo.hijos[5], e);
                        const instrucciones = this.recorrer(nodo.hijos[8], new entorno_1.Entorno(e));
                        return `for(${asig} ${exp}; ${asig_for}){\n${instrucciones}}`;
                    }
            }
        }
        //FOR_OF
        else if (this.soyNodo('FOR_OF', nodo)) {
            //for par_izq TIPO_DEC_VARIABLE id of EXP par_der llave_izq INSTRUCCIONES llave_der
            const entorno = new entorno_1.Entorno(e);
            const tipo_dec_var = this.recorrer(nodo.hijos[2], entorno);
            const id = nodo.hijos[3];
            const exp = this.recorrer(nodo.hijos[5], entorno);
            const instrucciones = this.recorrer(nodo.hijos[8], new entorno_1.Entorno(entorno));
            return `for(${tipo_dec_var} ${id} of ${exp}){\n${instrucciones}}`;
        }
        //FOR_IN
        else if (this.soyNodo('FOR_IN', nodo)) {
            //for par_izq TIPO_DEC_VARIABLE id in EXP par_der llave_izq INSTRUCCIONES llave_der
            const entorno = new entorno_1.Entorno(e);
            const tipo_dec_var = this.recorrer(nodo.hijos[2], entorno);
            const id = nodo.hijos[3];
            const exp = this.recorrer(nodo.hijos[5], entorno);
            const instrucciones = this.recorrer(nodo.hijos[8], new entorno_1.Entorno(entorno));
            return `for(${tipo_dec_var} ${id} in ${exp}){\n${instrucciones}}`;
        }
        //GRAFICAR_TS
        else if (this.soyNodo('GRAFICAR_TS', nodo)) {
            //graficar_ts par_izq par_der punto_coma
            return `graficar_ts();`;
        }
        //LLAMADA_FUNCION
        else if (this.soyNodo('LLAMADA_FUNCION', nodo)) {
            switch (nodo.hijos.length) {
                // id par_izq par_der punto_coma
                case 4: {
                    const id = nodo.hijos[0];
                    const fn = e.getFuncion(id);
                    if (fn) {
                        return `${fn.getIdNuevo()}();`;
                    }
                    return `${id}();`;
                }
                //id par_izq LISTA_EXPRESIONES par_der punto_coma
                case 5: {
                    const id = nodo.hijos[0];
                    const lista_exp = this.recorrer(nodo.hijos[2], e);
                    const fn = e.getFuncion(id);
                    if (fn) {
                        return `${fn.getIdNuevo()}(${lista_exp});`;
                    }
                    return `${id}(${lista_exp});`;
                }
            }
        }
        //ASIGNACION_FOR
        else if (this.soyNodo('ASIGNACION_FOR', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                //id mas_mas | id menos_menos
                case 2:
                    return `${id}${nodo.hijos[1]}`;
                //id TIPO_IGUAL EXP
                case 3:
                    const igual = this.recorrer(nodo.hijos[1], e);
                    const exp = this.recorrer(nodo.hijos[2], e);
                    const variable = e.getVariable(id);
                    if (variable) {
                        return `${variable.getIdNuevo()} ${igual} ${exp}`;
                    }
                    return `${id} = ${exp}`;
            }
        }
        //CASE
        else if (this.soyNodo('CASE', nodo)) {
            //case EXP dos_puntos INSTRUCCIONES
            const entorno = new entorno_1.Entorno(e);
            const exp = this.recorrer(nodo.hijos[1], entorno);
            const instrucciones = this.recorrer(nodo.hijos[3], entorno);
            return `case ${exp}: \n${instrucciones}`;
        }
        //DEFAULT
        else if (this.soyNodo('DEFAULT', nodo)) {
            // default dos_puntos INSTRUCCIONES
            const instrucciones = this.recorrer(nodo.hijos[2], new entorno_1.Entorno(e));
            return `default:\n${instrucciones}`;
        }
        //LISTA_CASE
        else if (this.soyNodo('LISTA_CASE', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
            });
            return codigoAux;
        }
        //IF
        else if (this.soyNodo('IF', nodo)) {
            //if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
            const exp = this.recorrer(nodo.hijos[2], e);
            const entorno = new entorno_1.Entorno(e);
            const instrucciones = this.recorrer(nodo.hijos[5], entorno);
            return `if(${exp}){\n${instrucciones}}\n`;
        }
        //ELSE
        else if (this.soyNodo('ELSE', nodo)) {
            //else llave_izq INSTRUCCIONES llave_der
            const entorno = new entorno_1.Entorno(e);
            const instrucciones = this.recorrer(nodo.hijos[2], entorno);
            return `else{\n${instrucciones}}`;
        }
        //ELSE_IF
        else if (this.soyNodo('ELSE_IF', nodo)) {
            //else if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
            const exp = this.recorrer(nodo.hijos[3], e);
            const entorno = new entorno_1.Entorno(e);
            const instrucciones = this.recorrer(nodo.hijos[6], entorno);
            return `else if(${exp}){\n${instrucciones}}\n`;
        }
        //LISTA_ELSE_IF
        else if (this.soyNodo('LISTA_ELSE_IF', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
            });
            return codigoAux;
        }
        //ACCESO_ARREGLO
        else if (this.soyNodo('ACCESO_ARREGLO', nodo)) {
            // id LISTA_ACCESOS_ARREGLO
            const id = nodo.hijos[0];
            const lista_accesos = this.recorrer(nodo.hijos[1], e);
            //TODO: validacion de error
            const variable = e.getVariable(id);
            if (variable) {
                return `${variable.getIdNuevo()}${lista_accesos}`;
            }
            return `${id}${lista_accesos}`;
        }
        //LISTA_ACCESOS_TYPE
        else if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
                else {
                    codigoAux += nodoHijo;
                }
            });
            return codigoAux;
        }
        //LISTA_ACCESOS_ARREGLO
        else if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo)) {
            //cor_izq EXP cor_der .....
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
                else {
                    codigoAux += nodoHijo;
                }
            });
            return codigoAux;
        }
        //TIPO_IGUAL
        else if (this.soyNodo('TIPO_IGUAL', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                codigoAux += `${nodoHijo}`;
            });
            return codigoAux;
        }
        //TIPO_VARIABLE_NATIVA
        else if (this.soyNodo('TIPO_VARIABLE_NATIVA', nodo)) {
            if (this.soyNodo('ID', nodo.hijos[0])) {
                return this.recorrer(nodo.hijos[0], e);
            }
            return nodo.hijos[0];
        }
        // TIPO_DEC_VARIABLE
        else if (this.soyNodo('TIPO_DEC_VARIABLE', nodo)) {
            return nodo.hijos[0];
        }
        //DECLARACION_VARIABLE
        else if (this.soyNodo('DECLARACION_VARIABLE', nodo)) {
            let codigoAux = '';
            switch (nodo.hijos.length) {
                //TIPO_DEC_VARIABLE LISTA_DECLARACIONES punto_coma
                case 3:
                    const tipo_let_const = this.recorrer(nodo.hijos[0], e);
                    const reasignable = tipo_let_const == 'const' ? false : true;
                    codigoAux += `${tipo_let_const} `;
                    // {id, tipo, corchetes, exp}
                    const declaraciones = this.recorrer(nodo.hijos[1], e);
                    declaraciones.forEach((declaracion, index) => {
                        const id = declaracion['id'];
                        //{id}
                        if (declaracion['id'] && declaracion['tipo'] == null && !declaracion['corchetes'] && !declaracion['exp']) {
                            const tipo = 4 /* SIN_ASIGNAR */;
                            const variable = new variable_1.Variable({ id, tipo, reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            codigoAux += `${variable.getIdNuevo()}`;
                        }
                        //{id, tipo}
                        if (declaracion['id'] && declaracion['tipo'] != null && !declaracion['corchetes'] && !declaracion['exp']) {
                            const tipo = declaracion['tipo'];
                            const variable = new variable_1.Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            codigoAux += `${variable.getIdNuevo()} : ${tipo}`;
                        }
                        //{id, exp}
                        if (declaracion['id'] && declaracion['exp'] && declaracion['tipo'] == null && !declaracion['corchetes']) {
                            //TODO: ASIGNAR EL TIPO BASADO EN LA EXPRESION
                            const tipo = 4 /* SIN_ASIGNAR */;
                            const variable = new variable_1.Variable({ id, tipo, reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            codigoAux += `${variable.getIdNuevo()} = ${declaracion['exp']}`;
                        }
                        //{id, tipo, exp}
                        if (declaracion['id'] && declaracion['tipo'] != null && declaracion['exp'] && !declaracion['corchetes']) {
                            const tipo = declaracion['tipo'];
                            //TODO: Validar que el tipo asignado y el tipo de la exp sean iguales
                            const variable = new variable_1.Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            codigoAux += `${variable.getIdNuevo()} : ${tipo} = ${declaracion['exp']}`;
                        }
                        //{id, tipo, corchetes}
                        if (declaracion['id'] && declaracion['tipo'] != null && !declaracion['exp'] && declaracion['corchetes']) {
                            const tipo = declaracion['tipo'];
                            const corchetes = declaracion['corchetes'];
                            const variable = new variable_1.Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            codigoAux += `${variable.getIdNuevo()} : ${tipo}${corchetes}`;
                        }
                        //{id, tipo, corchetes, exp}
                        if (declaracion['id'] && declaracion['tipo'] != null && declaracion['exp'] && declaracion['corchetes']) {
                            const tipo = declaracion['tipo'];
                            const corchetes = declaracion['corchetes'];
                            //TODO: VALIDAR EL TIPO CON LA EXP ASIGNADA
                            const variable = new variable_1.Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            codigoAux += `${variable.getIdNuevo()} : ${tipo}${corchetes} = ${declaracion['exp']}`;
                        }
                        //Si no soy el ultimo agrego una coma
                        if (index < declaraciones.length - 1)
                            codigoAux += ', ';
                        //Si soy el ultimo agrego el punto y coma correspondiente
                        else
                            codigoAux += ';';
                    });
                    break;
            }
            return codigoAux;
        }
        //LISTA_DECLARACIONES
        else if (this.soyNodo('LISTA_DECLARACIONES', nodo)) {
            switch (nodo.hijos.length) {
                // DEC_ID | DEC_ID_TIPO | DEC_ID_TIPO_CORCHETES | DEC_ID_EXP ...
                case 1:
                    return [this.recorrer(nodo.hijos[0], e)];
                default:
                    const lista = [];
                    nodo.hijos.forEach((nodoHijo) => {
                        const declaracion = this.recorrer(nodoHijo, e);
                        lista.push(declaracion);
                    });
                    return lista;
            }
        }
        //DEC_ID
        else if (this.soyNodo('DEC_ID', nodo)) {
            switch (nodo.hijos.length) {
                //id
                case 1:
                    return { id: nodo.hijos[0] };
            }
        }
        // DEC_ID_TIPO
        else if (this.soyNodo('DEC_ID_TIPO', nodo)) {
            switch (nodo.hijos.length) {
                // id dos_puntos TIPO_VARIABLE_NATIVA
                case 3:
                    const id = nodo.hijos[0];
                    const tipo = this.recorrer(nodo.hijos[2], e);
                    return { id, tipo };
            }
        }
        //DEC_ID_EXP
        else if (this.soyNodo('DEC_ID_EXP', nodo)) {
            switch (nodo.hijos.length) {
                //id igual EXP
                case 3:
                    const id = nodo.hijos[0];
                    const exp = this.recorrer(nodo.hijos[2], e);
                    return { id, exp };
            }
        }
        //DEC_ID_TIPO_EXP
        else if (this.soyNodo('DEC_ID_TIPO_EXP', nodo)) {
            switch (nodo.hijos.length) {
                // id dos_puntos TIPO_VARIABLE_NATIVA igual EXP
                case 5:
                    const id = nodo.hijos[0];
                    const tipo = this.recorrer(nodo.hijos[2], e);
                    const exp = this.recorrer(nodo.hijos[4], e);
                    return { id, tipo, exp };
            }
        }
        //DEC_ID_TIPO_CORCHETES
        else if (this.soyNodo('DEC_ID_TIPO_CORCHETES', nodo)) {
            switch (nodo.hijos.length) {
                // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
                case 4:
                    const id = nodo.hijos[0];
                    const tipo = this.recorrer(nodo.hijos[2], e);
                    const corchetes = this.recorrer(nodo.hijos[3], e);
                    return { id, tipo, corchetes };
            }
        }
        //DEC_ID_TIPO_CORCHETES_EXP
        else if (this.soyNodo('DEC_ID_TIPO_CORCHETES_EXP', nodo)) {
            switch (nodo.hijos.length) {
                // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES igual EXP
                case 6:
                    const id = nodo.hijos[0];
                    const tipo = this.recorrer(nodo.hijos[2], e);
                    const corchetes = this.recorrer(nodo.hijos[3], e);
                    const exp = this.recorrer(nodo.hijos[5], e);
                    return { id, tipo, corchetes, exp };
            }
        }
        //EXP
        else if (this.soyNodo('EXP', nodo)) {
            switch (nodo.hijos.length) {
                case 1:
                    return this.recorrer(nodo.hijos[0], e);
                case 2:
                    //menos EXP
                    if (nodo.hijos[0] == '-' && this.soyNodo('EXP', nodo.hijos[1])) {
                        return '-' + this.recorrer(nodo.hijos[1], e);
                    }
                    //id mas_mas
                    if (nodo.hijos[1] == '++') {
                        return nodo.hijos[0] + '++';
                    }
                    //id menos_menos
                    if (nodo.hijos[1] == '--') {
                        return nodo.hijos[0] + '--';
                    }
                    //cor_izq cor_der
                    if (nodo.hijos[0] == '[' && nodo.hijos[1] == ']') {
                        return '[]';
                    }
                    //not EXP
                    if (nodo.hijos[0] = '!' && this.soyNodo('EXP', nodo.hijos[1])) {
                        return '!' + this.recorrer(nodo.hijos[1], e);
                    }
                case 3:
                    //EXP mas EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` + ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP menos EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '-' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` - ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP por EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '*' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` * ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP div EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '/' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` / ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP mod EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '%' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` % ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP potencia EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '**' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` ** ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //par_izq EXP par_der
                    if (nodo.hijos[0] == '(' && this.soyNodo('EXP', nodo.hijos[1]) && nodo.hijos[2] == ')') {
                        return '( ' + this.recorrer(nodo.hijos[1], e) + ' )';
                    }
                    //EXP mayor EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` > ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP menor EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` < ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP mayor_igual EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>=' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` >= ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP menor_igual EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<=' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` <= ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP igual_que EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '==' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` == ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP dif_que EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '!=' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` != ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP and EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '&&' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` && ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //EXP or EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '||' && this.soyNodo('EXP', nodo.hijos[2])) {
                        return this.recorrer(nodo.hijos[0], e) + ` || ` + this.recorrer(nodo.hijos[2], e);
                    }
                    //cor_izq LISTA_EXPRESIONES cor_der
                    if (nodo.hijos[0] == '[' && this.soyNodo('LISTA_EXPRESIONES', nodo.hijos[1]) && nodo.hijos[2] == ']') {
                        return '[' + this.recorrer(nodo.hijos[1], e) + ']';
                    }
            }
        }
        //ARRAY_LENGTH
        else if (this.soyNodo('ARRAY_LENGTH', nodo)) {
            const id = nodo.hijos[0];
            const variable = e.getVariable(id);
            switch (nodo.hijos.length) {
                // id punto length
                case 3:
                    if (variable) {
                        return `${variable.getIdNuevo()}.length`;
                    }
                    return `${id}.length`;
                case 4:
                    // id LISTA_ACCESOS_ARREGLO punto length
                    if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo.hijos[1])) {
                        const lista_accesos_arreglo = this.recorrer(nodo.hijos[1], e);
                        if (variable) {
                            return `${variable}${lista_accesos_arreglo}.length`;
                        }
                        return `${id}${lista_accesos_arreglo}.length`;
                    }
                    // id LISTA_ACCESOS_TYPE punto length
                    if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo.hijos[1])) {
                        const lista_accesos_type = this.recorrer(nodo.hijos[1], e);
                        if (variable) {
                            return `${variable.getIdNuevo()}${lista_accesos_type}.length`;
                        }
                        return `${id}${lista_accesos_type}.length`;
                    }
            }
        }
        //ARRAY_POP
        else if (this.soyNodo('ARRAY_POP', nodo)) {
            const id = nodo.hijos[0];
            const variable = e.getVariable(id);
            switch (nodo.hijos.length) {
                // id punto pop par_izq par_der
                case 5:
                    if (variable) {
                        return `${variable.getIdNuevo()}.pop()`;
                    }
                    return `${id}.pop()`;
                case 6:
                    //id LISTA_ACCESOS_ARREGLO punto pop par_izq par_der
                    if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo.hijos[1])) {
                        const lista_accesos_arreglo = this.recorrer(nodo.hijos[1], e);
                        if (variable) {
                            return `${variable.getIdNuevo()}${lista_accesos_arreglo}.pop()`;
                        }
                        return `${id}${lista_accesos_arreglo}.pop()`;
                    }
                    //id LISTA_ACCESOS_TYPE punto pop par_izq par_der
                    if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo.hijos[1])) {
                        const lista_accesos_type = this.recorrer(nodo.hijos[1], e);
                        if (variable) {
                            return `${variable.getIdNuevo()}${lista_accesos_type}.pop()`;
                        }
                        return `${id}${lista_accesos_type}.pop()`;
                    }
            }
        }
        //TYPE
        else if (this.soyNodo('TYPE', nodo)) {
            // llave_izq ATRIBUTOS_TYPE llave_der
            const atributos_type = this.recorrer(nodo.hijos[1], e);
            return `{\n${atributos_type}\n}`;
        }
        //TERNARIO
        else if (this.soyNodo('TERNARIO', nodo)) {
            //EXP interrogacion EXP dos_puntos EXP
            const exp1 = this.recorrer(nodo.hijos[0], e);
            const exp2 = this.recorrer(nodo.hijos[2], e);
            const exp3 = this.recorrer(nodo.hijos[4], e);
            return `${exp1} ? ${exp2} : ${exp3}`;
        }
        //ACCESO_TYPE
        else if (this.soyNodo('ACCESO_TYPE', nodo)) {
            // id LISTA_ACCESOS_TYPE
            const id = nodo.hijos[0];
            const lista_accesos_type = this.recorrer(nodo.hijos[1], e);
            const variable = e.getVariable(id);
            if (variable) {
                return `${variable.getIdNuevo()}${lista_accesos_type}`;
            }
            return `${id}${lista_accesos_type}`;
        }
        //ATRIBUTO_TYPE
        else if (this.soyNodo('ATRIBUTO_TYPE', nodo)) {
            // id dos_puntos EXP
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[2], e);
            return `${id} : ${exp}`;
        }
        //ATRIBUTOS_TYPE
        else if (this.soyNodo('ATRIBUTOS_TYPE', nodo)) {
            //ATRIBUTO_TYPE coma ....
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
                else {
                    codigoAux += `${nodoHijo} `;
                }
            });
            return codigoAux;
        }
        //LLAMADA_FUNCION_EXP
        else if (this.soyNodo('LLAMADA_FUNCION_EXP', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                // id par_izq par_der
                case 3: {
                    const fn = e.getFuncion(id);
                    if (fn) {
                        return `${fn.getIdNuevo()}()`;
                    }
                    return `${id}()`;
                }
                // id par_izq LISTA_EXPRESIONES par_der
                case 4: {
                    const lista_exp = this.recorrer(nodo.hijos[2], e);
                    const fn = e.getFuncion(id);
                    if (fn) {
                        return `${fn.getIdNuevo()}(${lista_exp})`;
                    }
                    return `${id}(${lista_exp})`;
                }
            }
        }
        //LISTA_EXPRESIONES
        else if (this.soyNodo('LISTA_EXPRESIONES', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
                else {
                    codigoAux += nodoHijo + ' ';
                }
            });
            return codigoAux;
        }
        //ID
        else if (this.soyNodo('ID', nodo)) {
            const id = nodo.hijos[0];
            const variable = e.getVariable(id);
            if (variable != null) {
                return variable.getIdNuevo();
            }
            return id;
        }
        //NUMBER
        else if (this.soyNodo('NUMBER', nodo)) {
            return nodo.hijos[0];
        }
        //STRING
        else if (this.soyNodo('STRING', nodo)) {
            return nodo.hijos[0];
        }
        //BOOLEAN
        else if (this.soyNodo('BOOLEAN', nodo)) {
            return nodo.hijos[0];
        }
        //NULL
        else if (this.soyNodo('NULL', nodo)) {
            return nodo.hijos[0];
        }
        //LISTA_CORCHETES
        else if (this.soyNodo('LISTA_CORCHETES', nodo)) {
            return nodo.hijos[0].repeat(nodo.hijos.length);
        }
        //LISTA_PARAMETROS
        else if (this.soyNodo('LISTA_PARAMETROS', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (this.soyNodo('PARAMETRO', nodoHijo)) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
                else {
                    codigoAux += `${nodoHijo} `; //coma
                }
            });
            return codigoAux;
        }
        //PARAMETRO
        else if (this.soyNodo('PARAMETRO', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                // id dos_puntos TIPO_VARIABLE_NATIVA
                case 3: {
                    let tipo = this.recorrer(nodo.hijos[2], e);
                    return `${id}: ${tipo}`;
                }
                // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
                case 4: {
                    let tipo = this.recorrer(nodo.hijos[2], e);
                    const corchetes = this.recorrer(nodo.hijos[3], e);
                    return `${id} : ${tipo}${corchetes}`;
                }
                // id dos_puntos Array menor TIPO_VARIABLE_NATIVA mayor
                case 6: {
                    let tipo = this.recorrer(nodo.hijos[4], e);
                    return `${id} : Array<${tipo}>`;
                }
            }
        }
        //ATRIBUTO
        else if (this.soyNodo('ATRIBUTO', nodo)) {
            const id = nodo.hijos[0];
            const tipo = this.recorrer(nodo.hijos[2], e);
            switch (nodo.hijos.length) {
                // id dos_puntos TIPO_VARIABLE_NATIVA
                case 3:
                    return `${id} : ${tipo}`;
                // id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
                case 4:
                    const corchetes = this.recorrer(nodo.hijos[3], e);
                    return `${id} : ${tipo}${corchetes}`;
            }
        }
        //LISTA_ATRIBUTOS
        else if (this.soyNodo('LISTA_ATRIBUTOS', nodo)) {
            let codigoAux = '';
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    codigoAux += this.recorrer(nodoHijo, e);
                }
                else {
                    codigoAux += `${nodoHijo}\n`;
                }
            });
            return codigoAux;
        }
        //INCREMENTO_DECREMENTO
        else if (this.soyNodo('INCREMENTO_DECREMENTO', nodo)) {
            //id mas_mas punto_coma || id menos_menos punto_coma
            const id = nodo.hijos[0];
            const variable = e.getVariable(id);
            if (variable) {
                return `${variable.getIdNuevo()} ${nodo.hijos[1]};`;
            }
            return `${id} ${nodo.hijos[1]};`;
        }
        return '';
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
    /**
     * Recibe un nodo y retorna el valor de su hijo
     * @param nodo
     */
    getValorDeNodo(nodo) {
        if (nodo == null || !(nodo instanceof Object))
            return '';
        if (nodo.hasOwnProperty('hijos') && nodo.hijos instanceof Array && nodo.hijos[0] != null)
            return nodo.hijos[0];
        return '';
    }
    /**
     * Funcion que retorna un string con el nuevo nombre para la variable
     * @param e
     * @param id
     */
    getIdNuevo(e, id) {
        return `nv_${e.getNombreFuncionGeneradora()}_${id}`;
    }
    /**
     * Recibe un nodo INSTRUCCIONES y retorna true si alguno de sus hijos es una DECLARACION_FUNCION
     * @param nodo
     */
    tengoFuncionAnidada(nodo) {
        if (!(nodo instanceof Object))
            return false;
        return nodo.hijos.some((item) => item.label == 'DECLARACION_FUNCION');
    }
    /**
     * Retorna un elemento del enum TIPOS
     * @param tipo hijo de TIPO_VARIABLE_NATIVA
     * @param e entorno actual
     */
    getTipo(tipo, e) {
        if (tipo == 'string')
            return 0 /* STRING */;
        if (tipo == 'number')
            return 1 /* NUMBER */;
        if (tipo == 'boolean')
            return 2 /* BOOLEAN */;
        if (tipo == 'void')
            return 5 /* VOID */;
        //Si es un ID
        const variable = e.getVariable(tipo);
        if (variable != null) {
            return variable.getTipo();
        }
        return 4 /* SIN_ASIGNAR */;
    }
}
exports.Traduccion = Traduccion;
