import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SessionsScreen from "../screens/tabs/session/SessionScreen";
import SessionHistoryDetailsScreen from "../screens/tabs/session/SessionHistoryDetailsScreen";
import AstrologerChatScreen from "../screens/tabs/session/(chat)/AstrologerChatScreen";
import ProvideNotes from "../screens/tabs/session/ProvideNotes";
import ConsultationCallScreen from "../screens/tabs/session/ConsultationCallScreen";
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
      <Stack.Screen
        name="AstrologerChatScreen"
        component={AstrologerChatScreen}
      />
      <Stack.Screen
        name="ProvideNotes"
        component={ProvideNotes}
      />
      <Stack.Screen
        name="ConsultationCallScreen"
        component={ConsultationCallScreen}
      />

    </Stack.Navigator>
  );
}

