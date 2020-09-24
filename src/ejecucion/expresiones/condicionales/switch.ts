import { Break } from "../../break";
import { Case } from "../../case";
import { Continue } from "../../continue";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Return } from "../../return";

export class Switch extends Instruccion{
  exp: Instruccion;
  lista_case: Array<Case>;

  constructor(linea: string, exp: Instruccion, lista_case: Array<Case>){
    super(linea);
    Object.assign(this, {exp, lista_case});
  }

  ejecutar(e: Entorno) {
    const valor = this.exp.ejecutar(e);
    for(let case_instance of this.lista_case){
      //Si es un case con expresion
      if(case_instance.exp){
        //Evaluo la condicion del case
        const value = case_instance.exp.ejecutar(e);
        //Si no son iguales paso al siguiente case
        if(valor != value) continue;
      }

      //Si los valores son iguales ejecuto las instrucciones
      const entorno = new Entorno(e);
      for(let instruccion of case_instance.instrucciones){
        const resp = instruccion.ejecutar(entorno);
        //Validacion de instruccion Break
        if(resp instanceof Break ){
          return;
        }
        if(resp instanceof Return || resp instanceof Continue){
          return resp;
        }
      }

      //Si ejecute un default ya no debo continuar
      if(case_instance.isDefault()) return;
    }
  }
}
