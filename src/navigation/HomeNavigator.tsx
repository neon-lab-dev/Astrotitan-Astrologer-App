import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/tabs/home/HomeScreen";
import ArticleScreen from "../screens/tabs/create/article/ArticleScreen";
import NotificationScreen from "../screens/notification/notification";
import AstrologerDetailsScreen from "../screens/tabs/astrologers/astrologer/AstrologerDetailsScreen";

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
  
    </Stack.Navigator>
  );
}

