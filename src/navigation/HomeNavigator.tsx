import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/tabs/home/HomeScreen";
import ArticleScreen from "../screens/tabs/create/article/ArticleScreen";
import NotificationScreen from "../screens/notification/notification";
import AstrologerDetailsScreen from "../screens/tabs/astrologers/astrologer/AstrologerDetailsScreen";
import AstrologerChatScreen from "../screens/tabs/session/(chat)/AstrologerChatScreen";
import ProfileScreen from "../screens/tabs/profile/ProfileScreen";
import SessionsScreen from "../screens/tabs/session/SessionScreen";
import KundliScreen from "../screens/tabs/kundli/KundliScreen";
import CreateScreen from "../screens/tabs/create/CreateScreen";

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
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
        component={HomeScreen}
      />

      {/* ARTICLE */}

      <Stack.Screen
        name="ArticleScreen"
        component={ArticleScreen}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
      <Stack.Screen
        name="AstrologerDetailsScreen"
        component={AstrologerDetailsScreen}
      />
      <Stack.Screen
        name="AstrologerChatScreen"
        component={AstrologerChatScreen}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="SessionsScreen"
        component={SessionsScreen}
      />
      <Stack.Screen
        name="KundliScreen"
        component={KundliScreen}
      />
      <Stack.Screen
        name="CreateScreen"
        component={CreateScreen}
      />
  
    </Stack.Navigator>
  );
}

