import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { getTipo, TIPO_DATO } from "../../tipo";
import { Variable } from "../../variable";
import * as _ from 'lodash';
import { Return } from "../../return";
import { Break } from "../../break";
import { Continue } from "../../continue";

export class ForIn extends Instruccion{
  tipo_declaracion: string;
  id: string;
  exp: Instruccion;
  instrucciones: Array<Instruccion>;

  constructor(linea: string, tipo_declaracion: string, id: string, exp: Instruccion, instrucciones: Array<Instruccion>){
    super(linea);
    Object.assign(this, {tipo_declaracion, id, exp, instrucciones});
  }

  ejecutar(e: Entorno) {
    const arreglo = this.exp.ejecutar(e);
    //Verifico que sea una instancia de Arreglo lo que voy a iterar
    if(!(arreglo instanceof Arreglo)){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `El for in debe ser ejecutado sobre un tipo Arreglo y esta siendo ejecutado sobre un tipo ${getTipo(arreglo)}`}));
      return;
    }
    for(let actual in arreglo.arreglo){
      //Entorno generado por cada iteracion
      const entorno = new Entorno(e);
      let variable = new Variable({reasignable: false, id: this.id, tipo_asignado: TIPO_DATO.NUMBER, valor: _.toNumber(actual)});

      //Inserto la variable en mi nuevo entorno de ejecucion
      entorno.setVariable(variable);

      //Ejecuto las instruccion
      for(let instruccion of this.instrucciones){
        const resp = instruccion.ejecutar(entorno);
        //Validacion de instruccion Return
        if(resp instanceof Return){
          return resp;
        }
        //Validacion de instrucion Break
        if(resp instanceof Break){
          return;
        }
        //Validacion instruccion Continue
        if(resp instanceof Continue){
          break;
        }
      }
    }
  }

}
