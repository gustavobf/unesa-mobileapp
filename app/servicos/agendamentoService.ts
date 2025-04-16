import { db } from "../App";
import { Agendamento } from "../modelos/Agendamento";
import { obterServicoPorId } from "./opcoesService";

export const criarAgendamento = (
  usuarioId: number,
  servicoId: number,
  dataInicial: Date
): Agendamento => {
  const service = obterServicoPorId(servicoId);
  if (!service) {
    throw new Error("Serviço não encontrado");
  }

  const dataFinal = new Date(dataInicial);
  dataFinal.setMinutes(dataFinal.getMinutes() + service.duracao);

  db.runSync(
    `INSERT INTO agendamentos (usuario_id, servico_id, data_inicio_agendamento, data_fim_agendamento) 
     VALUES (?, ?, ?, ?)`,
    [usuarioId, servicoId, dataInicial.toISOString(), dataFinal.toISOString()]
  );

  const agendamento: any = db.getFirstSync(
    `SELECT * FROM agendamentos WHERE rowid = last_insert_rowid()`
  );

  if (!agendamento) {
    throw new Error("Erro ao criar agendamento");
  }
  return Agendamento.traduzir(agendamento);
};

export const obterAgendamentos = () => {
  const resultado = db.getAllSync("SELECT * FROM agendamentos");

  return resultado.map((appointment: any) => {
    return Agendamento.traduzir(appointment);
  });
};

export const obterAgendamentorPorUsuarioId = (usuarioId: number) => {
  const resultado = db.getAllSync(
    "SELECT * FROM agendamentos WHERE usuario_id = ?",
    [usuarioId]
  );

  return resultado.map((appointment: any) => {
    return Agendamento.traduzir(appointment);
  });
};

export const excluirAgendamento = (id: number) => {
  db.runSync("DELETE FROM agendamentos WHERE id = ?", [id]);
};
