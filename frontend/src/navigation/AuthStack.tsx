import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import VerifyEmailScreen from "../screens/VerifyEmailScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import VerifyResetCodeScreen from "../screens/VerifyResetCodeScreen";

export type AuthStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  VerifyEmail: { email: string } | undefined;
  ForgotPassword: undefined;
  VerifyResetCode: { email: string } | undefined;
  ResetPassword: { email: string; code: string } | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
