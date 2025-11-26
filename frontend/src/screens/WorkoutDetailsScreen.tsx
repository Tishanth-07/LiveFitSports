import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { fetchWorkoutById, API_BASE_URL } from "../services/api";
import { Workout } from "../utils/types";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const WorkoutDetailsScreen = ({ route, navigation }: any) => {
  const { id, workout: initialWorkout } = route.params || {};
  const [workout, setWorkout] = useState<Workout | null>(
    initialWorkout || null
  );
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
            Description:
              (data as any)?.Description ?? (data as any)?.description,
            ImageUrl: toAbsolute(
              (data as any)?.ImageUrl ?? (data as any)?.imageUrl
            ),
            Category: (data as any)?.Category ?? (data as any)?.category,
            CreatedAtUtc:
              (data as any)?.CreatedAtUtc ?? (data as any)?.createdAtUtc,
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Workout not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#35168a" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {workout.ImageUrl ? (
            <Image
              source={{ uri: workout.ImageUrl }}
              style={styles.heroImage}
            />
          ) : (
            <View style={[styles.heroImage, styles.placeholderHero]}>
              <Text style={styles.placeholderIcon}>🏋️</Text>
            </View>
          )}

          <LinearGradient
            colors={["transparent", "rgba(53, 22, 138, 0.8)", "#35168a"]}
            style={styles.heroGradient}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Category Badge */}
          {workout.Category && (
            <View style={styles.floatingBadge}>
              <Text style={styles.badgeText}>{workout.Category}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{workout.Title}</Text>

          {/* Info Cards */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>⏱️</Text>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>30 min</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🔥</Text>
              <Text style={styles.infoLabel}>Calories</Text>
              <Text style={styles.infoValue}>250 kcal</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>💪</Text>
              <Text style={styles.infoLabel}>Level</Text>
              <Text style={styles.infoValue}>Medium</Text>
            </View>
          </View>

          {/* Description */}
          {workout.Description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About This Workout</Text>
              <Text style={styles.description}>{workout.Description}</Text>
            </View>
          )}

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsList}>
              {[
                "Improves strength",
                "Boosts endurance",
                "Burns calories",
                "Enhances flexibility",
              ].map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
            <LinearGradient
              colors={["#391a90ff", "#582ecbff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startGradient}
            >
              <Text style={styles.startText}>Start Workout</Text>
              <Text style={styles.startArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkoutDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#35168a",
    fontWeight: "600",
  },
  heroContainer: {
    position: "relative",
    height: height * 0.5,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  placeholderHero: {
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: 80,
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  floatingBadge: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#6741cdff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  infoIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#35168a",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 26,
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5a2dd7ff",
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: "#666",
  },
  startButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#5022ceff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  startArrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
