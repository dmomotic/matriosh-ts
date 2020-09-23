import { Instruccion } from "./instruccion";
import { TIPO_DATO } from "./tipo";
import { Variable } from "./variable";

export class Funcion{
  id: string;
  instrucciones: Array<Instruccion>;
  tipo_return: TIPO_DATO;
  lista_parametros: Array<Variable>;

  constructor(id: string, instrucciones: Array<Instruccion>, tipo_return: TIPO_DATO = TIPO_DATO.VOID, lista_parametros: Array<Variable> = null){
    Object.assign(this, {id, instrucciones, tipo_return, lista_parametros});
  }

  hasReturn() : boolean{
    return this.tipo_return != TIPO_DATO.VOID;
  }

  hasParametros() : boolean{
    return this.lista_parametros != null;
  }

  getParametrosSize() : number{
    return this.hasParametros() ? this.lista_parametros.length : 0;
  }
}
