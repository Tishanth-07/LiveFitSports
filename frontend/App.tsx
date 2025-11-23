import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SportsProvider } from "./src/context/SportsContext";
import AuthStack from "./src/navigation/AuthStack";
import AppStack from "./src/navigation/AppStack";
import { ActivityIndicator, View } from "react-native";

function RootNavigation() {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state.userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SportsProvider>
        <RootNavigation />
      </SportsProvider>
    </AuthProvider>
  );
}
