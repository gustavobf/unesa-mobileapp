import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useUsuario } from "../contextos/UsuarioContext";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";
import Agendamento from "../telas/Agendamento";
import TrocarSenha from "../telas/AlterarSenha";
import Inicio from "../telas/Principal";
import PrincipalAdmin from "../telas/PrincipalAdmin";
import { NOMES } from "../utilitarios/constantes";
import { Cores } from "../estilos/cores";

const Aba = createBottomTabNavigator();

export default function AbasNavegador() {
  const { usuario } = useUsuario();

  return (
    <Aba.Navigator
      initialRouteName={
        usuario?.papel === PapelUsuario.ADMINISTRADOR
          ? NOMES.INICIO_ADMIN
          : NOMES.INICIO
      }
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === NOMES.INICIO) {
            iconName = "home";
          } else if (route.name === NOMES.INICIO_ADMIN) {
            iconName = "settings";
          } else if (route.name === NOMES.USUARIO) {
            iconName = "person";
          } else if (route.name === NOMES.AGENDAMENTO) {
            iconName = "calendar";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Cores.primario,
        tabBarInactiveTintColor: "black",
      })}
    >
      <Aba.Screen
        name={NOMES.USUARIO}
        component={TrocarSenha}
        options={{ headerShown: false }}
      />
      {usuario?.papel === PapelUsuario.CLIENTE && (
        <Aba.Screen
          name={NOMES.INICIO}
          component={Inicio}
          options={{ headerShown: false }}
        />
      )}
      {usuario?.papel === PapelUsuario.ADMINISTRADOR && (
        <Aba.Screen
          name={NOMES.INICIO_ADMIN}
          component={PrincipalAdmin}
          options={{ headerShown: false, title: NOMES.ADMINISTRADOR }}
        />
      )}
      {usuario?.papel === PapelUsuario.CLIENTE && (
        <Aba.Screen
          name={NOMES.AGENDAMENTO}
          component={Agendamento}
          options={{ headerShown: false }}
        />
      )}
    </Aba.Navigator>
  );
}
