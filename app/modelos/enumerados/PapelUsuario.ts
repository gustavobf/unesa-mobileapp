export class PapelUsuario {
    static ADMINISTRADOR = 1;
    static CLIENTE = 2;
  
    static obterDescricao(papel: number): string {
      switch (papel) {
        case PapelUsuario.ADMINISTRADOR:
          return "Administrador";
        case PapelUsuario.CLIENTE:
          return "Cliente";
        default:
          return "Desconhecido";
      }
    }
  }
  