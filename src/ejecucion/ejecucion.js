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
const asignacion_arreglo_1 = require("./instrucciones/asignaciones/asignacion_arreglo");
const declaracion_funcion_1 = require("./instrucciones/declaraciones/declaracion_funcion");
const llamada_funcion_1 = require("./expresiones/llamada_funcion");
const return_1 = require("./expresiones/flujo/return");
const resta_1 = require("./expresiones/aritmeticas/resta");
const multiplicacion_1 = require("./expresiones/aritmeticas/multiplicacion");
const division_1 = require("./expresiones/aritmeticas/division");
const modular_1 = require("./expresiones/aritmeticas/modular");
const potencia_1 = require("./expresiones/aritmeticas/potencia");
const mayor_1 = require("./expresiones/relacionales/mayor");
const menor_1 = require("./expresiones/relacionales/menor");
const mayor_igual_1 = require("./expresiones/relacionales/mayor_igual");
const menor_igual_1 = require("./expresiones/relacionales/menor_igual");
const igual_1 = require("./expresiones/relacionales/igual");
const diferente_1 = require("./expresiones/relacionales/diferente");
const And_1 = require("./expresiones/logicas/And");
const Or_1 = require("./expresiones/logicas/Or");
const Not_1 = require("./expresiones/logicas/Not");
const array_length_simple_1 = require("./expresiones/length/array_length_simple");
const array_length_accesos_arreglo_1 = require("./expresiones/length/array_length_accesos_arreglo");
const array_length_accesos_type_1 = require("./expresiones/length/array_length_accesos_type");
const array_pop_1 = require("./expresiones/pop/array_pop");
const array_pop_accesos_arreglo_1 = require("./expresiones/pop/array_pop_accesos_arreglo");
const array_pop_accesos_type_1 = require("./expresiones/pop/array_pop_accesos_type");
const dec_id_tipo_1 = require("./instrucciones/declaraciones/dec_id_tipo");
const _ = require("lodash");
const dec_id_tipo_corchetes_1 = require("./instrucciones/declaraciones/dec_id_tipo_corchetes");
const dec_id_tipo_exp_1 = require("./instrucciones/declaraciones/dec_id_tipo_exp");
const dec_id_tipo_corchetes_exp_1 = require("./instrucciones/declaraciones/dec_id_tipo_corchetes_exp");
const push_arreglo_1 = require("./instrucciones/push/push_arreglo");
const push_arreglo_acceso_type_1 = require("./instrucciones/push/push_arreglo_acceso_type");
const break_1 = require("./expresiones/flujo/break");
const continue_1 = require("./expresiones/flujo/continue");
const if_1 = require("./if");
const instruccion_if_1 = require("./expresiones/condicionales/instruccion_if");
const while_1 = require("./instrucciones/ciclos/while");
const do_while_1 = require("./instrucciones/ciclos/do_while");
const for_1 = require("./instrucciones/ciclos/for");
const mas_mas_1 = require("./expresiones/aritmeticas/mas_mas");
const menos_menos_1 = require("./expresiones/aritmeticas/menos_menos");
const for_of_1 = require("./instrucciones/ciclos/for_of");
const for_in_1 = require("./instrucciones/ciclos/for_in");
const variable_1 = require("./variable");
const ternario_1 = require("./expresiones/condicionales/ternario");
const case_1 = require("./case");
const switch_1 = require("./expresiones/condicionales/switch");
const entornos_1 = require("./entornos");
const graficar_ts_1 = require("./instrucciones/graficar_ts");
const incremento_decremento_1 = require("./instrucciones/incremento_decremento");
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
            entornos_1.Entornos.getInstance().push(entorno);
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
            //Realizo el primer recorrido para las declaraciones
            nodo.hijos.forEach((nodoHijo) => {
                if ( /* this.soyNodo('DECLARACION_VARIABLE', nodoHijo) ||  */this.soyNodo('DECLARACION_FUNCION', nodoHijo) || this.soyNodo('DECLARACION_TYPE', nodoHijo)) {
                    const inst = this.recorrer(nodoHijo);
                    if (inst instanceof Array) {
                        instrucciones = instrucciones.concat(inst);
                    }
                    else {
                        instrucciones.push(inst);
                    }
                }
            });
            //Recorro las demas instrucciones
            nodo.hijos.forEach((nodoHijo) => {
                if ( /* !this.soyNodo('DECLARACION_VARIABLE', nodoHijo) && */!this.soyNodo('DECLARACION_FUNCION', nodoHijo) && !this.soyNodo('DECLARACION_TYPE', nodoHijo)) {
                    const inst = this.recorrer(nodoHijo);
                    if (inst instanceof Array) {
                        instrucciones = instrucciones.concat(inst);
                    }
                    else {
                        instrucciones.push(inst);
                    }
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
                var _a, _b, _c, _d;
                const linea = nodo.linea;
                const id = item['id'];
                //{id, tipo, dimensiones, exp, type_generador? }
                if (_.has(item, 'id') && _.has(item, 'tipo') && _.has(item, 'dimensiones') && _.has(item, 'exp')) {
                    const tipo = item['tipo'];
                    const dimensiones = item['dimensiones'];
                    const exp = item['exp'];
                    const type_generador = (_a = item['type_generador']) !== null && _a !== void 0 ? _a : null;
                    lista_instrucciones.push(new dec_id_tipo_corchetes_exp_1.DecIdTipoCorchetesExp(nodo.linea, reasignable, id, tipo, dimensiones, exp, type_generador));
                }
                //{id, tipo, dimensiones, type_generador? }
                else if (_.has(item, 'id') && _.has(item, 'tipo') && _.has(item, 'dimensiones')) {
                    const tipo = item['tipo'];
                    const dimensiones = item['dimensiones'];
                    const type_generador = (_b = item['type_generador']) !== null && _b !== void 0 ? _b : null;
                    lista_instrucciones.push(new dec_id_tipo_corchetes_1.DecIdTipoCorchetes(nodo.linea, reasignable, id, tipo, dimensiones, type_generador));
                }
                //{id, tipo, exp, type_generador?}
                else if (_.has(item, 'id') && _.has(item, 'tipo') && _.has(item, 'exp')) {
                    const tipo = item['tipo'];
                    const exp = item['exp'];
                    const type_generador = (_c = item['type_generador']) !== null && _c !== void 0 ? _c : null;
                    lista_instrucciones.push(new dec_id_tipo_exp_1.DecIdTipoExp(nodo.linea, reasignable, id, tipo, exp, type_generador));
                }
                //{id, tipo, type_generador?}
                else if (_.has(item, 'id') && _.has(item, 'tipo')) {
                    const tipo = item['tipo'];
                    const type_generador = (_d = item['type_generador']) !== null && _d !== void 0 ? _d : null;
                    lista_instrucciones.push(new dec_id_tipo_1.DecIdTipo(nodo.linea, reasignable, id, tipo, type_generador));
                }
                //{id, exp}
                else if (_.has(item, 'id') && _.has(item, 'exp')) {
                    const exp = item['exp'];
                    lista_instrucciones.push(new dec_id_exp_1.DecIdExp(linea, reasignable, id, exp));
                }
                //{id}
                else if (_.has(item, 'id')) {
                    lista_instrucciones.push(new dec_id_1.DecId(linea, reasignable, id));
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
        //DEC_ID_TIPO_EXP
        if (this.soyNodo('DEC_ID_TIPO_EXP', nodo)) {
            //id dos_puntos TIPO_VARIABLE_NATIVA igual EXP
            const tipo_var_nat = this.recorrer(nodo.hijos[2]);
            const exp = this.recorrer(nodo.hijos[4]);
            return Object.assign(Object.assign({ id: nodo.hijos[0] }, tipo_var_nat), { exp });
        }
        //DEC_ID_EXP
        if (this.soyNodo('DEC_ID_EXP', nodo)) {
            //id igual EXP
            const id = nodo.hijos[0];
            const exp = this.recorrer(nodo.hijos[2]);
            return { id, exp };
        }
        //DEC_ID_TIPO_CORCHETES
        if (this.soyNodo('DEC_ID_TIPO_CORCHETES', nodo)) {
            //id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
            const id = nodo.hijos[0];
            const tipo_var_nat = this.recorrer(nodo.hijos[2]);
            const dimensiones = this.recorrer(nodo.hijos[3]);
            return Object.assign(Object.assign({ id }, tipo_var_nat), { dimensiones });
            //{id, tipo, dimensiones, type_generador? }
        }
        //DEC_ID_TIPO_CORCHETES_EXP
        if (this.soyNodo('DEC_ID_TIPO_CORCHETES_EXP', nodo)) {
            //id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES igual EXP
            const id = nodo.hijos[0];
            const tipo_var_nat = this.recorrer(nodo.hijos[2]);
            const dimensiones = this.recorrer(nodo.hijos[3]);
            const exp = this.recorrer(nodo.hijos[5]);
            return Object.assign(Object.assign({ id }, tipo_var_nat), { dimensiones, exp });
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
                    //menos EXP
                    if (nodo.hijos[0] == '-' && this.soyNodo('EXP', nodo.hijos[1])) {
                        const expIzq = new nativo_1.Nativo(nodo.linea, -1);
                        const expDer = this.recorrer(nodo.hijos[1]);
                        return new multiplicacion_1.Multiplicacion(nodo.linea, expIzq, expDer);
                    }
                    //cor_izq cor_der
                    if (nodo.hijos[0] == '[' && nodo.hijos[1] == ']') {
                        return new arreglo_1.Arreglo(nodo.linea);
                    }
                    //id mas_mas
                    if (nodo.hijos[1] == '++') {
                        const id = nodo.hijos[0];
                        return new mas_mas_1.MasMas(nodo.linea, id);
                    }
                    //id menos_menos
                    if (nodo.hijos[1] == '--') {
                        const id = nodo.hijos[0];
                        return new menos_menos_1.MenosMenos(nodo.linea, id);
                    }
                    //not EXP
                    if (nodo.hijos[0] == '!' && this.soyNodo('EXP', nodo.hijos[1])) {
                        const exp = this.recorrer(nodo.hijos[1]);
                        return new Not_1.Not(nodo.linea, exp);
                    }
                case 3:
                    //EXP mas EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '+' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new suma_1.Suma(linea, expIzq, expDer);
                    }
                    //EXP menos EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '-' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new resta_1.Resta(linea, expIzq, expDer);
                    }
                    //EXP por EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '*' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new multiplicacion_1.Multiplicacion(linea, expIzq, expDer);
                    }
                    //EXP div EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '/' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new division_1.Division(linea, expIzq, expDer);
                    }
                    //EXP mod EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '%' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new modular_1.Modular(linea, expIzq, expDer);
                    }
                    //EXP potencia EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '**' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new potencia_1.Potencia(linea, expIzq, expDer);
                    }
                    //par_izq EXP par_der
                    if (nodo.hijos[0] == '(' && this.soyNodo('EXP', nodo.hijos[1]) && nodo.hijos[2] == ')') {
                        return this.recorrer(nodo.hijos[1]);
                    }
                    //EXP mayor EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new mayor_1.Mayor(linea, expIzq, expDer);
                    }
                    //EXP menor EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new menor_1.Menor(linea, expIzq, expDer);
                    }
                    //EXP mayor_igual EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '>=' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new mayor_igual_1.MayorIgual(linea, expIzq, expDer);
                    }
                    //EXP menor_igual EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '<=' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new menor_igual_1.MenorIgual(linea, expIzq, expDer);
                    }
                    //EXP igual_que EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '==' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new igual_1.Igual(linea, expIzq, expDer);
                    }
                    //EXP dif_que EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '!=' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new diferente_1.Diferente(linea, expIzq, expDer);
                    }
                    //EXP and EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '&&' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new And_1.And(linea, expIzq, expDer);
                    }
                    //EXP or EXP
                    if (this.soyNodo('EXP', nodo.hijos[0]) && nodo.hijos[1] == '||' && this.soyNodo('EXP', nodo.hijos[2])) {
                        const expIzq = this.recorrer(nodo.hijos[0]);
                        const expDer = this.recorrer(nodo.hijos[2]);
                        const linea = nodo.linea;
                        return new Or_1.Or(linea, expIzq, expDer);
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
            return lista_atributos; //[{id, tipo, type_generador?, corchetes?}]
        }
        //DECLARACION_TYPE
        if (this.soyNodo('DECLARACION_TYPE', nodo)) {
            // type id igual llave_izq LISTA_ATRIBUTOS llave_der
            // type id igual llave_izq LISTA_ATRIBUTOS llave_der punto_coma
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
                        const acceso_arreglo_simple = this.recorrer(nodo.hijos[0]);
                        const tipo_igual = this.recorrer(nodo.hijos[1]);
                        const exp = this.recorrer(nodo.hijos[2]);
                        const id = acceso_arreglo_simple.id;
                        const lista_accesos = acceso_arreglo_simple.lista_accesos;
                        return new asignacion_arreglo_1.AsignacionArreglo(nodo.linea, id, lista_accesos, tipo_igual, exp);
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
        //DECLARACION_FUNCION
        if (this.soyNodo('DECLARACION_FUNCION', nodo)) {
            switch (nodo.hijos.length) {
                //function id par_izq par_der llave_izq INSTRUCCIONES llave_der
                case 7: {
                    const id = nodo.hijos[1];
                    const instrucciones = this.recorrer(nodo.hijos[5]);
                    return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones);
                }
                //function id par_izq LISTA_PARAMETROS par_der llave_izq INSTRUCCIONES llave_der
                case 8: {
                    const id = nodo.hijos[1];
                    const lista_parametros = this.recorrer(nodo.hijos[3]);
                    const instrucciones = this.recorrer(nodo.hijos[6]);
                    return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones, 5 /* VOID */, lista_parametros);
                }
                //function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
                case 9: {
                    const id = nodo.hijos[1];
                    // {tipo, type_generador?}
                    const tipo_variable_nativa = this.recorrer(nodo.hijos[5]);
                    const tipo_return = tipo_variable_nativa.tipo;
                    const instrucciones = this.recorrer(nodo.hijos[7]);
                    return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return);
                }
                case 10: {
                    // function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES llave_izq INSTRUCCIONES llave_der
                    if (this.soyNodo('LISTA_CORCHETES', nodo.hijos[6])) {
                        const id = nodo.hijos[1];
                        const tipo_return = 4 /* ARRAY */;
                        const instrucciones = this.recorrer(nodo.hijos[8]);
                        return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return);
                    }
                    //function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
                    else if (this.soyNodo('LISTA_PARAMETROS', nodo.hijos[3])) {
                        const id = nodo.hijos[1];
                        //[Variable ...]
                        const lista_parametros = this.recorrer(nodo.hijos[3]);
                        // {tipo, type_generador?}
                        const tipo_variable_nativa = this.recorrer(nodo.hijos[6]);
                        const tipo_return = tipo_variable_nativa.tipo;
                        const instrucciones = this.recorrer(nodo.hijos[8]);
                        return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return, lista_parametros);
                    }
                }
                // function id par_izq LISTA_PARAMETROS par_der dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES llave_izq INSTRUCCIONES llave_der
                case 11: {
                    const id = nodo.hijos[1];
                    //[Variable ...]
                    const lista_parametros = this.recorrer(nodo.hijos[3]);
                    const tipo_return = 4 /* ARRAY */;
                    const instrucciones = this.recorrer(nodo.hijos[9]);
                    return new declaracion_funcion_1.DeclaracionFuncion(nodo.linea, id, instrucciones, tipo_return, lista_parametros);
                }
            }
        }
        //LLAMADA_FUNCION
        if (this.soyNodo('LLAMADA_FUNCION', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                //id par_izq par_der punto_coma
                case 4:
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id);
                //id par_izq LISTA_EXPRESIONES par_der punto_coma
                case 5:
                    //[EXP ...]
                    const lista_expresiones = this.recorrer(nodo.hijos[2]);
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id, lista_expresiones);
            }
        }
        //LLAMADA_FUNCION_EXP
        if (this.soyNodo('LLAMADA_FUNCION_EXP', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                //id par_izq par_der
                case 3:
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id);
                //id par_izq LISTA_EXPRESIONES par_der
                case 4:
                    //[EXP ...]
                    const lista_expresiones = this.recorrer(nodo.hijos[2]);
                    return new llamada_funcion_1.LlamadaFuncion(nodo.linea, id, lista_expresiones);
            }
        }
        //RETURN
        if (this.soyNodo('RETURN', nodo)) {
            switch (nodo.hijos.length) {
                //return EXP punto_coma
                case 3:
                    const exp = this.recorrer(nodo.hijos[1]);
                    return new return_1.Return(nodo.linea, true, exp);
                //return punto_coma
                case 2:
                    return new return_1.Return(nodo.linea, false);
            }
        }
        //ARRAY_LENGTH
        if (this.soyNodo('ARRAY_LENGTH', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                //id punto length
                case 3:
                    return new array_length_simple_1.ArrayLengthSimple(nodo.linea, id);
                case 4:
                    //id LISTA_ACCESOS_ARREGLO punto length
                    if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo.hijos[1])) {
                        const lista_accesos = this.recorrer(nodo.hijos[1]);
                        return new array_length_accesos_arreglo_1.ArrayLengthAccesosArreglo(nodo.linea, id, lista_accesos);
                    }
                    //id LISTA_ACCESOS_TYPE punto length
                    if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo.hijos[1])) {
                        //[id | [EXP]]
                        const lista_accesos = this.recorrer(nodo.hijos[1]);
                        return new array_length_accesos_type_1.ArrayLengthAccesosType(nodo.linea, id, lista_accesos);
                    }
            }
        }
        //ARRAY_POP
        if (this.soyNodo('ARRAY_POP', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                //id punto pop par_izq par_der
                case 5:
                    return new array_pop_1.ArrayPop(nodo.linea, id);
                case 6:
                    //id LISTA_ACCESOS_ARREGLO punto pop par_izq par_der
                    if (this.soyNodo('LISTA_ACCESOS_ARREGLO', nodo.hijos[1])) {
                        const lista_accesos = this.recorrer(nodo.hijos[1]);
                        return new array_pop_accesos_arreglo_1.ArrayPopAccesosArreglo(nodo.linea, id, lista_accesos);
                    }
                    //id LISTA_ACCESOS_TYPE punto pop par_izq par_der
                    if (this.soyNodo('LISTA_ACCESOS_TYPE', nodo.hijos[1])) {
                        const lista_accesos = this.recorrer(nodo.hijos[1]);
                        return new array_pop_accesos_type_1.ArrayPopAccesosType(nodo.linea, id, lista_accesos);
                    }
            }
        }
        //PUSH_ARREGLO
        if (this.soyNodo('PUSH_ARREGLO', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                // id punto push par_izq EXP par_der punto_coma
                case 7: {
                    const exp = this.recorrer(nodo.hijos[4]);
                    return new push_arreglo_1.PushArreglo(nodo.linea, id, exp);
                }
                // id LISTA_ACCESOS_TYPE punto push par_izq EXP par_der punto_coma
                case 8: {
                    const lista_accesos = this.recorrer(nodo.hijos[1]);
                    const exp = this.recorrer(nodo.hijos[5]);
                    return new push_arreglo_acceso_type_1.PushArregloAccesoType(nodo.linea, id, lista_accesos, exp);
                }
            }
        }
        //BREAK
        if (this.soyNodo('BREAK', nodo)) {
            //break punto_coma
            return new break_1.Break(nodo.linea);
        }
        //CONTINUE
        if (this.soyNodo('CONTINUE', nodo)) {
            //continue punto_coma
            return new continue_1.Continue(nodo.linea);
        }
        //INSTRUCCION_IF
        if (this.soyNodo('INSTRUCCION_IF', nodo)) {
            switch (nodo.hijos.length) {
                //IF
                case 1:
                    const inst = this.recorrer(nodo.hijos[0]);
                    return new instruccion_if_1.InstruccionIf(nodo.linea, [inst]);
                case 2:
                    //IF ELSE
                    if (this.soyNodo('IF', nodo.hijos[0]) && this.soyNodo('ELSE', nodo.hijos[1])) {
                        const inst_if = this.recorrer(nodo.hijos[0]);
                        const inst_else = this.recorrer(nodo.hijos[1]);
                        return new instruccion_if_1.InstruccionIf(nodo.linea, [inst_if, inst_else]);
                    }
                    //IF LISTA_ELSE_IF
                    if (this.soyNodo('IF', nodo.hijos[0]) && this.soyNodo('LISTA_ELSE_IF', nodo.hijos[1])) {
                        const inst_if = this.recorrer(nodo.hijos[0]);
                        const lista_ifs = this.recorrer(nodo.hijos[1]);
                        return new instruccion_if_1.InstruccionIf(nodo.linea, [inst_if, ...lista_ifs]);
                    }
                //IF LISTA_ELSE_IF ELSE
                case 3:
                    const inst_if = this.recorrer(nodo.hijos[0]);
                    const lista_ifs = this.recorrer(nodo.hijos[1]);
                    const inst_else = this.recorrer(nodo.hijos[2]);
                    return new instruccion_if_1.InstruccionIf(nodo.linea, [inst_if, ...lista_ifs, inst_else]);
            }
        }
        //IF
        if (this.soyNodo('IF', nodo)) {
            //if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
            const condicion = this.recorrer(nodo.hijos[2]);
            const instrucciones = this.recorrer(nodo.hijos[5]);
            return new if_1.If(condicion, instrucciones);
        }
        //ELSE
        if (this.soyNodo('ELSE', nodo)) {
            //else llave_izq INSTRUCCIONES llave_der
            const condicion = new nativo_1.Nativo(nodo.linea, true);
            const instrucciones = this.recorrer(nodo.hijos[2]);
            return new if_1.If(condicion, instrucciones);
        }
        //ELSE_IF
        if (this.soyNodo('ELSE_IF', nodo)) {
            //else if par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
            const condicion = this.recorrer(nodo.hijos[3]);
            const instrucciones = this.recorrer(nodo.hijos[6]);
            return new if_1.If(condicion, instrucciones);
        }
        //LISTA_ELSE_IF
        if (this.soyNodo('LISTA_ELSE_IF', nodo)) {
            const lista = [];
            nodo.hijos.forEach((nodoHijo) => {
                const resp = this.recorrer(nodoHijo);
                if (resp instanceof if_1.If) {
                    lista.push(resp);
                }
            });
            return lista;
        }
        //WHILE
        if (this.soyNodo('WHILE', nodo)) {
            //while par_izq EXP par_der llave_izq INSTRUCCIONES llave_der
            const condicion = this.recorrer(nodo.hijos[2]);
            const instrucciones = this.recorrer(nodo.hijos[5]);
            return new while_1.While(nodo.linea, condicion, instrucciones);
        }
        //DO_WHILE
        if (this.soyNodo('DO_WHILE', nodo)) {
            //do llave_izq INSTRUCCIONES llave_der while par_izq EXP par_der punto_coma
            const instrucciones = this.recorrer(nodo.hijos[2]);
            const condicion = this.recorrer(nodo.hijos[6]);
            return new do_while_1.DoWhile(nodo.linea, instrucciones, condicion);
        }
        //ASIGNACION_FOR
        if (this.soyNodo('ASIGNACION_FOR', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                // id TIPO_IGUAL EXP
                case 3:
                    const tipo_igual = this.recorrer(nodo.hijos[1]);
                    const exp = this.recorrer(nodo.hijos[2]);
                    return new asignacion_1.Asignacion(nodo.linea, id, tipo_igual, exp);
                //id mas_mas | id menos_menos
                case 2:
                    if (nodo.hijos[1] == '++')
                        return new mas_mas_1.MasMas(nodo.linea, id);
                    if (nodo.hijos[1] == '--')
                        return new menos_menos_1.MenosMenos(nodo.linea, id);
            }
        }
        //FOR
        if (this.soyNodo('FOR', nodo)) {
            const condicion = this.recorrer(nodo.hijos[3]);
            const asignacion_for = this.recorrer(nodo.hijos[5]);
            const instrucciones = this.recorrer(nodo.hijos[8]);
            //for par_izq DECLARACION_VARIABLE EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der
            if (this.soyNodo('DECLARACION_VARIABLE', nodo.hijos[2])) {
                const lista_instrucciones = this.recorrer(nodo.hijos[2]);
                const declaracion = lista_instrucciones[0];
                return new for_1.For(nodo.linea, declaracion, null, condicion, asignacion_for, instrucciones);
            }
            //for par_izq ASIGNACION EXP punto_coma ASIGNACION_FOR par_der llave_izq INSTRUCCIONES llave_der
            if (this.soyNodo('ASIGNACION', nodo.hijos[2])) {
                const asignacion = this.recorrer(nodo.hijos[2]);
                return new for_1.For(nodo.linea, null, asignacion, condicion, asignacion_for, instrucciones);
            }
        }
        //FOR_OF
        if (this.soyNodo('FOR_OF', nodo)) {
            //for par_izq TIPO_DEC_VARIABLE id of EXP par_der llave_izq INSTRUCCIONES llave_der
            const tipo_declaracion = this.recorrer(nodo.hijos[2]);
            const id = nodo.hijos[3];
            const exp = this.recorrer(nodo.hijos[5]);
            const instrucciones = this.recorrer(nodo.hijos[8]);
            return new for_of_1.ForOf(nodo.linea, tipo_declaracion, id, exp, instrucciones);
        }
        //FOR_IN
        if (this.soyNodo('FOR_IN', nodo)) {
            //for par_izq TIPO_DEC_VARIABLE id in EXP par_der llave_izq INSTRUCCIONES llave_der
            const tipo_declaracion = this.recorrer(nodo.hijos[2]);
            const id = nodo.hijos[3];
            const exp = this.recorrer(nodo.hijos[5]);
            const instrucciones = this.recorrer(nodo.hijos[8]);
            return new for_in_1.ForIn(nodo.linea, tipo_declaracion, id, exp, instrucciones);
        }
        //PARAMETRO
        if (this.soyNodo('PARAMETRO', nodo)) {
            const id = nodo.hijos[0];
            switch (nodo.hijos.length) {
                //id dos_puntos TIPO_VARIABLE_NATIVA
                case 3: {
                    //{tipo, tpe_generador?}
                    const tipo_variable_nativa = this.recorrer(nodo.hijos[2]);
                    const tipo = tipo_variable_nativa.tipo;
                    return new variable_1.Variable({ reasignable: true, id, tipo_asignado: tipo });
                }
                //id dos_puntos TIPO_VARIABLE_NATIVA LISTA_CORCHETES
                case 4: {
                    //{tipo, tpe_generador?}
                    const tipo_variable_nativa = this.recorrer(nodo.hijos[2]);
                    const tipo = tipo_variable_nativa.tipo;
                    const dimensiones = this.recorrer(nodo.hijos[3]);
                    return new variable_1.Variable({ reasignable: true, id, tipo_asignado: 4 /* ARRAY */, dimensiones });
                }
                // id dos_puntos Array menor TIPO_VARIABLE_NATIVA mayor
                case 6: {
                    //{tipo, tpe_generador?}
                    const tipo_variable_nativa = this.recorrer(nodo.hijos[4]);
                    const tipo = tipo_variable_nativa.tipo;
                    return new variable_1.Variable({ reasignable: true, id, tipo_asignado: 4 /* ARRAY */, dimensiones: 1 });
                }
            }
        }
        //LISTA_PARAMETROS
        if (this.soyNodo('LISTA_PARAMETROS', nodo)) {
            const variables = [];
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    const resp = this.recorrer(nodoHijo);
                    if (resp instanceof variable_1.Variable) {
                        variables.push(resp);
                    }
                }
            });
            return variables; //[Variable...]
        }
        //TERNARIO
        if (this.soyNodo('TERNARIO', nodo)) {
            //EXP interrogacion EXP dos_puntos EXP
            const condicion = this.recorrer(nodo.hijos[0]);
            const exp_true = this.recorrer(nodo.hijos[2]);
            const exp_false = this.recorrer(nodo.hijos[4]);
            return new ternario_1.Ternario(nodo.linea, condicion, exp_true, exp_false);
        }
        //SWITCH
        if (this.soyNodo('SWITCH', nodo)) {
            //switch par_izq EXP par_der llave_izq LISTA_CASE llave_der
            const exp = this.recorrer(nodo.hijos[2]);
            const lista_case = this.recorrer(nodo.hijos[5]);
            return new switch_1.Switch(nodo.linea, exp, lista_case);
        }
        //CASE
        if (this.soyNodo('CASE', nodo)) {
            //case EXP dos_puntos INSTRUCCIONES
            const exp = this.recorrer(nodo.hijos[1]);
            const instrucciones = this.recorrer(nodo.hijos[3]);
            return new case_1.Case(exp, instrucciones);
        }
        //DEFAULT
        if (this.soyNodo('DEFAULT', nodo)) {
            //default dos_puntos INSTRUCCIONES
            const instrucciones = this.recorrer(nodo.hijos[2]);
            return new case_1.Case(null, instrucciones, true);
        }
        //LISTA_CASE
        if (this.soyNodo('LISTA_CASE', nodo)) {
            const lista = [];
            nodo.hijos.forEach((nodoHijo) => {
                if (nodoHijo instanceof Object) {
                    const resp = this.recorrer(nodoHijo);
                    if (resp instanceof case_1.Case) {
                        lista.push(resp);
                    }
                }
            });
            return lista; //[Case ...]
        }
        //GRAFICAR_TS
        if (this.soyNodo('GRAFICAR_TS', nodo)) {
            //graficar_ts par_izq par_der punto_coma
            return new graficar_ts_1.GraficarTS(nodo.linea);
        }
        //INCREMENTO_DECREMENTO
        if (this.soyNodo('INCREMENTO_DECREMENTO', nodo)) {
            //id mas_mas punto_coma || id menos_menos punto_coma
            const id = nodo.hijos[0];
            const incremento = nodo.hijos[1] == '++';
            return new incremento_decremento_1.IncrementoDecremento(nodo.linea, id, incremento);
        }
    }
    /**
     * Funcion para determinar si no tengo funciones anidadas
     * @param nodo
     */
    puedoEjecutar(nodo) {
        //S
        if (this.soyNodo('S', nodo)) {
            for (let nodoHijo of nodo.hijos) {
                const resp = this.puedoEjecutar(nodoHijo);
                if (!resp)
                    return false;
            }
        }
        //INSTRUCCIONES
        if (this.soyNodo('INSTRUCCIONES', nodo)) {
            for (let nodoHijo of nodo.hijos) {
                //Ejecuto solo los nodos que sean DECLARACION_FUNCION
                if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                    const res = this.puedoEjecutar(nodoHijo);
                    if (!res)
                        return false;
                }
            }
        }
        //DECLARACION_FUNCION
        if (this.soyNodo('DECLARACION_FUNCION', nodo)) {
            for (let nodoHijo of nodo.hijos) {
                //Si es el nodo INSTRUCCIONES
                if (this.soyNodo('INSTRUCCIONES', nodoHijo)) {
                    for (let nodoInst of nodoHijo.hijos) {
                        if (this.soyNodo('DECLARACION_FUNCION', nodoInst)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
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
