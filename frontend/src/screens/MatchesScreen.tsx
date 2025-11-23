import React from "react";
import { View, FlatList } from "react-native";
import MatchCard from "../components/MatchCard";
import { useSports } from "../context/SportsContext";

export default function MatchesScreen({ navigation }: any) {
  const { matches } = useSports();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={matches}
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
