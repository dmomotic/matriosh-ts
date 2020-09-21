import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Type } from "../../type";

export class PushArregloAccesoType extends Instruccion {
  id: string;
  lista_accesos: Array<String | Array<Instruccion>>;
  exp: Instruccion;

  constructor(linea: string, id: string, lista_accesos: Array<String | Array<Instruccion>>, exp: Instruccion) {
    super(linea);
    Object.assign(this, { id, lista_accesos, exp });
  }

  ejecutar(e: Entorno) {
    //Validacion de variable existente
    const variable = e.getVariable(this.id);
    if (!variable) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la variable ${this.id}` }));
      return;
    }
    //Validacion de type
    if (!variable.isType()) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `La varaible ${this.id} no es de tipo Type` }));
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
        const aux_variable = actual.getAtributo(acceso);
        actual = aux_variable.getValor();
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
            Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede ejecutar push() en un arreglo` }));
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

    //Valido que el valor actual obtenido, sea un Arreglo para poder realizar el push
    if(!(actual instanceof Arreglo)){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Solo se puede ejecutar push() en un arreglo verificar: ${this.id}`}));
      return;
    }

    //Insertamos el dato
    const valor = this.exp.ejecutar(e);
    actual.push(valor);
  }
}
