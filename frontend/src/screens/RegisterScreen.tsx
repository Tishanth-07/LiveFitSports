import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { isValidPassword, emailRegex } from "../utils/validation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required("First name required"),
  lastName: Yup.string().required("Last name required"),
  email: Yup.string()
    .matches(emailRegex, "Invalid email")
    .required("Email required"),
  password: Yup.string()
    .required("Password required")
    .test(
      "pw",
      "Password must be at least 6 chars, include 1 uppercase, 1 number and 1 symbol",
      (v) => isValidPassword(v || "")
    ),
});

export default function RegisterScreen({ navigation }: Props) {
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      await api.post("/api/auth/register", values);
      Alert.alert("Success", "Registered. Verification code sent to email.");
      navigation.navigate("VerifyEmail", { email: values.email });
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
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to get started with your account
          </Text>
        </View>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* First Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>👤</Text>
                </View>
                <TextInput
                  placeholder="First name"
                  placeholderTextColor="#A0A0A0"
                  style={[
                    styles.input,
                    errors.firstName && touched.firstName && styles.inputError,
                  ]}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                />
              </View>
              {errors.firstName && touched.firstName && (
                <Text style={styles.err}>{errors.firstName}</Text>
              )}

              {/* Last Name Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>👤</Text>
                </View>
                <TextInput
                  placeholder="Last name"
                  placeholderTextColor="#A0A0A0"
                  style={[
                    styles.input,
                    errors.lastName && touched.lastName && styles.inputError,
                  ]}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                />
              </View>
              {errors.lastName && touched.lastName && (
                <Text style={styles.err}>{errors.lastName}</Text>
              )}

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>✉️</Text>
                </View>
                <TextInput
                  placeholder="Email or Phone number"
                  placeholderTextColor="#A0A0A0"
                  style={[
                    styles.input,
                    errors.email && touched.email && styles.inputError,
                  ]}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                />
              </View>
              {errors.email && touched.email && (
                <Text style={styles.err}>{errors.email}</Text>
              )}

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🔒</Text>
                </View>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#A0A0A0"
                  style={[
                    styles.input,
                    errors.password && touched.password && styles.inputError,
                  ]}
                  secureTextEntry={!showPw}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={() => setShowPw((s) => !s)}
                >
                  <Text style={styles.eyeText}>{showPw ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && (
                <Text style={styles.err}>{errors.password}</Text>
              )}

              {/* Password Requirements */}
              <Text style={styles.passwordHint}>
                Password must be at least 6 chars
              </Text>

              {/* Register Button */}
              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleSubmit()}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Create Account</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or use google account</Text>
                <View style={styles.divider} />
              </View>

              {/* Sign In Link */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already you have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.linkText}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
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
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "center",
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
    marginBottom: 4,
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
  inputError: {
    borderColor: "#35168aff",
  },
  eye: {
    paddingHorizontal: 16,
    height: 56,
    justifyContent: "center",
  },
  eyeText: {
    fontSize: 18,
  },
  err: {
    color: "#35168aff",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  passwordHint: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 24,
    marginLeft: 4,
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#999999",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4285F4",
    marginRight: 12,
  },
  googleText: {
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "500",
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
