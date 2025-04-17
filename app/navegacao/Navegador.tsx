import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Entrar from "../telas/Entrar";
import Registrar from "../telas/Registrar";
import { NOMES } from "../utilitarios/constantes";
import AbasNavegador from "./AbasNavegador";
import { useUsuario } from "../contextos/UsuarioContext";

const Stack = createStackNavigator();

export default function Navegador() {
  const { usuario, carregando } = useUsuario();

  if (carregando) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          <Stack.Screen name={NOMES.ABAS} component={AbasNavegador} />
        ) : (
          <>
            <Stack.Screen name={NOMES.ENTRAR} component={Entrar} />
            <Stack.Screen name={NOMES.REGISTRAR} component={Registrar} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
