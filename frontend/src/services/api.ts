import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Expo: use EXPO_PUBLIC_ prefix to expose env to the app bundle
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const generateObjectId = () => {
  const hex = "0123456789abcdef";
  let id = "";
  for (let i = 0; i < 24; i++) id += hex[Math.floor(Math.random() * 16)];
  return id;
};

// Automatically attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data; // expects { accessToken: string, user: { ... } }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res.data;
};

// Matches APIs
export const fetchMatches = async () => {
  try {
    const response = await api.get("/api/Matches");
    return response.data; // expects array of matches
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const fetchMatchById = async (id: string) => {
  try {
    const response = await api.get(`/api/Matches/${id}`);
    return response.data; // expects single match object
  } catch (error) {
    console.error("Error fetching match:", error);
    throw error;
  }
};

// Favourites APIs
export const addFavourite = async (itemId: string) => {
  try {
    const response = await api.post("/api/Favorites", {
      id: generateObjectId(),
      userId: "placeholder",
      itemId: itemId,
      itemType: "match",
    });
    return response.data;
  } catch (error) {
    const e: any = error;
    console.error(
      "Error adding favourite:",
      e?.response?.status,
      e?.response?.data || e?.message || e
    );
    throw error;
  }
};

export const removeFavourite = async (itemId: string) => {
  try {
    const response = await api.delete(`/api/Favorites/${itemId}`);
    return response.data;
  } catch (error) {
    const e: any = error;
    console.error(
      "Error removing favourite:",
      e?.response?.status,
      e?.response?.data || e?.message || e
    );
    throw error;
  }
};

export const getFavourites = async () => {
  try {
    const response = await api.get("/api/Favorites");
    return response.data; // expects array of favourite items
  } catch (error) {
    console.error("Error fetching favourites:", error);
    throw error;
  }
};

export default api;
