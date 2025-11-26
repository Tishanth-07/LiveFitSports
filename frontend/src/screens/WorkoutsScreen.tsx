import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Workout } from "../utils/types";
import { fetchWorkouts, API_BASE_URL } from "../services/api";

const WorkoutsScreen = ({ navigation }: any) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const toAbsolute = (url?: string) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const sep = url.startsWith("/") ? "" : "/";
    return `${API_BASE_URL}${sep}${url}`;
  };

  const normalize = (w: any): Workout => ({
    Id: w?.Id ?? w?.id,
    Title: w?.Title ?? w?.title,
    Description: w?.Description ?? w?.description,
    ImageUrl: toAbsolute(w?.ImageUrl ?? w?.imageUrl),
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Workout & Health Tips</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item, index) => String(item.Id ?? index)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("WorkoutDetails", { id: item.Id, workout: item })
            }
          >
            {item.ImageUrl && (
              <Image source={{ uri: item.ImageUrl }} style={styles.image} />
            )}
            <View style={styles.content}>
              <Text style={styles.title}>{item.Title}</Text>
              <Text style={styles.category}>{item.Category}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.Description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WorkoutsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  content: { flex: 1, padding: 8 },
  title: { fontSize: 16, fontWeight: "bold" },
  category: { fontSize: 12, color: "#666" },
  description: { fontSize: 14, color: "#333" },
});
