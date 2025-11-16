import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { signOut } = useAuth();
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        Welcome to LiveFit Sports
      </Text>
      <TouchableOpacity onPress={() => signOut()} style={{ marginTop: 20 }}>
        <Text style={{ color: "red" }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
