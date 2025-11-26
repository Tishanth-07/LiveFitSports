import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView } from "react-native";
import { useSports } from "../context/SportsContext";
import { fetchWorkouts, fetchHealthTips } from "../services/api";
import { Workout, HealthTip } from "../utils/types";
import MatchCard from "../components/MatchCard";

export default function HomeScreen({ navigation }: any) {
  const { matches } = useSports();
  const [tab, setTab] = useState<"matches" | "tips" | "workouts">("matches");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [tips, setTips] = useState<HealthTip[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [w, t] = await Promise.all([fetchWorkouts(), fetchHealthTips()]);
        setWorkouts(Array.isArray(w) ? (w as any[]) as Workout[] : []);
        setTips(Array.isArray(t) ? (t as any[]) as HealthTip[] : []);
      } catch {}
    })();
  }, []);

  const TabButton = ({ id, label }: { id: "matches" | "tips" | "workouts"; label: string }) => (
    <TouchableOpacity
      style={[styles.tabBtn, tab === id && styles.tabBtnActive]}
      onPress={() => setTab(id)}
    >
      <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.topBar}>
        <TabButton id="matches" label="Matches" />
        <TabButton id="tips" label="Health Tips" />
        <TabButton id="workouts" label="Workouts" />
      </View>

      {tab === "matches" && (
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
      )}

      {tab === "tips" && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {tips.map((item, idx) => (
            <TouchableOpacity
              key={String(item.Id ?? idx)}
              style={styles.card}
              onPress={() => navigation.navigate("HealthTipDetails", { id: (item as any)?.Id ?? (item as any)?.id, tip: item })}
            >
              {item.ImageUrl ? (
                <Image source={{ uri: item.ImageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, { backgroundColor: "#eee" }]} />
              )}
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.Title}</Text>
                {item.Content ? (
                  <Text style={styles.desc} numberOfLines={2}>{item.Content}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {tab === "workouts" && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {workouts.map((item, idx) => (
            <TouchableOpacity
              key={String(item.Id ?? idx)}
              style={styles.card}
              onPress={() => navigation.navigate("WorkoutDetails", { id: (item as any)?.Id ?? (item as any)?.id, workout: item })}
            >
              {item.ImageUrl ? (
                <Image source={{ uri: item.ImageUrl }} style={styles.image} />
              ) : (
                <View style={[styles.image, { backgroundColor: "#eee" }]} />
              )}
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.Title}</Text>
                {item.Description ? (
                  <Text style={styles.desc} numberOfLines={2}>{item.Description}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Profile */}
      {/* Matches */}
      {/* Favorites */}
      {/* Workout Tips */}
      {/* Health Tips */}
      {/* Logout */}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  tabBtnActive: {
    backgroundColor: "#6C6CFF",
  },
  tabText: {
    color: "#333",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 1,
  },
  image: { width: 80, height: 80 },
  cardBody: { flex: 1, padding: 10 },
  title: { fontSize: 16, fontWeight: "700" },
  desc: { color: "#555", marginTop: 4 },
});
