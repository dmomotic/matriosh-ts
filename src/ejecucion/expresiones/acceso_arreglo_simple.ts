import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Arreglo } from "../arreglo";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { getTipo, TIPO_DATO } from "../tipo";

export class AccesoArregloSimple extends Instruccion {

  id: string;
  lista_accesos: Array<Instruccion>;

  constructor(linea: string, id: string, lista_accesos: Array<Instruccion>) {
    super(linea);
    Object.assign(this, { id, lista_accesos });
  }

  ejecutar(e: Entorno) {
    //Busqueda de variable en la tabla de simbolos
    const variable = e.getVariable(this.id);

    //Si no se encontro la variable
    if (!variable) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro ninguna variable con el id ${this.id} en este entorno` }));;
      return;
    }

    let res = variable.getValor();

    //Si la variable no es de tipo Array
    if (getTipo(res) != TIPO_DATO.ARRAY) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `La variable con id ${this.id} no a sido asignada con un valor de tipo Array` }));;
      return;
    }

    for (let i = 0; i < this.lista_accesos.length; i++) {
      const index = this.lista_accesos[i].ejecutar(e);
      //Validacion de indice
      if (index == null || typeof index != 'number') {
        Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `${index} no es un indice valido` }));;
        return;
      }
      //Si ya es el ultimo acceso
      if (i == this.lista_accesos.length - 1) {
        if (res instanceof Arreglo) {
          //Reviso si el arreglo tiene el indice que buscamos
          if (!res.hasIndex(index)) {
            Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
            return;
          }
          return res.getValue(index);
        }
        //TODO: el else creo que es error
      }
      //Si aun no es el ultimo acceso
      else {
        if (res instanceof Arreglo) {
          //Reviso si el arreglo tiene el indice que buscamos
          if (!res.hasIndex(index)) {
            Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
            return;
          }
          res = res.getValue(index);
        }
        //TODO: el else creo que es error
      }
    }
  }

}
