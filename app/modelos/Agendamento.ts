export class Agendamento {
  id: number;
  usuarioId: number;
  servicoId: number;
  dataInicioAgendamento: Date;
  dataFimAgendamento: Date;

  constructor(
    id: number,
    usuarioId: number,
    servicoId: number,
    dataInicioAgendamento: Date,
    dataFimAgendamento: Date
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.servicoId = servicoId;
    this.dataInicioAgendamento = dataInicioAgendamento;
    this.dataFimAgendamento = dataFimAgendamento;
  }

  static traduzir(row: any): Agendamento {
    return new Agendamento(
      row.id,
      row.usuario_id,
      row.servico_id,
      new Date(row.data_inicio_agendamento),
      new Date(row.data_fim_agendamento)
    );
  }
}
