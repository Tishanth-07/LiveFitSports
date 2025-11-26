import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { useSports } from "../context/SportsContext";
import { fetchWorkouts, fetchHealthTips } from "../services/api";
import { Workout, HealthTip } from "../utils/types";
import MatchCard from "../components/MatchCard";
import { toAbsoluteUrl } from "../utils/urlUtils";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }: any) {
  const { matches } = useSports();
  const [tab, setTab] = useState<"matches" | "tips" | "workouts">("matches");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [tips, setTips] = useState<HealthTip[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [w, t] = await Promise.all([fetchWorkouts(), fetchHealthTips()]);

        const normalizeWorkout = (raw: any): Workout => ({
          Id: raw?.Id ?? raw?.id,
          Title: raw?.Title ?? raw?.title,
          Description: raw?.Description ?? raw?.description,
          ImageUrl: toAbsoluteUrl(raw?.ImageUrl ?? raw?.imageUrl),
          Category: raw?.Category ?? raw?.category,
          CreatedAtUtc: raw?.CreatedAtUtc ?? raw?.createdAtUtc,
        });

        const normalizeTip = (raw: any): HealthTip => ({
          Id: raw?.Id ?? raw?.id,
          Title: raw?.Title ?? raw?.title,
          Content: raw?.Content ?? raw?.content,
          ImageUrl: toAbsoluteUrl(raw?.ImageUrl ?? raw?.imageUrl),
          CreatedAtUtc: raw?.CreatedAtUtc ?? raw?.createdAtUtc,
        });

        const wList = Array.isArray(w)
          ? (w as any[]).map(normalizeWorkout)
          : [];
        const tList = Array.isArray(t) ? (t as any[]).map(normalizeTip) : [];

        const uniqueWorkouts = Array.from(
          new Map(wList.map((item) => [item.Id, item])).values()
        ) as Workout[];
        const uniqueTips = Array.from(
          new Map(tList.map((item) => [item.Id, item])).values()
        ) as HealthTip[];

        setWorkouts(uniqueWorkouts);
        setTips(uniqueTips);
      } catch {}
    })();
  }, []);

  const TabButton = ({
    id,
    label,
  }: {
    id: "matches" | "tips" | "workouts";
    label: string;
  }) => (
    <TouchableOpacity
      style={[styles.tabBtn, tab === id && styles.tabBtnActive]}
      onPress={() => setTab(id)}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>
        {label}
      </Text>
      {tab === id && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#35168aff", "#8574b4ff"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>LiveFit Sports</Text>
        <Text style={styles.headerSubtitle}>Stay Active, Stay Updated</Text>
      </LinearGradient>

      {/* Tab Bar */}
      <View style={styles.topBar}>
        <TabButton id="matches" label="🏆 Matches" />
        <TabButton id="tips" label="💡 Tips" />
        <TabButton id="workouts" label="💪 Workouts" />
      </View>

      {/* Matches Tab */}
      {tab === "matches" && (
        <View style={styles.contentContainer}>
          <FlatList
            data={matches}
            keyExtractor={(item, index) =>
              String((item as any)?.Id ?? (item as any)?.id ?? index)
            }
            renderItem={({ item }) => (
              <MatchCard
                match={item}
                onPress={() =>
                  navigation.navigate("MatchDetails", { match: item })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}

      {/* Health Tips Tab */}
      {tab === "tips" && (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tips.map((item, idx) => (
            <TouchableOpacity
              key={String(item.Id ?? idx)}
              style={styles.card}
              onPress={() =>
                navigation.navigate("HealthTipDetails", {
                  id: (item as any)?.Id ?? (item as any)?.id,
                  tip: item,
                })
              }
              activeOpacity={0.9}
            >
              <View style={styles.cardImageContainer}>
                {item.ImageUrl ? (
                  <Image
                    source={{ uri: toAbsoluteUrl(item.ImageUrl) }}
                    style={styles.cardImage}
                  />
                ) : (
                  <View style={[styles.cardImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>💡</Text>
                  </View>
                )}
                <LinearGradient
                  colors={["transparent", "rgba(0, 0, 0, 0.36)"]}
                  style={styles.imageGradient}
                />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>Health Tip</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.Title}
                </Text>
                {item.Content ? (
                  <Text style={styles.cardDesc} numberOfLines={3}>
                    {item.Content}
                  </Text>
                ) : null}
                <View style={styles.cardFooter}>
                  <Text style={styles.readMore}>Read More →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Workouts Tab */}
      {tab === "workouts" && (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {workouts.map((item, idx) => (
            <TouchableOpacity
              key={String(item.Id ?? idx)}
              style={styles.card}
              onPress={() =>
                navigation.navigate("WorkoutDetails", {
                  id: (item as any)?.Id ?? (item as any)?.id,
                  workout: item,
                })
              }
              activeOpacity={0.9}
            >
              <View style={styles.cardImageContainer}>
                {item.ImageUrl ? (
                  <Image
                    source={{ uri: toAbsoluteUrl(item.ImageUrl) }}
                    style={styles.cardImage}
                  />
                ) : (
                  <View style={[styles.cardImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>💪</Text>
                  </View>
                )}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={styles.imageGradient}
                />
              </View>
              <View style={styles.cardBody}>
                <View style={[styles.categoryBadge, styles.workoutBadge]}>
                  <Text style={styles.categoryText}>
                    {item.Category || "Workout"}
                  </Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.Title}
                </Text>
                {item.Description ? (
                  <Text style={styles.cardDesc} numberOfLines={3}>
                    {item.Description}
                  </Text>
                ) : null}
                <View style={styles.cardFooter}>
                  <Text style={styles.readMore}>Start Workout →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#35168aff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#ffffffff",
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    position: "relative",
  },
  tabBtnActive: {
    backgroundColor: "#FFF5F2",
  },
  tabText: {
    color: "#666666ff",
    fontWeight: "600",
    fontSize: 13,
  },
  tabTextActive: {
    color: "#35168aff",
    fontWeight: "700",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 3,
    backgroundColor: "#35168aff",
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#ffffffff",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: 220,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0ff",
  },
  placeholderImage: {
    backgroundColor: "#dfdbffff",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 60,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  cardBody: {
    padding: 16,
  },
  categoryBadge: {
    backgroundColor: "#35168aff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  workoutBadge: {
    backgroundColor: "#4CAF50",
  },
  categoryText: {
    color: "#ffffffff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
    lineHeight: 26,
  },
  cardDesc: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
  },
  readMore: {
    color: "#35168aff",
    fontSize: 14,
    fontWeight: "600",
  },
});
