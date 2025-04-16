import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useUsuario } from "../contextos/UsuarioContext";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";
import Agendamento from "../telas/Agendamento";
import ChangePassword from "../telas/AlteraSenha";
import Home from "../telas/Principal";
import PrincipalAdmin from "../telas/PrincipalAdmin";
import { NOMES } from "../utilitarios/constantes";

const Tab = createBottomTabNavigator();

export default function AbasNavegador() {
  const { usuario } = useUsuario();

  return (
    <Tab.Navigator
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
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "black",
      })}
    >
      <Tab.Screen
        name={NOMES.USUARIO}
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      {usuario?.papel === PapelUsuario.CLIENTE && (
        <Tab.Screen
          name={NOMES.INICIO}
          component={Home}
          options={{ headerShown: false }}
        />
      )}
      {usuario?.papel === PapelUsuario.ADMINISTRADOR && (
        <Tab.Screen
          name={NOMES.INICIO_ADMIN}
          component={PrincipalAdmin}
          options={{ headerShown: false, title: NOMES.ADMINISTRADOR }}
        />
      )}
      {usuario?.papel === PapelUsuario.CLIENTE && (
        <Tab.Screen
          name={NOMES.AGENDAMENTO}
          component={Agendamento}
          options={{ headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
}
