import { Break } from "../../break";
import { Continue } from "../../continue";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Return } from "../../return";
import * as _ from 'lodash';

export class While extends Instruccion{
  condicion: Instruccion;
  instrucciones: Array<Instruccion>;

  constructor(linea: string, condicion: Instruccion, instrucciones: Array<Instruccion>){
    super(linea);
    Object.assign(this, {condicion, instrucciones});
  }

  ejecutar(e: Entorno) {
    while(this.condicion.ejecutar(e)){
      //Creacion del entorno generado por el while
      const entorno = new Entorno(e);
      //Ejecuto las instrucciones
      for(let instruccion of this.instrucciones){
        const resp = instruccion.ejecutar(entorno);
        ///Validacion de instruccion Return
        if(resp instanceof Return){
          return resp;
        }
        //Validacion de instrucion Break
        if(resp instanceof Break){
          return;
        }
        //Validacion de instruccion Continue
        if(resp instanceof Continue){
          break;
        }
      }
    }
  }

}
