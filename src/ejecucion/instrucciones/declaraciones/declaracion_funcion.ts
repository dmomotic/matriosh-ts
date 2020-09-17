import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Funcion } from "../../funcion";
import { Instruccion } from "../../instruccion";

export class DeclaracionFuncion extends Instruccion{

  linea: string;
  id: string;
  instrucciones: Array<Instruccion>;

  constructor(linea: string, id: string, instrucciones: Array<Instruccion>){
    super(linea);
    Object.assign(this, {id, instrucciones});
  }

  ejecutar(e: Entorno) {
    const funcion = e.getFuncion(this.id);
    //Validación de funcion con nombre unico en el entorno
    if(funcion){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Ya existe una funcion con el nombre ${this.id} en este ambito`}));
      return;
    }

    e.setFuncion(new Funcion(this.id, this.instrucciones));
  }

}
