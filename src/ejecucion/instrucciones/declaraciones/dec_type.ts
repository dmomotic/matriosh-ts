import { Error } from "../../../arbol/error";
import { Errores } from "../../../arbol/errores";
import { Entorno } from "../../entorno";
import { Instruccion } from "../../instruccion";
import { Type } from "../../type";
import { Variable } from "../../variable";

export class DecType extends Instruccion{
  id: string;
  // cada atributo = {id, tipo, type_generador?, corchetes?}
  lista_atributos: Array<Object>;

  constructor(linea: string, id: string, lista_atributos: Array<Object>){
    super(linea);
    Object.assign(this, {id, lista_atributos});
  }

  ejecutar(e: Entorno) {
    //Verifico que no exista
    const type = e.getType(this.id);
    if(type){
      Errores.getInstance().push(new Error({tipo: 'semantico', linea: this.linea, descripcion: `Ya existe un type con el nombre ${this.id} registrado en este entorno`}));
      return ;
    }
    //Si aun no existe creo el entorno que va a contener y asigno los valores por defecto de sus atributos
    const atributos = new Entorno();
    this.lista_atributos.forEach((atributo : Object) => {
      const id = atributo['id'];
      const tipo_asignado = atributo['tipo'];
      const type_generador = atributo['type_generador'];
      const dimensiones = atributo['corchetes'];

      //Valores comunnes
      const reasignable = true;

      // {id, tipo}
      if(id && tipo_asignado != null && !type_generador && !dimensiones){
        const atributo = new Variable({reasignable,id,tipo_asignado});
        atributos.setVariable(atributo);
      }
      // {id, tipo, type_generador}
      if(id && tipo_asignado != null && type_generador && !dimensiones){
        const atributo = new Variable({reasignable, id, tipo_asignado, type_generador});
        atributos.setVariable(atributo);
      }
      // {id, tipo, dimensiones}
      if(id && tipo_asignado != null && !type_generador && dimensiones){
        const atributo = new Variable({reasignable, id, tipo_asignado, dimensiones});
        atributos.setVariable(atributo);
      }
      // {id, tipo, type_generador, dimensiones}
      if(id && tipo_asignado != null && type_generador && dimensiones){
        const atributo = new Variable({reasignable, id, tipo_asignado, type_generador, dimensiones})
        atributos.setVariable(atributo);
      }
    });
    e.setType(new Type(this.id, atributos.variables));
  }

}
