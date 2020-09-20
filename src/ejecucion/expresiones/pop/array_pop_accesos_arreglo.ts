import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";

export class ArrayPopAccesosArreglo extends Instruccion{
  id: string;
  lista_accesos: Array<Instruccion>;

  constructor(linea: string, id: string, lista_accesos: Array<Instruccion>){
    super(linea);
    Object.assign(this, {id, lista_accesos});
  }

  ejecutar(e: Entorno) {
    const variable = e.getVariable(this.id);
    //Validacion variable
    if(!variable){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}`}));
      return;
    }
    //Si la variable no es un arreglo
    if(!variable.isArray()){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede ejecutar la funcion pop() porque la variable ${this.id} no es de tipo Arreglo`}));
      return;
    }

    //Realizo los accesos al arreglo
    let arreglo = variable.getValor();
    for(let exp of this.lista_accesos){
      const index = exp.ejecutar(e);
      //Validacion de index
      if(index == null || typeof index != 'number'){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al index ${index} en ${this.id}`}));
        return;
      }
      //Validacion de arreglo
      if(!(arreglo instanceof Arreglo)){
        Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede ejecutar pop() en un arreglo`}));
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
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede ejecutar pop() en un arreglo`}));
      return;
    }

    return arreglo.pop();
  }

}
