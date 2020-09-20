import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Type } from "../../type";

export class ArrayLengthAccesosType extends Instruccion {
  id: string;
  lista_accesos: Array<String | Array<Instruccion>>;

  constructor(linea: string, id: string, lista_accesos: Array<String | Array<Instruccion>>) {
    super(linea);
    Object.assign(this, { id, lista_accesos });
  }

  ejecutar(e: Entorno) {
    //Busqueda y validaciones de variable
    const variable = e.getVariable(this.id);
    if (!variable) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
      return;
    }
    //Si no es un type
    if (!variable.isType()) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `La variable ${this.id} no es de tipo Type` }));
      return;
    }

    let actual = variable.getValor();
    //Realizo los accesos al type
    for (let acceso of this.lista_accesos) {
      //Si es un acceso a un atributo
      if (typeof acceso == 'string') {
        //El valor actual debe ser un type
        if (!(actual instanceof Type)) {
          Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al atributo ${acceso} porque no es un type` }));
          return;
        }
        //Si es un type verifico que exista la propiedad
        if (!actual.hasAtributo(acceso)) {
          Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la propiedad ${acceso} en ${actual}` }));
          return;
        }
        const variable = actual.getAtributo(acceso);
        actual = variable.getValor();
      }
      //Si es un acceso de un arreglo
      else if (acceso instanceof Array) {
        //Realizo el acceso
        for (let exp of acceso) {
          const index = exp.ejecutar(e);
          //Validacion de index
          if (index == null || typeof index != 'number') {
            Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede acceder al index ${index} en ${this.id}` }));
            return;
          }
          //Validacion de arreglo
          if (!(actual instanceof Arreglo)) {
            Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al length de un arreglo` }));
            return;
          }
          //Arreglo debe tener el indice
          if (!actual.hasIndex(index)) {
            Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
            return;
          }
          actual = actual.getValue(index);
        }
      }
    }
    if(!(actual instanceof Arreglo)){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede acceder al atributo length en un arreglo verificar: ${this.id}`}));
      return;
    }

    return actual.getSize();
  }

}
