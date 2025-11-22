import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../services/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import { isValidPassword } from "../utils/validation";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const email = route.params?.email ?? "";
  const code = route.params?.code ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async () => {
    if (!isValidPassword(newPassword)) {
      Alert.alert(
        "Invalid password",
        "Password must be at least 6 chars, include 1 uppercase, 1 number and 1 symbol."
      );
      return;
    }
    if (newPassword !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    try {
      await api.post("/api/auth/reset-password", { email, code, newPassword });
      Alert.alert("Success", "Password reset successful. Please login.");
      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error ?? err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={{ marginBottom: 10 }}>Enter a new password for {email}</Text>

      <TextInput
        placeholder="New password"
        style={styles.input}
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        placeholder="Confirm password"
        style={styles.input}
        secureTextEntry={true}
        value={confirm}
        onChangeText={setConfirm}
      />

      <Text style={{ marginTop: 8, color: "#666" }}>
        Password must be at least 6 chars, include 1 uppercase, 1 number and 1
        symbol
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#0b76ef",
          padding: 14,
          borderRadius: 8,
          marginTop: 16,
          alignItems: "center",
        }}
        onPress={handleSubmit}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
});
