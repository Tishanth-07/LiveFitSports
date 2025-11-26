import React from "react";
import { View, FlatList, StyleSheet, Text, StatusBar } from "react-native";
import MatchCard from "../components/MatchCard";
import { useSports } from "../context/SportsContext";
import { LinearGradient } from "expo-linear-gradient";

export default function MatchesScreen({ navigation }: any) {
  const { matches } = useSports();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#35168a" />

      <LinearGradient
        colors={["#35168a", "#4a1fb8", "#35168a"]}
        style={styles.header}
      >
        <Text style={styles.heading}>Live Matches</Text>
        <Text style={styles.subheading}>Follow your favorite games</Text>
      </LinearGradient>

      <FlatList
        data={matches}
        keyExtractor={(item, index) =>
          String((item as any)?.Id ?? (item as any)?.id ?? index)
        }
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => navigation.navigate("MatchDetails", { match: item })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

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
});
