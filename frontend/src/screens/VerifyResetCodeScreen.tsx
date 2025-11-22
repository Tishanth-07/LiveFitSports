import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import OTPInput from "../components/OTPInput";
import api from "../services/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyResetCode">;

export default function VerifyResetCodeScreen({ route, navigation }: Props) {
  const email = route.params?.email ?? "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);
      await api.post("/api/auth/forgot-password", { email });
      Alert.alert("Sent", "Reset code resent.");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  const goNext = (c: string) => {
    navigation.navigate("ResetPassword", { email, code: c });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Reset Code</Text>
      <Text style={{ marginBottom: 10 }}>Enter the 6-digit code sent to {email}</Text>

      <OTPInput onComplete={goNext} onResend={handleResend} countdown={120} onChangeCode={setCode} />

      <TouchableOpacity
        onPress={() => goNext(code)}
        disabled={loading || code.trim().length !== 6}
        style={{
          marginTop: 12,
          backgroundColor: loading || code.trim().length !== 6 ? "#999" : "#0b76ef",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>{loading ? "Please wait..." : "Submit"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
});
