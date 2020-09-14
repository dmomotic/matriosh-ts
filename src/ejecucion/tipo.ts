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
  //TODO: Terminar para los demas tipos
  return null;
}
