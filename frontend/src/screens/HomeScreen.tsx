import React from "react";
import { View, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="View Matches"
        onPress={() => navigation.navigate("Matches")}
      />
      <Button
        title="My Favorites"
        onPress={() => navigation.navigate("Favorites")}
      />
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}
