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
import OTPInput from "../components/OTPInput";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const email = route.params?.email ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleComplete = async (code: string) => {
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

  const handleResend = async () => {
    try {
      await api.post("/api/auth/forgot-password", { email });
      Alert.alert("Sent", "Reset code resent.");
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

      <Text style={{ marginTop: 12 }}>Enter the 6-digit code below</Text>

      <OTPInput
        onComplete={handleComplete}
        countdown={120}
        onResend={handleResend}
      />
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
