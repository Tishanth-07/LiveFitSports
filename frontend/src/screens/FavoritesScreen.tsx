import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import MatchCard from "../components/MatchCard";
import { useSports } from "../context/SportsContext";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function FavoritesScreen({ navigation }: any) {
  const { favorites } = useSports();

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={["#FF6B35", "#FF8C61"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <MaterialIcons name="favorite" size={32} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Favorites</Text>
            <Text style={styles.headerSubtitle}>Your saved matches</Text>
          </View>
        </LinearGradient>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialIcons name="favorite-border" size={80} color="#FFB8A0" />
          </View>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start adding matches to your favorites to see them here
          </Text>
          <View style={styles.emptyHintBox}>
            <MaterialIcons name="info-outline" size={20} color="#FF6B35" />
            <Text style={styles.emptyHint}>
              Tap the heart icon on any match to add it to favorites
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#FF6B35", "#FF8C61"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <MaterialIcons name="favorite" size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favorites.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        keyExtractor={(item, index) =>
          String((item as any)?.Id ?? (item as any)?.id ?? index)
        }
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => navigation.navigate("MatchDetails", { match: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginLeft: 12,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginLeft: 44,
  },
  countBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  countText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "800",
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFF5F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyHintBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F2",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFE5DB",
  },
  emptyHint: {
    fontSize: 14,
    color: "#FF6B35",
    marginLeft: 12,
    flex: 1,
    fontWeight: "600",
    lineHeight: 20,
  },
});
