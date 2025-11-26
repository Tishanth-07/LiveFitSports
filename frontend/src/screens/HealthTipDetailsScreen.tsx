import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { fetchHealthTipById, API_BASE_URL } from "../services/api";
import { HealthTip } from "../utils/types";

export default function HealthTipDetailsScreen({ route }: any) {
  const { id, tip: initialTip } = route.params || {};
  const [tip, setTip] = useState<HealthTip | null>(initialTip || null);
  const [loading, setLoading] = useState(!initialTip);

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
        const data = await fetchHealthTipById(id);
        if (mounted && data) {
          const normalized: HealthTip = {
            Id: (data as any)?.Id ?? (data as any)?.id,
            Title: (data as any)?.Title ?? (data as any)?.title,
            Content: (data as any)?.Content ?? (data as any)?.content,
            ImageUrl: toAbsolute((data as any)?.ImageUrl ?? (data as any)?.imageUrl),
            CreatedAtUtc: (data as any)?.CreatedAtUtc ?? (data as any)?.createdAtUtc,
          };
          setTip(normalized);
        }
      } catch (err) {
        console.error("Failed to load tip:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (!tip) return <Text style={styles.loading}>Tip not found</Text>;

  return (
    <ScrollView style={styles.container}>
      {tip.ImageUrl && <Image source={{ uri: tip.ImageUrl }} style={styles.image} />}
      <Text style={styles.title}>{tip.Title}</Text>
      {tip.Content ? <Text style={styles.content}>{tip.Content}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  content: { fontSize: 16, color: "#333" },
  loading: { marginTop: 50, textAlign: "center", fontSize: 18 },
});
