import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Match } from "../utils/types";
import {
  fetchMatches,
  fetchMatchById,
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../services/api";
import { API_BASE_URL } from "../services/api";

interface SportsContextType {
  matches: Match[];
  favorites: Match[];
  toggleFavorite: (match: Match) => void;
}

const SportsContext = createContext<SportsContextType | null>(null);

export const SportsProvider = ({ children }: any) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [favorites, setFavorites] = useState<Match[]>([]);

  const normalizeMatch = (m: any): Match => ({
    Id: m?.Id ?? m?.id,
    Sport: m?.Sport ?? m?.sport,
    Title: m?.Title ?? m?.title,
    Description: m?.Description ?? m?.description,
    Status: m?.Status ?? m?.status,
    StartAtUtc: m?.StartAtUtc ?? m?.startAtUtc,
    ImageUrl: (() => {
      const url = m?.ImageUrl ?? m?.imageUrl;
      if (!url) return undefined;
      if (typeof url === "string" && !/^https?:\/\//i.test(url)) {
        const sep = url.startsWith("/") ? "" : "/";
        return `${API_BASE_URL}${sep}${url}`;
      }
      return url;
    })(),
    Metadata: m?.Metadata ?? m?.metadata ?? {},
    Popularity: m?.Popularity ?? m?.popularity,
    Teams: m?.Teams ?? m?.teams,
  });

  // Load matches + favourites on app start
  useEffect(() => {
    loadMatches();
    loadFavorites();
  }, []);

  // Fetch matches from API
  const loadMatches = async () => {
    try {
      const list = await fetchMatches();
      const normalized = Array.isArray(list) ? list.map(normalizeMatch) : [];
      const unique = Array.from(new Map(normalized.map((m) => [m.Id, m])).values());
      setMatches(unique);
    } catch (err) {
      console.log("Error loading matches:", err);
    }
  };

  // Load favorites from storage
  const loadFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        // Load from API and hydrate with match details
        const favRecords: any[] = await getFavourites();
        const detailed: Match[] = (
          await Promise.all(
            favRecords.map(async (f: any) => {
              try {
                const data = await fetchMatchById(f.ItemId ?? f.itemId);
                return data ? normalizeMatch(data) : null;
              } catch {
                return null;
              }
            })
          )
        ).filter(Boolean) as Match[];
        const uniqueFavs = Array.from(new Map(detailed.map((m) => [m.Id, m])).values());
        setFavorites(uniqueFavs);
        await AsyncStorage.setItem("favorites", JSON.stringify(uniqueFavs)); // cache
        return;
      }

      // Fallback to local cache for guests
      const data = await AsyncStorage.getItem("favorites");
      if (data) {
        const parsed: Match[] = JSON.parse(data);
        const unique = Array.from(new Map(parsed.map((m) => [m.Id, m])).values());
        setFavorites(unique);
      }
    } catch (err: any) {
      // If unauthorized, fallback to local cache
      if (err?.response?.status === 401) {
        const data = await AsyncStorage.getItem("favorites");
        if (data) {
          const parsed: Match[] = JSON.parse(data);
          const unique = Array.from(new Map(parsed.map((m) => [m.Id, m])).values());
          setFavorites(unique);
        }
        return;
      }
      console.log("Error loading favorites:", err);
    }
  };

  // Add/remove favorite matches
  const toggleFavorite = async (match: Match) => {
    const matchId = (match as any)?.Id ?? (match as any)?.id;
    const exists = favorites.some((m) => m.Id === matchId);
    const token = await AsyncStorage.getItem("userToken");

    // Optimistic update
    const normalized = normalizeMatch(match);
    const updatedFavorites = exists
      ? favorites.filter((m) => m.Id !== matchId)
      : [...favorites, normalized];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    try {
      if (token) {
        if (exists) {
          await removeFavourite(matchId);
        } else {
          await addFavourite(matchId);
        }
      }
    } catch (err) {
      // Revert on failure
      console.log("Error syncing favourite:", err);
      setFavorites(favorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    }
  };

  return (
    <SportsContext.Provider value={{ matches, favorites, toggleFavorite }}>
      {children}
    </SportsContext.Provider>
  );
};

export const useSports = () => useContext(SportsContext)!;
