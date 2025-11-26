import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  SectionList,
  StyleSheet,
} from "react-native";
import { fetchMatches, fetchWorkouts, fetchHealthTips } from "../services/api";
import { Match, Workout, HealthTip } from "../utils/types";
import MatchCard from "../components/MatchCard";
import { MaterialIcons } from "@expo/vector-icons";

type SearchItem =
  | { type: "match"; value: Match }
  | { type: "workout"; value: Workout }
  | { type: "tip"; value: HealthTip };

type SearchSection = { title: string; key: string; data: SearchItem[] };

export default function SearchScreen({ navigation }: any) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [tips, setTips] = useState<HealthTip[]>([]);
  const timer = useRef<any>(null);

  const normalizedText = useMemo(() => q.trim().toLowerCase(), [q]);

  const performSearch = async () => {
    if (!normalizedText) {
      setMatches([]);
      setWorkouts([]);
      setTips([]);
      return;
    }
    setLoading(true);
    try {
      const [m, w, t] = await Promise.all([
        fetchMatches(),
        fetchWorkouts(),
        fetchHealthTips(),
      ]);
      const filterText = (s?: string) =>
        (s || "").toLowerCase().includes(normalizedText);
      const mm: Match[] = (Array.isArray(m) ? m : []).filter(
        (x: any) =>
          filterText(x?.Title || x?.title) ||
          filterText(x?.Description || x?.description) ||
          filterText(x?.Sport || x?.sport)
      );
      const ww: Workout[] = (Array.isArray(w) ? w : []).filter(
        (x: any) =>
          filterText(x?.Title || x?.title) ||
          filterText(x?.Description || x?.description)
      );
      const tt: HealthTip[] = (Array.isArray(t) ? t : []).filter(
        (x: any) =>
          filterText(x?.Title || x?.title) ||
          filterText(x?.Content || x?.content)
      );
      setMatches(mm);
      setWorkouts(ww);
      setTips(tt);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(performSearch, 300);
    return () => timer.current && clearTimeout(timer.current);
  }, [normalizedText]);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <MaterialIcons
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search matches, workouts, tips..."
            placeholderTextColor="#999"
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={performSearch}
          />
          {q.length > 0 && (
            <TouchableOpacity
              onPress={() => setQ("")}
              style={styles.clearButton}
            >
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {loading && (
          <View style={styles.loadingBar}>
            <View style={styles.loadingIndicator} />
          </View>
        )}
      </View>

      <SectionList<SearchItem, SearchSection>
        sections={[
          ...(matches.length > 0
            ? [
                {
                  title: "🏆 Matches",
                  key: "matches",
                  data: matches.map(
                    (m) => ({ type: "match", value: m }) as SearchItem
                  ),
                },
              ]
            : []),
          ...(workouts.length > 0
            ? [
                {
                  title: "💪 Workouts",
                  key: "workouts",
                  data: workouts.map(
                    (w) => ({ type: "workout", value: w }) as SearchItem
                  ),
                },
              ]
            : []),
          ...(tips.length > 0
            ? [
                {
                  title: "💡 Health Tips",
                  key: "tips",
                  data: tips.map(
                    (t) => ({ type: "tip", value: t }) as SearchItem
                  ),
                },
              ]
            : []),
        ]}
        keyExtractor={(item, index) =>
          String((item.value as any)?.Id ?? (item.value as any)?.id ?? index)
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title as string}</Text>
            <View style={styles.sectionCount}>
              <Text style={styles.sectionCountText}>{section.data.length}</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => {
          if (item.type === "match") {
            const match: Match = item.value as Match;
            return (
              <View style={styles.matchCardContainer}>
                <MatchCard
                  match={match}
                  onPress={() => navigation.navigate("MatchDetails", { match })}
                />
              </View>
            );
          }
          if (item.type === "workout") {
            const workout: Workout = item.value as Workout;
            return (
              <TouchableOpacity
                style={styles.resultCard}
                onPress={() =>
                  navigation.navigate("WorkoutDetails", {
                    id: (workout as any)?.Id ?? (workout as any)?.id,
                    workout,
                  })
                }
                activeOpacity={0.9}
              >
                <View style={styles.resultImageContainer}>
                  {workout.ImageUrl ? (
                    <Image
                      source={{ uri: workout.ImageUrl }}
                      style={styles.resultImage}
                    />
                  ) : (
                    <View style={[styles.resultImage, styles.placeholderImage]}>
                      <Text style={styles.placeholderEmoji}>💪</Text>
                    </View>
                  )}
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultTitle} numberOfLines={2}>
                    {workout.Title || "Workout"}
                  </Text>
                  {workout.Category && (
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {workout.Category}
                      </Text>
                    </View>
                  )}
                  {workout.Description ? (
                    <Text numberOfLines={2} style={styles.resultDescription}>
                      {workout.Description}
                    </Text>
                  ) : null}
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color="#35168aff"
                />
              </TouchableOpacity>
            );
          }
          const tip: HealthTip = item.value as HealthTip;
          return (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() =>
                navigation.navigate("HealthTipDetails", {
                  id: (tip as any)?.Id ?? (tip as any)?.id,
                  tip,
                })
              }
              activeOpacity={0.9}
            >
              <View style={styles.resultImageContainer}>
                {tip.ImageUrl ? (
                  <Image
                    source={{ uri: tip.ImageUrl }}
                    style={styles.resultImage}
                  />
                ) : (
                  <View style={[styles.resultImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderEmoji}>💡</Text>
                  </View>
                )}
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultTitle} numberOfLines={2}>
                  {tip.Title || "Health Tip"}
                </Text>
                {tip.Content ? (
                  <Text numberOfLines={2} style={styles.resultDescription}>
                    {tip.Content}
                  </Text>
                ) : null}
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#35168aff" />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() =>
          !loading && normalizedText ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching with different keywords
              </Text>
            </View>
          ) : !normalizedText ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👋</Text>
              <Text style={styles.emptyTitle}>Start Searching</Text>
              <Text style={styles.emptySubtitle}>
                Find matches, workouts, and health tips
              </Text>
            </View>
          ) : null
        }
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
  searchHeader: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  loadingBar: {
    height: 3,
    backgroundColor: "#F0F0F0",
    marginTop: 12,
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingIndicator: {
    height: "100%",
    width: "30%",
    backgroundColor: "#35168aff",
    borderRadius: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sectionCount: {
    backgroundColor: "#35168aff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  matchCardContainer: {
    paddingHorizontal: 16,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  resultImageContainer: {
    marginRight: 12,
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE5DB",
  },
  placeholderEmoji: {
    fontSize: 30,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 22,
  },
  categoryBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  resultDescription: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
