import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSports } from "../context/SportsContext";
import { toAbsoluteUrl } from "../utils/urlUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function MatchDetailsScreen({ route }: any) {
  const { match } = route.params;
  const { favorites, toggleFavorite } = useSports();

  const isFav = favorites.some((m) => m.Id === match.Id);

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image with Gradient Overlay */}
      <View style={styles.imageContainer}>
        {match.ImageUrl ? (
          <Image
            source={{ uri: toAbsoluteUrl(match.ImageUrl) }}
            style={styles.headerImage}
            resizeMode="cover"
            onError={(e) =>
              console.log("Error loading image:", e.nativeEvent.error)
            }
          />
        ) : (
          <View style={[styles.headerImage, styles.placeholderImage]}>
            <Text style={styles.placeholderEmoji}>⚽</Text>
          </View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.imageGradient}
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(match)}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name={isFav ? "favorite" : "favorite-border"}
            size={28}
            color={isFav ? "#FF3B30" : "#FFFFFF"}
          />
        </TouchableOpacity>

        {/* Status Badge */}
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{match.Status}</Text>
        </View>
      </View>

      {/* Content Card */}
      <View style={styles.contentCard}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{match.Title}</Text>
          <View style={styles.sportBadge}>
            <MaterialIcons name="sports" size={16} color="#35168aff" />
            <Text style={styles.sportText}>{match.Sport}</Text>
          </View>
        </View>

        {/* Teams Section */}
        {match.Teams && match.Teams.length > 0 && (
          <View style={styles.teamsSection}>
            <Text style={styles.sectionLabel}>Teams</Text>
            <View style={styles.teamsContainer}>
              <View style={styles.teamBox}>
                <Text style={styles.teamName}>{match.Teams[0]}</Text>
              </View>
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              <View style={styles.teamBox}>
                <Text style={styles.teamName}>{match.Teams[1] || "TBD"}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          {/* Date & Time Card */}
          <View style={styles.infoCard}>
            <MaterialIcons name="calendar-today" size={24} color="#35168aff" />
            <Text style={styles.infoLabel}>Date & Time</Text>
            <Text style={styles.infoValue}>
              {new Date(match.StartAtUtc).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.infoSubvalue}>
              {new Date(match.StartAtUtc).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Popularity Card */}
          {match.Popularity && (
            <View style={styles.infoCard}>
              <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.infoLabel}>Popularity</Text>
              <Text style={styles.infoValue}>{match.Popularity}</Text>
              <Text style={styles.infoSubvalue}>viewers</Text>
            </View>
          )}
        </View>

        {/* Description Section */}
        {match.Description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>About This Match</Text>
            <Text style={styles.description}>{match.Description}</Text>
          </View>
        )}

        {/* Metadata Section */}
        {match.Metadata && Object.keys(match.Metadata).length > 0 && (
          <View style={styles.metadataSection}>
            <Text style={styles.sectionLabel}>Additional Information</Text>
            <View style={styles.metadataGrid}>
              {Object.entries(match.Metadata).map(([key, value]) => (
                <View key={key} style={styles.metadataItem}>
                  <Text style={styles.metadataKey}>{key}</Text>
                  <Text style={styles.metadataValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 320,
  },
  headerImage: {
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
    fontSize: 80,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  favoriteButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusBadge: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
    lineHeight: 36,
  },
  sportBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  sportText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#35168aff",
    marginLeft: 6,
  },
  teamsSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamBox: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  vsContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#35168aff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    shadowColor: "#35168aff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  vsText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999999",
    marginTop: 8,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 4,
    textAlign: "center",
  },
  infoSubvalue: {
    fontSize: 13,
    color: "#666666",
    marginTop: 2,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
  metadataSection: {
    marginBottom: 24,
  },
  metadataGrid: {
    gap: 12,
  },
  metadataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
  },
  metadataKey: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    flex: 1,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "right",
  },
});
