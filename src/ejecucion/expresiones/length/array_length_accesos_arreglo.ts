import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class ArrayLengthAccesosArreglo extends Instruccion{
  id: string;
  lista_accesos: Array<Instruccion>;

  constructor(linea: string, id: string, lista_accesos: Array<Instruccion>){
    super(linea);
    Object.assign(this, {id, lista_accesos});
  }

  ejecutar(e: Entorno) {
    const variable = e.getVariable(this.id);
    //Si no se encontro la variable
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}`}));
      return;
    }
    //Si no es un array
    if(!variable.isArray()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede obtener la longitud de la variable ${this.id} porque no es un arreglo`}));
      return;
    }
    //Realizo los accesos al arreglo de forma recursiva
    let arreglo = variable.getValor() as Arreglo;
    for(let instruccion of this.lista_accesos){
      const index = instruccion.ejecutar(e);
      //Validacion de index
      if(index == null || typeof index != 'number'){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al index ${index} en ${this.id}`}));
        return;
      }
      //Validacion de arreglo
      if(!(arreglo instanceof Arreglo)){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al length de un arreglo`}));
        return;
      }
      //Arreglo debe tener el indice
      if(!arreglo.hasIndex(index)){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}`}));
        return;
      }
      arreglo = arreglo.getValue(index);
    }

    if(arreglo == null || !(arreglo instanceof Arreglo)){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al length de un arreglo`}));
      return;
    }

    return arreglo.getSize();
  }

}
