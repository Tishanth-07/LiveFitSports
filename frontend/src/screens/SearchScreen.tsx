import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet } from "react-native";
import { fetchMatches, fetchWorkouts, fetchHealthTips } from "../services/api";
import { Match, Workout, HealthTip } from "../utils/types";
import MatchCard from "../components/MatchCard";

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

  const renderWorkout = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate("WorkoutDetails", { id: (item as any)?.Id ?? (item as any)?.id, workout: item })}
    >
      {item.ImageUrl ? (
        <Image source={{ uri: item.ImageUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: "#ddd" }]} />
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>{item.Title || "Workout"}</Text>
        {item.Description ? (
          <Text numberOfLines={1} style={styles.sub}>{item.Description}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderTip = ({ item }: { item: HealthTip }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate("HealthTipDetails", { id: (item as any)?.Id ?? (item as any)?.id, tip: item })}
    >
      {item.ImageUrl ? (
        <Image source={{ uri: item.ImageUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: "#ddd" }]} />
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>{item.Title || "Health Tip"}</Text>
        {item.Content ? (
          <Text numberOfLines={1} style={styles.sub}>{item.Content}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {matches.length > 0 ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.section}>Matches</Text>
            <FlatList
              data={matches}
              keyExtractor={(item, index) => String((item as any)?.Id ?? (item as any)?.id ?? index)}
              renderItem={({ item }) => (
                <MatchCard match={item} onPress={() => navigation.navigate("MatchDetails", { match: item })} />
              )}
            />
          </View>
        ) : null}
        {workouts.length > 0 ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.section}>Workouts</Text>
            <FlatList
              data={workouts}
              keyExtractor={(item, index) => String((item as any)?.Id ?? (item as any)?.id ?? index)}
              renderItem={renderWorkout}
            />
          </View>
        ) : null}
        {tips.length > 0 ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.section}>Health Tips</Text>
            <FlatList
              data={tips}
              keyExtractor={(item, index) => String((item as any)?.Id ?? (item as any)?.id ?? index)}
              renderItem={renderTip}
            />
          </View>
        ) : null}
        {!loading && normalizedText && matches.length === 0 && workouts.length === 0 && tips.length === 0 ? (
          <Text>No results</Text>
        ) : null}
      </ScrollView>
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
