import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Match } from "../utils/types";
import { toAbsoluteUrl } from "../utils/urlUtils";

export default function MatchCard({
  match,
  onPress,
}: {
  match: Match;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
      }}
    >
      {match.ImageUrl ? (
        <Image
          source={{ uri: toAbsoluteUrl(match.ImageUrl) }}
          style={{ width: 80, height: 80, borderRadius: 8 }}
          onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
        />
      ) : (
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: "#ddd",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No Image</Text>
        </View>
      )}

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>
          {match.Title || "Untitled Match"}
        </Text>

        <Text style={{ color: "gray" }}>{match.Sport || "Unknown Sport"}</Text>

        <Text style={{ marginTop: 4 }}>
          {new Date(match.StartAtUtc).toLocaleString()}
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: match.Status === "Live" ? "red" : "gray",
          }}
        >
          {match.Status}
        </Text>
      </View>

      <Feather name="chevron-right" size={24} />
    </TouchableOpacity>
  );
}
