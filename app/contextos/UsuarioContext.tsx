import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "../modelos/Usuario";

interface TipoDeContextoUsuario {
  usuario: Usuario | null;
  definirUsuario: React.Dispatch<React.SetStateAction<Usuario | null>>;
  carregando: boolean;
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
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      const json = await AsyncStorage.getItem("usuario");
      if (json) {
        definirUsuario(JSON.parse(json));
      }
      setCarregando(false);
    };
    carregarUsuario();
  }, []);

  useEffect(() => {
    const salvarUsuario = async () => {
      if (usuario) {
        await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
      } else {
        await AsyncStorage.removeItem("usuario");
      }
    };
    salvarUsuario();
  }, [usuario]);

  return (
    <ContextoUsuario.Provider value={{ usuario, definirUsuario, carregando }}>
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
