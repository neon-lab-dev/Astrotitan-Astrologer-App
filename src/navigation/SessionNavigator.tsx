import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionsScreen from "../screens/tabs/session/SessionScreen";
import SessionHistoryDetailsScreen from "../screens/tabs/session/SessionHistoryDetailsScreen";
const Stack = createNativeStackNavigator();

export default function SessionNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      {/* HOME */}

      <Stack.Screen
        name="HomeScreen"
        component={SessionsScreen}
      />

      {/* ARTICLE */}

      <Stack.Screen
        name="SessionHistoryDetailsScreen"
        component={SessionHistoryDetailsScreen}
      />

    </Stack.Navigator>
  );
}

