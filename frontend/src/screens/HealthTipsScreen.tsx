import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { fetchHealthTips, API_BASE_URL } from "../services/api";
import { HealthTip } from "../utils/types";

export default function HealthTipsScreen({ navigation }: any) {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const toAbsolute = (url?: string) => {
    if (!url) return url;
    if (/^https?:\/\//i.test(url)) return url;
    const sep = url.startsWith("/") ? "" : "/";
    return `${API_BASE_URL}${sep}${url}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHealthTips();
        const list = Array.isArray(data)
          ? (data as any[]).map((t) => ({
              Id: t?.Id ?? t?.id,
              Title: t?.Title ?? t?.title,
              Content: t?.Content ?? t?.content,
              ImageUrl: toAbsolute(t?.ImageUrl ?? t?.imageUrl),
              CreatedAtUtc: t?.CreatedAtUtc ?? t?.createdAtUtc,
            }))
          : [];
        const unique = Array.from(new Map(list.map((t) => [t.Id, t])).values());
        setTips(unique as HealthTip[]);
      } catch (err) {
        console.error("Error loading health tips:", err);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health Tips</Text>
      <FlatList
        data={tips}
        keyExtractor={(item, index) => String(item.Id ?? index)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("HealthTipDetails", { id: item.Id, tip: item })
            }
          >
            {item.ImageUrl && (
              <Image source={{ uri: item.ImageUrl }} style={styles.image} />
            )}
            <View style={styles.content}>
              <Text style={styles.title}>{item.Title}</Text>
              {item.Content ? (
                <Text style={styles.description} numberOfLines={2}>
                  {item.Content}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

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
  description: { fontSize: 14, color: "#333" },
});
