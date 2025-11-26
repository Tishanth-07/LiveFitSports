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
    const e: any = error;
    if (e?.response?.status !== 401) {
      console.error("Error fetching favourites:", e);
    }
    throw error;
  }
};

export const fetchWorkouts = async () => {
  try {
    const res = await api.get("/api/Health/workouts");
    return res.data;
  } catch (err) {
    console.error("Error fetching workouts:", err);
    throw err;
  }
};

export const fetchWorkoutById = async (id: string) => {
  if (!id || id.length !== 24) {
    throw new Error("Invalid workout id");
  }
  try {
    const res = await api.get(`/api/Health/workouts/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching workout:", err);
    throw err;
  }
};

export const fetchHealthTips = async () => {
  try {
    const res = await api.get("/api/Health/tips");
    return res.data;
  } catch (err) {
    console.error("Error fetching health tips:", err);
    throw err;
  }
};

export const fetchHealthTipById = async (id: string) => {
  if (!id || id.length !== 24) {
    throw new Error("Invalid health tip id");
  }
  try {
    const res = await api.get(`/api/Health/tips/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching health tip:", err);
    throw err;
  }
};

// Get profile
export const fetchProfile = async () => {
  try {
    const res = await api.get("/api/profile");
    return res.data;
  } catch (err) {
    console.error("fetchProfile error:", err);
    throw err;
  }
};

// Update profile (first/last name)
export const updateProfile = async (payload: { FirstName?: string; LastName?: string }) => {
  try {
    const res = await api.put("/api/profile", payload);
    return res.data;
  } catch (err) {
    console.error("updateProfile error:", err);
    throw err;
  }
};

// Upload avatar (multipart/form-data)
export const uploadAvatar = async (fileUri: string, fileName: string) => {
  try {
    const formData = new FormData();
    // On Expo, fileUri is like 'file://...'
    const file: any = {
      uri: fileUri,
      name: fileName,
      type: "image/jpeg",
    };
    formData.append("file", file as any);

    const res = await api.post("/api/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("uploadAvatar error:", err);
    throw err;
  }
};

export default api;
