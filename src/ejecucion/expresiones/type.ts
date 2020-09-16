import { Error } from "../../arbol/error";
import { Errores } from "../../arbol/errores";
import { Entorno } from "../entorno";
import { Instruccion } from "../instruccion";
import { Variable } from "../variable";
import { Type as InstanciaType } from '../type';

export class Type extends Instruccion{

  lista_atributos: Array<Object>; //[{id, exp}]

  constructor(linea: string, lista_atributos: Array<Object>){
    super(linea);
    Object.assign(this, {lista_atributos});
  }

  ejecutar(e: Entorno) {
    const entorno = new Entorno();
    this.lista_atributos.forEach((atributo : Object) => {
      //Validación objeto
      const id = atributo['id'];
      const exp = atributo['exp'];
      if(id && exp){
        //Validacion de id unico
        let variable = entorno.getVariable(id);
        const reasignable = true;
        if(variable){
          Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `El id: ${id} esta repetido en el type`}));
          return;
        }

        //Si se puede asignar
        const valor = (exp as Instruccion).ejecutar(e);
        variable = new Variable({reasignable, id, valor});
        entorno.setVariable(variable);
      }
    });
    return new InstanciaType(null,entorno.variables);
  }

}
