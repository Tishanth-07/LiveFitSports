import React, { createContext, useContext, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

type State = {
  userToken: string | null;
  isLoading: boolean;
};

type Action =
  | { type: "RESTORE_TOKEN"; token: string | null }
  | { type: "SIGN_IN"; token: string }
  | { type: "SIGN_OUT" };

const initialState: State = {
  userToken: null,
  isLoading: true,
};

function reducer(prev: State, action: Action): State {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return { ...prev, userToken: action.token, isLoading: false };
    case "SIGN_IN":
      return { ...prev, userToken: action.token };
    case "SIGN_OUT":
      return { ...prev, userToken: null };
    default:
      return prev;
  }
}

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // restore token
    (async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        dispatch({ type: "RESTORE_TOKEN", token });
      } catch {
        dispatch({ type: "RESTORE_TOKEN", token: null });
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    const token = res.data.accessToken;
    await AsyncStorage.setItem("userToken", token);
    dispatch({ type: "SIGN_IN", token });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("userToken");
    dispatch({ type: "SIGN_OUT" });
  };

  const value = {
    state,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
