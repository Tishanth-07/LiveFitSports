import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api from "../services/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    try {
      await api.post("/api/auth/forgot-password", { email });
      Alert.alert("Sent", "Password reset code sent. Check your email.");
      navigation.navigate("VerifyResetCode", { email });
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.error ?? err.message);
    }
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
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Don't worry! It happens. Please enter the email address associated
            with your account.
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✉️</Text>
          </View>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#A0A0A0"
            style={styles.input}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSend}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Send Reset Code</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Sign in</Text>
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
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  backIcon: {
    fontSize: 20,
    color: "#1A1A1A",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    overflow: "hidden",
  },
  iconContainer: {
    width: 48,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
  },
  icon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1A1A1A",
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
  linkText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
