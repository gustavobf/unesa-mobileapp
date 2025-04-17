import { Servico } from "../modelos/Servico";
import { db } from "./bancoDeDadosService";

export const criarNovoProcedimento = (
  categoria: string,
  preco: number,
  descricao: string,
  duracao: number
): Servico => {
  db.runSync(
    `INSERT INTO servico (categoria, preco, descricao, duracao) VALUES (?, ?, ?, ?)`,
    [categoria, preco, descricao, duracao]
  );

  const resultado: Servico | null = db.getFirstSync(
    `SELECT * FROM servico WHERE rowid = last_insert_rowid()`
  );

  if (!resultado) {
    throw new Error("Erro ao criar serviço: nenhum resultado retornado.");
  }

  return new Servico(
    resultado.id,
    resultado.categoria,
    resultado.preco,
    resultado.descricao,
    resultado.duracao
  );
};

export const obterServicoPorId = (serviceId: number): Servico | null => {
  const resultado: Servico | null = db.getFirstSync(
    `SELECT * FROM servico WHERE id = ?`,
    [serviceId]
  );

  if (!resultado) return null;

  return Servico.traduzir(resultado);
};

export const obterServicos = (): Servico[] => {
  const rows = db.getAllSync(`SELECT * FROM servico`);

  return rows.map((row: any) => Servico.traduzir(row));
};
