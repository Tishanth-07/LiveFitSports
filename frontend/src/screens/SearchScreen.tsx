import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, SectionList, StyleSheet } from "react-native";
import { fetchMatches, fetchWorkouts, fetchHealthTips } from "../services/api";
import { Match, Workout, HealthTip } from "../utils/types";
import MatchCard from "../components/MatchCard";

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
      const [m, w, t] = await Promise.all([fetchMatches(), fetchWorkouts(), fetchHealthTips()]);
      const filterText = (s?: string) => (s || "").toLowerCase().includes(normalizedText);
      const mm: Match[] = (Array.isArray(m) ? m : []).filter((x: any) => filterText(x?.Title || x?.title) || filterText(x?.Description || x?.description) || filterText(x?.Sport || x?.sport));
      const ww: Workout[] = (Array.isArray(w) ? w : []).filter((x: any) => filterText(x?.Title || x?.title) || filterText(x?.Description || x?.description));
      const tt: HealthTip[] = (Array.isArray(t) ? t : []).filter((x: any) => filterText(x?.Title || x?.title) || filterText(x?.Content || x?.content));
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
    <View style={{ flex: 1 }}>
      <View style={styles.searchBar}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search matches, workouts, tips"
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={performSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={performSearch}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>{loading ? "..." : "Search"}</Text>
        </TouchableOpacity>
      </View>
      <SectionList<SearchItem, SearchSection>
        sections={[
          ...(matches.length > 0
            ? [{ title: "Matches", key: "matches", data: matches.map((m) => ({ type: "match", value: m } as SearchItem)) }]
            : []),
          ...(workouts.length > 0
            ? [{ title: "Workouts", key: "workouts", data: workouts.map((w) => ({ type: "workout", value: w } as SearchItem)) }]
            : []),
          ...(tips.length > 0
            ? [{ title: "Health Tips", key: "tips", data: tips.map((t) => ({ type: "tip", value: t } as SearchItem)) }]
            : []),
        ]}
        keyExtractor={(item, index) => String(((item.value as any)?.Id ?? (item.value as any)?.id ?? index))}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.section, { paddingHorizontal: 16 }]}>{section.title as string}</Text>
        )}
        renderItem={({ item }) => {
          if (item.type === "match") {
            const match: Match = item.value as Match;
            return (
              <View style={{ paddingHorizontal: 16 }}>
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
                style={[styles.row, { marginHorizontal: 16 }]}
                onPress={() =>
                  navigation.navigate("WorkoutDetails", {
                    id: (workout as any)?.Id ?? (workout as any)?.id,
                    workout,
                  })
                }
              >
                {workout.ImageUrl ? (
                  <Image source={{ uri: workout.ImageUrl }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumb, { backgroundColor: "#ddd" }]} />
                )}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.title}>{workout.Title || "Workout"}</Text>
                  {workout.Description ? (
                    <Text numberOfLines={1} style={styles.sub}>
                      {workout.Description}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }
          const tip: HealthTip = item.value as HealthTip;
          return (
            <TouchableOpacity
              style={[styles.row, { marginHorizontal: 16 }]}
              onPress={() =>
                navigation.navigate("HealthTipDetails", {
                  id: (tip as any)?.Id ?? (tip as any)?.id,
                  tip,
                })
              }
            >
              {tip.ImageUrl ? (
                <Image source={{ uri: tip.ImageUrl }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, { backgroundColor: "#ddd" }]} />
              )}
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.title}>{tip.Title || "Health Tip"}</Text>
                {tip.Content ? (
                  <Text numberOfLines={1} style={styles.sub}>
                    {tip.Content}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          !loading && normalizedText ? (
            <Text style={{ padding: 16 }}>No results</Text>
          ) : null
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: "row", padding: 12, alignItems: "center" },
  input: { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 8, paddingHorizontal: 12, height: 42 },
  searchBtn: { marginLeft: 10, backgroundColor: "#6C6CFF", paddingHorizontal: 14, height: 42, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  section: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", padding: 10, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, alignItems: "center" },
  thumb: { width: 60, height: 60, borderRadius: 6 },
  title: { fontSize: 16, fontWeight: "600" },
  sub: { color: "#666", marginTop: 2 },
});
