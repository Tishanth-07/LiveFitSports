import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
        source={require("../assets/LiveFitSports_logo.png")} // Change if needed
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>Welcome to Our Sports App</Text>
      <Text style={styles.subtitle}>
        Stay updated with the latest matches, scores & your favorite teams!
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.signUpText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F24",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#A5A5A5",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
  },

  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },

  signInButton: {
    backgroundColor: "#4C8BF5",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  signUpButton: {
    borderColor: "#4C8BF5",
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 10,
  },

  signUpText: {
    color: "#4C8BF5",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
