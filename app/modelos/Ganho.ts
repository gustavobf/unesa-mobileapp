export class Ganho {
  data: Date;
  valor: number;

  constructor(
    data: Date,
    valor: number
  ) {
    this.data = data;
    this.valor = valor;
  }

  static traduzir(row: any): Ganho {
    return new Ganho(
      new Date(row.data),
      row.valor
    );
  }
}
