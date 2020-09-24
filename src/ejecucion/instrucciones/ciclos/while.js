"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const break_1 = require("../../break");
const continue_1 = require("../../continue");
const entorno_1 = require("../../entorno");
const instruccion_1 = require("../../instruccion");
const return_1 = require("../../return");
class While extends instruccion_1.Instruccion {
    constructor(linea, condicion, instrucciones) {
        super(linea);
        Object.assign(this, { condicion, instrucciones });
    }
    ejecutar(e) {
        while (this.condicion.ejecutar(e)) {
            //Creacion del entorno generado por el while
            const entorno = new entorno_1.Entorno(e);
            //Ejecuto las instrucciones
            for (let instruccion of this.instrucciones) {
                const resp = instruccion.ejecutar(entorno);
                ///Validacion de instruccion Return
                if (resp instanceof return_1.Return) {
                    return resp;
                }
                //Validacion de instrucion Break
                if (resp instanceof break_1.Break) {
                    return;
                }
                //Validacion de instruccion Continue
                if (resp instanceof continue_1.Continue) {
                    break;
                }
            }
        }
    }
}
exports.While = While;
