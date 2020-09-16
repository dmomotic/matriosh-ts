export class Arreglo{
  arreglo: Array<any>;

  constructor(arreglo: Array<any>){
    this.arreglo = arreglo;
  }

  isInitialized() : boolean{
    return this.arreglo != null;
  }

  getSize() : number {
    return this.arreglo.length;
  }

  hasIndex(index : number) : boolean{
    return this.isInitialized() && index < this.getSize();
  }

  getValue(index : number){
    return this.arreglo[index];
  }

  public toString() : string{
    let salida = '';
    const size = this.arreglo.length;
    this.arreglo.forEach((item : any, index : number) => {
      if(item != null) salida+= item.toString();
      else salida += "null";
      if(index != size - 1) salida += ', ';
    })
    return salida;
  }



}
