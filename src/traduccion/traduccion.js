"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Traduccion = void 0;
const entorno_1 = require("./entorno");
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
        let entorno = new entorno_1.Entorno();
        this.recorrer(this.raiz, entorno);
        return this.codigo;
    }
    recorrer(nodo, e) {
        //S
        if (this.soyNodo('S', nodo)) {
            nodo.hijos.forEach((nodoHijo) => {
                this.recorrer(nodoHijo, e);
            });
        }
        //INSTRUCCIONES
        else if (this.soyNodo('INSTRUCCIONES', nodo)) {
            nodo.hijos.forEach((nodoHijo) => {
                this.recorrer(nodoHijo, e);
            });
        }
        //DECLARACION_FUNCION
        else if (this.soyNodo('DECLARACION_FUNCION', nodo)) {
            switch (nodo.hijos.length) {
                // function id par_izq par_der dos_puntos TIPO_VARIABLE_NATIVA llave_izq INSTRUCCIONES llave_der
                case 9:
                    // function test() : TIPO { INSTRUCCIONES }
                    const id = nodo.hijos[1];
                    const tipo = this.recorrer(nodo.hijos[5], e);
                    //TODO: agregarla a la TS y hacer verificacion de errores
                    this.codigo += `${nodo.hijos[0]} ${id}() : ${tipo} {\n`;
                    //Si no tiene funciones anidadas
                    if (!this.tengoFuncionAnidada(nodo.hijos[7])) {
                        this.recorrer(nodo.hijos[7], new entorno_1.Entorno(e));
                        this.codigo += `}\n`;
                    }
                    //Si tiene funcion anidada
                    else {
                        //Realizo el primer recorrido para todas las instrucciones distintas de DECLARACION_FUNCION
                        const entorno = new entorno_1.Entorno(e, id);
                        nodo.hijos[7].hijos.forEach((nodoHijo) => {
                            if (!this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                this.recorrer(nodoHijo, entorno);
                            }
                        });
                        this.codigo += `}\n`;
                        //Realizo el recorrido para las funciones anidadas
                        nodo.hijos[7].hijos.forEach((nodoHijo) => {
                            if (this.soyNodo('DECLARACION_FUNCION', nodoHijo)) {
                                this.recorrer(nodoHijo, entorno);
                            }
                        });
                    }
                    break;
            }
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
            switch (nodo.hijos.length) {
                //TIPO_DEC_VARIABLE LISTA_DECLARACIONES punto_coma
                case 3:
                    const tipo_let_const = this.recorrer(nodo.hijos[0], e);
                    const reasignable = tipo_let_const == 'const' ? false : true;
                    this.codigo += `${tipo_let_const} `;
                    // {id, tipo, corchetes, exp}
                    const declaraciones = this.recorrer(nodo.hijos[1], e);
                    declaraciones.forEach((declaracion, index) => {
                        const id = declaracion['id'];
                        //{id}
                        if (declaracion['id'] && !declaracion['tipo'] && !declaracion['corchetes'] && !declaracion['exp']) {
                            const tipo = 4 /* SIN_ASIGNAR */;
                            const variable = new variable_1.Variable({ id, tipo, reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            this.codigo += `${variable.getIdNuevo()}`;
                        }
                        //{id, tipo}
                        if (declaracion['id'] && declaracion['tipo'] && !declaracion['corchetes'] && !declaracion['exp']) {
                            const tipo = declaracion['tipo'];
                            const variable = new variable_1.Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            this.codigo += `${variable.getIdNuevo()} : ${tipo}`;
                        }
                        //{id, exp}
                        if (declaracion['id'] && declaracion['exp'] && !declaracion['tipo'] && !declaracion['corchetes']) {
                            //TODO: ASIGNAR EL TIPO BASADO EN LA EXPRESION
                            const tipo = 4 /* SIN_ASIGNAR */;
                            const variable = new variable_1.Variable({ id, tipo, reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            this.codigo += `${variable.getIdNuevo()} = ${declaracion['exp']}`;
                        }
                        //{id, tipo, exp}
                        if (declaracion['id'] && declaracion['tipo'] && declaracion['exp'] && !declaracion['corchetes']) {
                            const tipo = declaracion['tipo'];
                            //TODO: Validar que el tipo asignado y el tipo de la exp sean iguales
                            const variable = new variable_1.Variable({ id, tipo: this.getTipo(tipo, e), reasignable });
                            //Si estoy en en entorno generado por una funcion
                            if (e.generadoPorFuncion()) {
                                variable.setIdNuevo(this.getIdNuevo(e, id));
                            }
                            e.setVariable(variable);
                            this.codigo += `${variable.getIdNuevo()} : ${tipo} = ${declaracion['exp']}`;
                        }
                        //{id, tipo, corchetes}
                        //{id, tipo, corchetes, exp}
                        //Si no soy el ultimo agrego una coma
                        if (index < declaraciones.length - 1)
                            this.codigo += ', ';
                        //Si soy el ultimo agrego el punto y coma correspondiente
                        else
                            this.codigo += ';\n';
                    });
                    break;
            }
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
            }
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
        return null;
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
