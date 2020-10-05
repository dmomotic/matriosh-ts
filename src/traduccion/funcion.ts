export class Funcion {
  id: string;
  idNuevo: string;

  constructor({ id }: { id: string }) {
    Object.assign(this, { id });
  }

  setIdNuevo(nuevo: string): void {
    this.idNuevo = nuevo;
  }

  getIdNuevo(): string {
    return this.idNuevo != null && this.idNuevo.trim() !== '' ? this.idNuevo : this.id;
  }
}
