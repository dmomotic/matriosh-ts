export class Error {
  tipo: string;
  linea: string;
  descripcion: string;

  constructor({ tipo, linea, descripcion }: { tipo: string, linea: string, descripcion: string }) {
    Object.assign(this, {tipo, linea, descripcion})
  }
}
