import { Entorno } from './entorno';
import { Variable } from './variable';
import { TIPOS } from './tipos';

export class Traduccion {
  raiz: Object;
  codigo: string;
  contador: number;
  dot: string;

  constructor(raiz: Object) {
    this.raiz = raiz;
    this.codigo = '';
    this.contador = 0;
    this.dot = '';
  }

  getDot(): string {
    this.contador = 0;
    this.dot = "digraph G {\n";
    if (this.raiz != null) {
      this.generacionDot(this.raiz);
    }
    this.dot += "\n}";
    return this.dot;
  }

  generacionDot(nodo: any): void {
    if (nodo instanceof Object) {
      let idPadre = this.contador;
      this.dot += `node${idPadre}[label="${nodo.label}"];\n`;
      if (nodo.hasOwnProperty("hijos")) {
        nodo.hijos.forEach((nodoHijo: any) => {
          let idHijo = ++this.contador;
          this.dot += `node${idPadre} -> node${idHijo};\n`;
          if (nodoHijo instanceof Object) {
            this.generacionDot(nodoHijo);
          } else {
            this.dot += `node${idHijo}[label="${nodoHijo}"];`;
          }
        });
      }
    }
  }

  traducir(): string {
    this.codigo = '';
    return this.codigo;
  }

  recorrer(nodo: any, e: Entorno): void {
    if (this.nodoActual('S', nodo)) {
      nodo.hijos.forEach((item: object) => {
        this.recorrer(item, e);
      });
    }

    if (this.nodoActual('INSTRUCCIONES', nodo)) {
      nodo.hijos.forEach((item: object) => {
        this.recorrer(item, e);
      });
    }

    if (this.nodoActual('DECLARACION_VARIABLE', nodo)) {
      switch (nodo.hijos.length) {
        case 3:
          //TIPO_DEC_VARIABLE id punto_coma
          const tipo = this.getValorDeNodo(nodo.hijos[0]);
          const id = nodo.hijos[1];
          const reasignable = tipo === 'let' ? true : false;
          //Si fue declarada dentro de una funcion
          if(e.generadoPorFuncion()){

          }
          //Si no fue declarada dentro de una funcion
          {
            e.setVariable(new Variable({id: id, tipo: TIPOS.SIN_ASIGNAR, reasignable: reasignable }));
          }
          break;
      }
    }
  }

  nodoActual(label: string, nodo: any): boolean {
    if (nodo == null || !(nodo instanceof Object)) {
      return false;
    }
    if (nodo.hasOwnProperty('label') && nodo.label != null) {
      return nodo.label === label;
    }
    return false;
  }

  getValorDeNodo(nodo: any): string {
    if (nodo == null || !(nodo instanceof Object)) return '';
    if (nodo.hasOwnProperty('hijos') && nodo.hijos instanceof Array && nodo.hijos[0] != null) return nodo.hijos[0];
    return '';
  }
}
