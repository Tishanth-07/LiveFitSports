import axios from "axios";

// Expo: use EXPO_PUBLIC_ prefix to expose env to the app bundle
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
