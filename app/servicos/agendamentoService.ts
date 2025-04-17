import { Agendamento } from "../modelos/Agendamento";
import { Ganho } from "../modelos/Ganho";
import { db } from "./bancoDeDadosService";
import { obterServicoPorId } from "./procedimentoService";

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
    `INSERT INTO agendamento (usuario_id, servico_id, data_inicio_agendamento, data_fim_agendamento) 
     VALUES (?, ?, ?, ?)`,
    [usuarioId, servicoId, dataInicial.toISOString(), dataFinal.toISOString()]
  );

  const agendamento: any = db.getFirstSync(
    `SELECT * FROM agendamento WHERE rowid = last_insert_rowid()`
  );

  if (!agendamento) {
    throw new Error("Erro ao criar agendamento");
  }
  return Agendamento.traduzir(agendamento);
};

export const cancelaAgendamento = (agendamentoId: number) => {
  const hoje = new Date().toISOString().split("T")[0];
  db.runSync(
    "UPDATE agendamento set data_cancelamento = ? where id = ?",
    [hoje, agendamentoId]
  );}

export const obterAgendamentos = () => {
  const resultado = db.getAllSync("SELECT * FROM agendamento WHERE data_cancelamento is null and data_conclusao is null");

  return resultado.map((agendamento: any) => {
    return Agendamento.traduzir(agendamento);
  });
};

export const obterGanhoDoDia = (): Ganho => {
  const hoje = new Date().toISOString().split("T")[0];
  const resultado = db.getFirstSync("SELECT * FROM ganho WHERE data = ?", [hoje]);

  if (!resultado) {
    return { data: new Date(), valor: 0 };
  }

  return Ganho.traduzir(resultado);
};


export const registrarGanhoDoDia = (valor: number) => {
  const hoje = new Date().toISOString().split("T")[0];

  const ganhoExistente = db.getFirstSync(
    "SELECT * FROM ganho WHERE data = ?",
    [hoje]
  );

  if (ganhoExistente) {
    db.runSync(
      "UPDATE ganho SET valor = ? WHERE data = ?",
      [valor, hoje]
    );
  } else {
    db.runSync(
      "INSERT INTO ganho (data, valor) VALUES (?, ?)",
      [hoje, valor]
    );
  }
};

export const listarGanhos = () => {
   const resultado = db.getAllSync("SELECT * FROM ganho ORDER BY data DESC");

  return resultado.map((ganho: any) => {
    return Ganho.traduzir(ganho);
  });
};

export const obterAgendamentorPorUsuarioId = (usuarioId: number) => {
  const resultado = db.getAllSync(
    "SELECT * FROM agendamento WHERE usuario_id = ? and data_cancelamento is null and data_conclusao is null",
    [usuarioId]
  );

  return resultado.map((agendamento: any) => {
    return Agendamento.traduzir(agendamento);
  });
};

export const concluirAgendamento = (id: number) => {
  const dataAtual = new Date().toISOString();
  db.runSync(
    "UPDATE agendamento SET data_conclusao = ? WHERE id = ?",
    [dataAtual, id]
  );
};
