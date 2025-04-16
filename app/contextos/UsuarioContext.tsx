import React, { createContext, ReactNode, useContext, useState } from "react";
import { Usuario } from "../modelos/Usuario";

interface TipoDeContextoUsuario {
  usuario: Usuario | null;
  definirUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

interface PropriedadesProvedorUsuario {
  children: ReactNode;
}

const ContextoUsuario = createContext<TipoDeContextoUsuario | undefined>(
  undefined
);

export const ProvedorUsuario: React.FC<PropriedadesProvedorUsuario> = ({
  children,
}) => {
  const [usuario, definirUsuario] = useState<Usuario | null>(null);

  return (
    <ContextoUsuario.Provider value={{ usuario, definirUsuario }}>
      {children}
    </ContextoUsuario.Provider>
  );
};

export const useUsuario = () => {
  const contexto = useContext(ContextoUsuario);
  if (!contexto) {
    throw new Error("useUsuario deve ser usado dentro de um ProvedorUsuario");
  }
  return contexto;
};
