import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Entrar from "../telas/Entrar";
import Registrar from "../telas/Registrar";
import { NOMES } from "../utilitarios/constantes";
import AbasNavegador from "./AbasNavegador";

const Stack = createStackNavigator();

export default function Navegador() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={NOMES.ENTRAR}>
        <Stack.Screen
          name={NOMES.ENTRAR}
          component={Entrar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NOMES.REGISTRAR}
          component={Registrar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NOMES.INICIO}
          component={AbasNavegador}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NOMES.INICIO_ADMIN}
          component={AbasNavegador}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
