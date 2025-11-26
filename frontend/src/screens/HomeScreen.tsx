import React from "react";
import { View, Button } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }: any) {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, gap: 15, justifyContent: "center" }}>
      {/* Matches */}
      <Button
        title="View Matches"
        onPress={() => navigation.navigate("Matches")}
      />

      {/* Favorites */}
      <Button
        title="My Favorites"
        onPress={() => navigation.navigate("Favorites")}
      />

      {/* Workout Tips */}
      <Button
        title="Workout Tips"
        onPress={() => navigation.navigate("Workouts")}
      />

      {/* Health Tips */}
      <Button
        title="Health Tips"
        onPress={() => navigation.navigate("HealthTips")}
      />

      {/* Logout */}
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}
