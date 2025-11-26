import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Match } from "../utils/types";
import { toAbsoluteUrl } from "../utils/urlUtils";
import { LinearGradient } from "expo-linear-gradient";

export default function MatchCard({
  match,
  onPress,
}: {
  match: Match;
  onPress: () => void;
}) {
  const getStatusColor = () => {
    switch (match.Status) {
      case "Live":
        return "#FF3B30";
      case "Completed":
        return "#4CAF50";
      case "Upcoming":
        return "#FF9500";
      default:
        return "#999999";
    }
  };

  const getStatusIcon = () => {
    switch (match.Status) {
      case "Live":
        return "📡";
      case "Completed":
        return "✅";
      case "Upcoming":
        return "📅";
      default:
        return "ℹ️";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {match.ImageUrl ? (
            <Image
              source={{ uri: toAbsoluteUrl(match.ImageUrl) }}
              style={styles.image}
              onError={(e) =>
                console.log("Error loading image:", e.nativeEvent.error)
              }
            />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderEmoji}>⚽</Text>
            </View>
          )}

          {/* Status Badge */}
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
            <Text style={styles.statusText}>{match.Status}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.sportBadge}>
              <Text style={styles.sportText}>{match.Sport || "Sport"}</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#35168aff" />
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {match.Title || "Untitled Match"}
          </Text>

          {/* Teams */}
          {match.Teams && match.Teams.length > 0 && (
            <View style={styles.teamsContainer}>
              <Text style={styles.teamsText} numberOfLines={1}>
                {match.Teams.join(" 🆚 ")}
              </Text>
            </View>
          )}

          {/* Date & Time */}
          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Feather name="calendar" size={14} color="#666" />
              <Text style={styles.dateText}>
                {new Date(match.StartAtUtc).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Feather name="clock" size={14} color="#666" />
              <Text style={styles.timeText}>
                {new Date(match.StartAtUtc).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
  },
  placeholderImage: {
    backgroundColor: "#FFE5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 50,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sportBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sportText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    lineHeight: 24,
  },
  teamsContainer: {
    backgroundColor: "#FFF5F2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  teamsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#35168aff",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 6,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 6,
    fontWeight: "500",
  },
});
