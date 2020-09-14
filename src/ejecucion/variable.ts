import { TIPO, TIPO_DATO } from './tipo';

export class Variable {
  id: string;
  tipo_asignado: TIPO_DATO;
  valor: any;
  reasignable: boolean;
  dimensiones: number;
  type_generador: string;

  constructor({ reasignable, id, tipo_asignado = null, valor = null, dimensiones = 0, type_generador = null}: { reasignable: boolean, id: string, tipo_asignado?: TIPO_DATO, valor?: any, dimensiones?: number, type_generador?: string}) {
    Object.assign(this, { id, tipo_asignado, valor, reasignable, dimensiones, type_generador });
  }

  isArray(): boolean {
    return this.dimensiones > 0;
  }

  isType(): boolean {
    return this.tipo_asignado == TIPO_DATO.TYPE && !this.isArray() && this.type_generador != null;
  }

  isReasignable(): boolean {
    return this.reasignable;
  }

  getValor() : any {
    return this.valor;
  }

}
