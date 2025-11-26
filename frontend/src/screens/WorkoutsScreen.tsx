import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Workout } from "../utils/types";
import { fetchWorkouts } from "../services/api";
import { toAbsoluteUrl } from "../utils/urlUtils";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

const WorkoutsScreen = ({ navigation }: any) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const normalize = (w: any): Workout => ({
    Id: w?.Id ?? w?.id,
    Title: w?.Title ?? w?.title,
    Description: w?.Description ?? w?.description,
    ImageUrl: toAbsoluteUrl(w?.ImageUrl ?? w?.imageUrl),
    Category: w?.Category ?? w?.category,
    CreatedAtUtc: w?.CreatedAtUtc ?? w?.createdAtUtc,
  });

  useEffect(() => {
    (async () => {
      const data = await fetchWorkouts();
      const list = Array.isArray(data) ? (data as any[]).map(normalize) : [];
      const unique = Array.from(new Map(list.map((w) => [w.Id, w])).values());
      setWorkouts(unique as Workout[]);
    })();
  }, []);

  const renderItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("WorkoutDetails", { id: item.Id, workout: item })
      }
      activeOpacity={0.95}
    >
      <View style={styles.cardInner}>
        {item.ImageUrl ? (
          <Image source={{ uri: item.ImageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>🏋️</Text>
          </View>
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />

        <View style={styles.content}>
          {item.Category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.Category}</Text>
            </View>
          )}

          <Text style={styles.title} numberOfLines={2}>
            {item.Title}
          </Text>

          {item.Description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.Description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>⏱️ 30 min</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#35168a" />

      <LinearGradient
        colors={["#35168a", "#4a1fb8", "#35168a"]}
        style={styles.header}
      >
        <Text style={styles.heading}>Workouts</Text>
        <Text style={styles.subheading}>Transform your body & mind</Text>
      </LinearGradient>

      <FlatList
        data={workouts}
        keyExtractor={(item, index) => String(item.Id ?? index)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
      />
    </View>
  );
};

export default WorkoutsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: "#E0E0E0",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
    paddingTop: 24,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#35168a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardInner: {
    position: "relative",
    height: 400,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 60,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  categoryBadge: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: "#E0E0E0",
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
