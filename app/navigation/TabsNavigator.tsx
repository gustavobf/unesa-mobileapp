import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Home from "../screens/Home";
import ChangePassword from "../screens/ChangePassword";
import { useUser } from "../contexts/UserContext";
import { UserRole } from "../services/userService";
import { NAMES } from "../utils/constants";
import Appointment from "../screens/Appointment";
import HomeAdmin from "../screens/HomeAdmin";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const { user } = useUser();

  return (
    <Tab.Navigator
      initialRouteName={
        user?.role === UserRole.ADMIN ? NAMES.HOME_ADMIN : NAMES.HOME
      }
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === NAMES.HOME) {
            iconName = "home";
          } else if (route.name === NAMES.HOME_ADMIN) {
            iconName = "settings";
          } else if (route.name === NAMES.USER) {
            iconName = "person";
          } else if (route.name === NAMES.APPOINTMENT) {
            iconName = "calendar";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "black",
      })}
    >
      <Tab.Screen
        name={NAMES.USER}
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      {user?.role === UserRole.CLIENTE && (
        <Tab.Screen
          name={NAMES.HOME}
          component={Home}
          options={{ headerShown: false }}
        />
      )}
      {user?.role === UserRole.ADMIN && (
        <Tab.Screen
          name={NAMES.HOME_ADMIN}
          component={HomeAdmin}
          options={{ headerShown: false, title: NAMES.ADMIN }}
        />
      )}
      {user?.role === UserRole.CLIENTE && (
        <Tab.Screen
          name={NAMES.APPOINTMENT}
          component={Appointment}
          options={{ headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
}
