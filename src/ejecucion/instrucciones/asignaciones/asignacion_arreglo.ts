import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Arreglo } from "../../arreglo";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { getTipo, TIPO_DATO } from "../../tipo";
import * as _ from 'lodash';

export class AsignacionArreglo extends Instruccion {
  linea: string;
  id: string;
  lista_accesos: Array<Instruccion>;
  tipo_igual: string;
  exp: Instruccion;

  constructor(linea: string, id: string, lista_accesos: Array<Instruccion>, tipo_igual: string, exp: Instruccion) {
    super(linea);
    Object.assign(this, { id, lista_accesos, tipo_igual, exp });
  }

  ejecutar(e: Entorno) {
    //Busqueda en el entorno
    const variable = e.getVariable(this.id);
    if (!variable) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se encontro la varaible con id ${this.id}` }));
      return;
    }

    let res = variable.getValor();
    let valor_a_asignar = this.exp.ejecutar(e);
    valor_a_asignar = _.cloneDeep(valor_a_asignar);

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

      if (res instanceof Arreglo) {
        //Reviso si el arreglo tiene el indice que buscamos
        if (!res.hasIndex(index)) {
          /**
           * Comente esta seccion porque si el arreglo no tiene el indice le debo asignar el valor
           * de igual forma segun los requerimientos del lenguaje
           */

          // Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `El arreglo no tiene un indice ${index}` }));
          // return;
        }
        //Si ya es el ultimo acceso
        if (i == this.lista_accesos.length - 1) {
          if(this.tipo_igual == '='){
            res.setValue(index, valor_a_asignar);
          }
          else {
            const nuevo_valor = this.tipo_igual == '+=' ? res.getValue(index) + valor_a_asignar : res.getValue(index) - valor_a_asignar;
            res.setValue(index, nuevo_valor);
          }
        }
        //Si aun no es el ultimo acceso
        else {
          res = res.getValue(index);
        }
      }
    }

  }

}
