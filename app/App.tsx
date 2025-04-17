import React, { useEffect } from "react";
import { ProvedorUsuario } from "./contextos/UsuarioContext";
import Navegador from "./navegacao/Navegador";
import { iniciarBancoDeDados } from "./servicos/bancoDeDadosService";

export default function App() {
  useEffect(() => {
    iniciarBancoDeDados();
  }, []);

  return (
    <ProvedorUsuario>
      <Navegador />
    </ProvedorUsuario>
  );
}
