export class Error {
  tipo: string;
  linea: string;
  descripcion: string;

  constructor({ tipo, linea, descripcion }: { tipo: string, linea: string, descripcion: string }) {
    const valor = +linea + 1;
    Object.assign(this, {tipo, linea: valor.toString(), descripcion})
  }
}
