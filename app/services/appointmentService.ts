import { Agendamento } from "../models/Agendamento";
import { getServiceById } from "./beautyService";

let appointments: Agendamento[] = [];

export const createAppointment = (
  username: string,
  servicoId: number,
  initialDate: Date
) => {
  const service = getServiceById(servicoId);
  if (!service) {
    throw new Error("Serviço não encontrado");
  }

  const finalDate = new Date(initialDate);
  finalDate.setMinutes(finalDate.getMinutes() + service.duracao);

  const novoAgendamento = new Agendamento(
    Date.now() + Math.floor(Math.random() * 10),
    username,
    service,
    initialDate,
    finalDate
  );

  appointments.push(novoAgendamento);
  return novoAgendamento;
};

export const getAppointments = () => {
  return appointments;
};

export const deleteAppointment = (id: number) => {
  appointments = appointments.filter((appointment) => appointment.id !== id);
};