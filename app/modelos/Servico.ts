export class Servico {
  id: number;
  categoria: string;
  preco: number;
  descricao: string;
  duracao: number;

  constructor(
    id: number,
    categoria: string,
    preco: number,
    descricao: string,
    duracao: number
  ) {
    this.id = id;
    this.categoria = categoria;
    this.preco = preco;
    this.descricao = descricao;
    this.duracao = duracao;
  }

  static traduzir(row: any): Servico {
    return new Servico(
      row.id,
      row.categoria,
      row.preco,
      row.descricao,
      row.duracao
    );
  }
}
