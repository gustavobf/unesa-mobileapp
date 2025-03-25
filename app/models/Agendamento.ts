import { Servico } from "./Servico";

export class Agendamento {
  id: number;
  usuario: string;
  servico: Servico;
  dataInicioAgendamento: Date;
  dataFimAgendamento: Date;

  constructor(
    id: number,
    usuario: string,
    servico: Servico,
    dataInicioAgendamento: Date,
    dataFimAgendamento: Date
  ) {
    this.id = id;
    this.usuario = usuario;
    this.servico = servico;
    this.dataInicioAgendamento = dataInicioAgendamento;
    this.dataFimAgendamento = dataFimAgendamento;
  }
}
