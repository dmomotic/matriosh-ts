import { TIPOS } from './tipos';

export class Variable {
  id: string;
  tipo: TIPOS;
  reasignable: boolean;
  idNuevo: string;

  constructor({ id, tipo = TIPOS.SIN_ASIGNAR, reasignable = false }: { id: string, tipo?: TIPOS, reasignable?: boolean }) {
    Object.assign(this, { id, tipo, reasignable, idnuevo: id });
  }

  getTipo(): TIPOS {
    return this.tipo;
  }

  setTipo(tipo: TIPOS) : void {
    this.tipo = tipo;
  }

  isReasignable(): boolean {
    return this.reasignable;
  }

  setIdNuevo(nuevo : string): void{
    this.idNuevo = nuevo;
  }
}
