import React from "react";
import { View, Text, Image, ScrollView, Button } from "react-native";
import { useSports } from "../context/SportsContext";

export default function MatchDetailsScreen({ route }: any) {
  const { match } = route.params;
  const { favorites, toggleFavorite } = useSports();

  const isFav = favorites.some((m) => m.Id === match.Id);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {match.ImageUrl && (
        <Image
          source={{ uri: match.ImageUrl }}
          style={{ width: "100%", height: 220, borderRadius: 10 }}
        />
      )}

      <Text style={{ fontSize: 26, fontWeight: "700", marginTop: 10 }}>
        {match.Title}
      </Text>

      <Text style={{ fontSize: 18, color: "gray" }}>{match.Sport}</Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>{match.Description}</Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Status:{" "}
        <Text
          style={{
            color:
              match.Status === "Live"
                ? "red"
                : match.Status === "Completed"
                ? "green"
                : "gray",
          }}
        >
          {match.Status}
        </Text>
      </Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Starts at: {new Date(match.StartAtUtc).toLocaleString()}
      </Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Popularity: {match.Popularity ?? "N/A"}
      </Text>

      <Text style={{ marginTop: 10, fontSize: 16 }}>
        Teams: {match.Teams?.join(" vs ") || "N/A"}
      </Text>

      {/* Metadata */}
      {match.Metadata && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>More Info:</Text>
          {Object.entries(match.Metadata).map(([key, value]) => (
            <Text key={key} style={{ marginTop: 3 }}>
              {key}: {String(value)}
            </Text>
          ))}
        </View>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          onPress={() => toggleFavorite(match)}
        />
      </View>
    </ScrollView>
  );
}
