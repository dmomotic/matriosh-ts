import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { getTipo } from "../../tipo";
import * as _ from 'lodash';

export class Asignacion extends Instruccion {
  id: string;
  tipo_igual: string;
  exp: Instruccion;

  constructor(linea: string, id: string, tipo_igual: string, exp: Instruccion) {
    super(linea);
    Object.assign(this, { id, tipo_igual, exp });
  }

  ejecutar(e: Entorno) {
    //Busqueda de id
    const variable = e.getVariable(this.id);
    if (!variable) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No fue posible encontrar la variable ${this.id}, para realizar la asignación` }));
      return;
    }
    //Si no es reasignable
    if (!variable.isReasignable()) {
      Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede volver a asignar la variable ${this.id}` }));
      return;
    }

    let valor = this.exp.ejecutar(e);
    valor = _.cloneDeep(valor);

    //Si no tiene tipo asignado le asigno lo que venga
    if (!variable.hasTipoAsignado()) {
      if(valor != null){
        variable.tipo_asignado = getTipo(valor);
      }
    }
    //Si tiene tipo asignado
    else {
      //Validación de tipos
      if (variable.tipo_asignado != getTipo(valor) && valor != null) {
        Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo de dato diferente a la variable ${this.id}` }));
        return;
      }
    }

    if(this.tipo_igual == '='){
      variable.valor = valor;
    }
    else {
      const res = this.tipo_igual == '+=' ? variable.getValor() + valor : variable.getValor() - valor;
      if(res == null){
        Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `La operacion de datos ${this.tipo_igual} no puede ser null` }));
        return;
      }
      if(typeof res != 'number' && typeof res != 'string'){
        Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `El resultado de la operacion ${this.tipo_igual} no es un tipo de dato valido ${getTipo(res)}` }));
        return;
      }
      if(variable.hasTipoAsignado() && variable.tipo_asignado != getTipo(res)){
        Errores.getInstance().push(new Error({ tipo: 'semantico', linea: this.linea, descripcion: `No se puede asignar un tipo de dato diferente a la variable ${this.id}` }));
        return;
      }
      variable.valor = res;
    }

  }

}
