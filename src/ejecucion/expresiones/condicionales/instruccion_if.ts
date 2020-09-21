import { Break } from "../../break";
import { Continue } from "../../continue";
import { Entorno } from "../../entorno";
import { If } from "../../if";
import { Instruccion } from "../../instruccion";
import { Return } from "../../return";

export class InstruccionIf extends Instruccion{
  lista_ifs: Array<If>;

  constructor(linea: string, lista_ifs: Array<If>){
    super(linea);
    Object.assign(this, {lista_ifs});
  }

  ejecutar(e: Entorno) {
    for(let inst_if of this.lista_ifs){
      const condicion = inst_if.condicion;
      const instrucciones = inst_if.instrucciones;

      //Si la condicion es verdadera
      if(condicion.ejecutar(e)){
        //Entorno generado por el if
        const entorno = new Entorno(e);
        //Ejecuto las instrucciones
        for(let instruccion of instrucciones){
          const resp = instruccion.ejecutar(entorno);
          //Validacion de sentencias Break, Continue o Return
          if(resp instanceof Break || resp instanceof Continue || resp instanceof Return ){
            return resp;
          }
        }
        //Finalizo la ejecucion de la instruccion if
        return;
      }
    }
  }

}
