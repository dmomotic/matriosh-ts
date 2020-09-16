import { Arreglo } from "./arreglo";
import { Type } from "./type";

export const enum TIPO {
  NATIVO,
  ARRAY,
  TYPE
}

export const enum TIPO_DATO {
  STRING, NUMBER, BOOLEAN, TYPE, ARRAY, VOID
}

export function getTipo(valor: any): TIPO_DATO {
  if (typeof valor == 'string') return TIPO_DATO.STRING;
  if (typeof valor == 'number') return TIPO_DATO.NUMBER;
  if (typeof valor == 'boolean') return TIPO_DATO.BOOLEAN;
  if (valor instanceof Type) return TIPO_DATO.TYPE;
  if (valor instanceof Arreglo) return TIPO_DATO.ARRAY;
  if (valor == null) return null;
  return null;
}
