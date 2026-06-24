import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateScreen from "../screens/tabs/create/CreateScreen";
import SelectContentType from "../screens/tabs/create/article/SelectContentType";
import ArticleScreen from "../screens/tabs/create/article/ArticleScreen";
import CreateArticleScreen from "../screens/tabs/create/article/CreateArticleScreen";

const Stack = createNativeStackNavigator();

export default function CreateNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      {/* HOME */}

      <Stack.Screen
        name="CreateScreen"
        component={CreateScreen}
      />
      <Stack.Screen
        name="SelectContentType"
        component={SelectContentType}
      />
      <Stack.Screen
        name="ArticleScreen"
        component={ArticleScreen}
      />
      <Stack.Screen
        name="CreateArticleScreen"
        component={CreateArticleScreen}
      />
    </Stack.Navigator>
  );
}