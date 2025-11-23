import React from "react";
import { View, FlatList, Text } from "react-native";
import MatchCard from "../components/MatchCard";
import { useSports } from "../context/SportsContext";

export default function FavoritesScreen({ navigation }: any) {
  const { favorites } = useSports();

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18 }}>No favorite matches yet</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => String((item as any)?.Id ?? (item as any)?.id ?? index)}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => navigation.navigate("MatchDetails", { match: item })}
          />
        )}
      />
    </View>
  );
}
