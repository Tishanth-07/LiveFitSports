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
  ScrollView,
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
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from previously used passwords
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* New Password Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔒</Text>
            </View>
            <TextInput
              placeholder="New password"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              secureTextEntry={!showNewPw}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              style={styles.eye}
              onPress={() => setShowNewPw((s) => !s)}
            >
              <Text style={styles.eyeText}>{showNewPw ? "👁️" : "👁️‍🗨️"}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔒</Text>
            </View>
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor="#A0A0A0"
              style={styles.input}
              secureTextEntry={!showConfirmPw}
              value={confirm}
              onChangeText={setConfirm}
            />
            <TouchableOpacity
              style={styles.eye}
              onPress={() => setShowConfirmPw((s) => !s)}
            >
              <Text style={styles.eyeText}>{showConfirmPw ? "👁️" : "👁️‍🗨️"}</Text>
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <View style={styles.requirement}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.requirementText}>At least 6 characters</Text>
            </View>
            <View style={styles.requirement}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.requirementText}>1 uppercase letter</Text>
            </View>
            <View style={styles.requirement}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.requirementText}>1 number</Text>
            </View>
            <View style={styles.requirement}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.requirementText}>1 special symbol</Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
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
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 16,
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
  eye: {
    paddingHorizontal: 16,
    height: 56,
    justifyContent: "center",
  },
  eyeText: {
    fontSize: 18,
  },
  requirementsBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#007AFF",
    marginRight: 8,
  },
  requirementText: {
    fontSize: 13,
    color: "#666666",
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
});
