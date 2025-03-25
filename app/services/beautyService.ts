import { Servico } from "../models/Servico";

let services: Servico[] = [
  new Servico(1, "Embelezamento Facial", 25, "Design de sobrancelhas", 30),
  new Servico(2, "Embelezamento Facial", 35, "Design com Henna", 30),
  new Servico(3, "Depilação a Cera", 12, "Buço Feminino", 15),
  new Servico(4, "Depilação a Cera", 35, "Rosto Feminino", 30),
  new Servico(5, "Depilação a Cera", 60, "Barba Masculina", 40),
  new Servico(6, "Depilação a Cera", 20, "Axilas", 20),
  new Servico(7, "Depilação a Cera", 30, "1/2 Perna", 25),
  new Servico(8, "Depilação a Cera", 55, "Perna Inteira", 40),
  new Servico(9, "Depilação a Cera", 45, "Virilha Cavada Feminina", 30),
  new Servico(10, "Depilação a Cera", 60, "Virilha Total", 40),
  new Servico(
    11,
    "Estética Facial",
    100,
    "Limpeza de Pele + Peeling de Diamante",
    60
  ),
  new Servico(12, "Estética Facial", 100, "Peeling de Vitamina C", 60),
  new Servico(
    13,
    "Estética Facial",
    50,
    "Revitalização + Drenagem Linfática Facial",
    60
  ),

  new Servico(14, "Estética Corporal", 70, "Detox Corporal", 60),
  new Servico(15, "Estética Corporal", 65, "Drenagem Linfática (área)", 45),
  new Servico(
    16,
    "Estética Corporal",
    120,
    "Drenagem Linfática (corpo todo)",
    90
  ),
  new Servico(
    17,
    "Estética Corporal",
    70,
    "Liberação Miofascial + Ventosaterapia (área)",
    60
  ),
];

export const createBeautyService = (
  categoria: string,
  preco: number,
  descricao: string,
  duracao: number
) => {
  const beautyService = new Servico(
    Date.now(),
    categoria,
    preco,
    descricao,
    duracao
  );

  services.push(beautyService);
  return beautyService;
};

export const getServiceById = (serviceId: number) => {
  return getServices().find((service) => service.id === serviceId);
};

export const getServices = () => {
  return services;
};
