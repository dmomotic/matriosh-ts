import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";

export class AccesoType extends Instruccion{
  linea: string;
  id: string;
  lista_accesos: Array<string|Instruccion>;

  constructor(linea: string, id: string, lista_accesos: Array<string|Instruccion>){
    super(linea);
    Object.assign(this, {id, lista_accesos});
  }

  ejecutar(e: Entorno) {
    //Busqueda de variable en el entorno
    const variable = e.getVariable(this.id);
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se encontro ninguna variable con el id ${this.id}`}));
    }
  }

}
