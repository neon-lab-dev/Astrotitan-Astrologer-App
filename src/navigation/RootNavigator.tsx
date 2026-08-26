import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";

import { RootStackParamList } from "./types";
import EmailLogin from "../screens/auth/EmailLogin";
import EmailRegister from "../screens/auth/EmailRegister";
import PhoneLogin from "../screens/auth/PhoneLogin";
import PhoneRegister from "../screens/auth/PhoneRegister";
import OtpScreen from "../screens/auth/OtpScreen";
import TermsAndConditions from "../screens/TermsAndConditions";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import ProfileCompleted from "../screens/auth/ProfileCompleted";
import MultiStepForm from "../screens/userDetailsForm/UserDetailsForm";
import TabNavigator from "./TabNavigator";
import NotificationScreen from "../screens/notification/notification";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";
import ProfileScreen from "../screens/tabs/profile/ProfileScreen";
import PersonalInformation from "../screens/tabs/profile/PersonalInformation";
import Queries from "../screens/tabs/profile/query/Queries";
import RaiseQuery from "../screens/tabs/profile/query/RaiseQuery";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />

      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />

      <Stack.Screen
        name="LoginWithEmail"
        component={EmailLogin}
      />
      <Stack.Screen
        name="RegisterWithEmail"
        component={EmailRegister}
      />

      <Stack.Screen
        name="LoginWithPhone"
        component={PhoneLogin}
      />
      <Stack.Screen
        name="RegisterWithPhone"
        component={PhoneRegister}
      />

      <Stack.Screen
        name="OTPScreen"
        component={OtpScreen}
      />
      <Stack.Screen
        name="ProfileCompleted"
        component={ProfileCompleted}
      />
      <Stack.Screen
        name="MultiStepForm"
        component={MultiStepForm}
      />
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformation}
      />
      <Stack.Screen
        name="Queries"
        component={Queries}
      />
      <Stack.Screen
        name="RaiseQuery"
        component={RaiseQuery}
      />
    </Stack.Navigator>
  );
}

