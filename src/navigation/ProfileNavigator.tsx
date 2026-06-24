import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "../screens/tabs/profile/ProfileScreen";
import PersonalInformation from "../screens/tabs/profile/PersonalInformation";
import QueryDetails from "../screens/tabs/profile/query/QureriesDetails";
import RaiseQuery from "../screens/tabs/profile/query/RaiseQuery";
import RaiseQuerySuccess from "../screens/tabs/profile/query/RaiseQuerySuccess";
import Queries from "../screens/tabs/profile/query/Queries";

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >

      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />

      {/* ARTICLE */}

      
      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
      />
      
      <Stack.Screen
        name="QueryDetails"
        component={QueryDetails}
      />
      <Stack.Screen
        name="Queries"
        component={Queries}
      />
      <Stack.Screen
        name="RaiseQuery"
        component={RaiseQuery}
      />
      <Stack.Screen
        name="RaiseQuerySuccess"
        component={RaiseQuerySuccess}
      />
      

    </Stack.Navigator>
  );
}