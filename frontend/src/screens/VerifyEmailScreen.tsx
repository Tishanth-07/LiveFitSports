import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import OTPInput from "../components/OTPInput";
import api from "../services/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

export default function VerifyEmailScreen({ route, navigation }: Props) {
  const email = route.params?.email || "";
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleComplete = async (code: string) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-email", { email, code });
      if (res.data.verified) {
        Alert.alert("Verified", "Email verified. Please login.");
        navigation.navigate("Login");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/api/auth/resend-verification", { email });
      Alert.alert("Sent", "Verification code resent.");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error ?? err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>
      <Text style={{ marginBottom: 10 }}>
        Enter the 6-digit code sent to {email}
      </Text>

      <OTPInput
        onComplete={handleComplete}
        countdown={120}
        onResend={handleResend}
        onChangeCode={setCode}
      />

      <TouchableOpacity
        onPress={() => handleComplete(code)}
        disabled={loading || code.trim().length !== 6}
        style={{
          marginTop: 12,
          backgroundColor:
            loading || code.trim().length !== 6 ? "#999" : "#0b76ef",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loading ? "Verifying..." : "Submit"}
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20, color: "#666" }}>
        {loading ? "Verifying..." : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
});
