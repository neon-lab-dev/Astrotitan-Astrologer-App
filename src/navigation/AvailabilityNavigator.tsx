import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AvailabilityScreen from "../screens/tabs/availability/AavalibilityScreen";

const Stack = createNativeStackNavigator();

export default function AvailabilityNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      {/* HOME */}

      <Stack.Screen
        name="AvailabilityScreen"
        component={AvailabilityScreen}
      />

  
    </Stack.Navigator>
  );
}

