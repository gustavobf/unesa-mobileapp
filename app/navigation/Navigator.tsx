import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { NAMES } from "../utils/constants";
import TabsNavigator from "./TabsNavigator";

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={NAMES.LOGIN}>
        <Stack.Screen
          name={NAMES.LOGIN}
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NAMES.REGISTER}
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NAMES.HOME}
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={NAMES.HOME_ADMIN}
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
