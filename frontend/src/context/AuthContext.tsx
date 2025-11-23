import React, { createContext, useContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { loginUser, registerUser } from "../services/api";

type State = {
  userToken: string | null;
  isLoading: boolean;
  user: any | null;
};

type Action =
  | { type: "RESTORE_TOKEN"; token: string | null; user?: any }
  | { type: "SIGN_IN"; token: string; user?: any }
  | { type: "SIGN_OUT" };

const initialState: State = {
  userToken: null,
  isLoading: true,
  user: null,
};

function reducer(prev: State, action: Action): State {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prev,
        userToken: action.token,
        user: action.user || null,
        isLoading: false,
      };
    case "SIGN_IN":
      return { ...prev, userToken: action.token, user: action.user || null };
    case "SIGN_OUT":
      return { ...prev, userToken: null, user: null };
    default:
      return prev;
  }
}

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // restore token on app load
    (async () => {
      try {
        const rawToken = await AsyncStorage.getItem("userToken");
        const token =
          rawToken && rawToken !== "null" && rawToken !== "undefined" && rawToken.trim() !== ""
            ? rawToken
            : null;
        if (!token) {
          await AsyncStorage.removeItem("userToken");
        }

        let validToken = token;
        if (token) {
          try {
            await api.get("/api/Favorites");
          } catch (e: any) {
            await AsyncStorage.removeItem("userToken");
            validToken = null;
          }
        }

        const userData = await AsyncStorage.getItem("userData");
        dispatch({
          type: "RESTORE_TOKEN",
          token: validToken,
          user: userData ? JSON.parse(userData) : null,
        });
      } catch {
        dispatch({ type: "RESTORE_TOKEN", token: null });
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const token = res.data?.accessToken;

      if (!token) {
        throw new Error("Login failed: Access token not received");
      }

      await AsyncStorage.setItem("userToken", token);
      dispatch({ type: "SIGN_IN", token });
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error; // optionally propagate to show error in UI
    }
  };


  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password);
    return res; // you can optionally auto-login after registration
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    dispatch({ type: "SIGN_OUT" });
  };

  const value = {
    state,
    signIn,
    signOut,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
