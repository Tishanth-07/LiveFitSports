import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
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
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Formik
        initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
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
          <>
            <TextInput
              placeholder="First name"
              style={styles.input}
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
              value={values.firstName}
            />
            {errors.firstName && touched.firstName && (
              <Text style={styles.err}>{errors.firstName}</Text>
            )}

            <TextInput
              placeholder="Last name"
              style={styles.input}
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
              value={values.lastName}
            />
            {errors.lastName && touched.lastName && (
              <Text style={styles.err}>{errors.lastName}</Text>
            )}

            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
            />
            {errors.email && touched.email && (
              <Text style={styles.err}>{errors.email}</Text>
            )}

            <View style={{ position: "relative" }}>
              <TextInput
                placeholder="Password"
                style={styles.input}
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
                <Text>{showPw ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && touched.password && (
              <Text style={styles.err}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.btn} onPress={() => handleSubmit()}>
              <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 12 }}
            >
              <Text style={{ color: "#007bff" }}>
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  err: { color: "red" },
  btn: {
    backgroundColor: "#0b76ef",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  eye: { position: "absolute", right: 12, top: 18 },
});
