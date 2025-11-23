import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>We've sent a verification code to</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <Text style={styles.label}>Verification Code</Text>
          <OTPInput
            onComplete={goNext}
            onResend={handleResend}
            countdown={120}
            onChangeCode={setCode}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => goNext(code)}
          disabled={loading || code.trim().length !== 6}
          style={[
            styles.btn,
            (loading || code.trim().length !== 6) && styles.btnDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            {loading ? "Please wait..." : "Submit"}
          </Text>
        </TouchableOpacity>

        {/* Resend Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  backIcon: {
    fontSize: 20,
    color: "#1A1A1A",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#35168aff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  lockIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  otpContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "600",
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#35168aff",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#35168aff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#666666",
  },
  resendText: {
    fontSize: 14,
    color: "#35168aff",
    fontWeight: "600",
  },
});
