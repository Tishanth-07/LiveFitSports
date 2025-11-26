import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { fetchWorkoutById, API_BASE_URL } from "../services/api";
import { Workout } from "../utils/types";

const WorkoutDetailsScreen = ({ route }: any) => {
  const { id, workout: initialWorkout } = route.params || {};
  const [workout, setWorkout] = useState<Workout | null>(initialWorkout || null);
  const [loading, setLoading] = useState(!initialWorkout);

  const toAbsolute = (url?: string) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const sep = url.startsWith("/") ? "" : "/";
    return `${API_BASE_URL}${sep}${url}`;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id || typeof id !== "string" || id.length !== 24) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchWorkoutById(id);
        if (mounted && data) {
          const normalized: Workout = {
            Id: (data as any)?.Id ?? (data as any)?.id,
            Title: (data as any)?.Title ?? (data as any)?.title,
            Description: (data as any)?.Description ?? (data as any)?.description,
            ImageUrl: toAbsolute((data as any)?.ImageUrl ?? (data as any)?.imageUrl),
            Category: (data as any)?.Category ?? (data as any)?.category,
            CreatedAtUtc: (data as any)?.CreatedAtUtc ?? (data as any)?.createdAtUtc,
          };
          setWorkout(normalized);
        }
      } catch (err) {
        console.error("Failed to load workout:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (!workout) return <Text style={styles.loading}>Workout not found</Text>;

  return (
    <ScrollView style={styles.container}>
      {workout.ImageUrl && (
        <Image source={{ uri: workout.ImageUrl }} style={styles.image} />
      )}
      <Text style={styles.title}>{workout.Title}</Text>
      {workout.Category && (
        <Text style={styles.category}>{workout.Category}</Text>
      )}
      {workout.Description && (
        <Text style={styles.description}>{workout.Description}</Text>
      )}
    </ScrollView>
  );
};

export default WorkoutDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  category: { fontSize: 14, color: "#666", marginBottom: 12 },
  description: { fontSize: 16, color: "#333" },
  loading: { marginTop: 50, textAlign: "center", fontSize: 18 },
});
