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
  Share,
} from "react-native";
import { fetchHealthTipById, API_BASE_URL } from "../services/api";
import { HealthTip } from "../utils/types";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HealthTipDetailsScreen({ route, navigation }: any) {
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this health tip: ${tip?.Title}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!tip) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Tip not found</Text>
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
          {tip.ImageUrl ? (
            <Image source={{ uri: tip.ImageUrl }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.placeholderHero]}>
              <Text style={styles.placeholderIcon}>💡</Text>
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', 'rgba(53, 22, 138, 0.8)', '#35168a']}
            style={styles.heroGradient}
          />

          {/* Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.actionIcon}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Text style={styles.actionIcon}>↗</Text>
            </TouchableOpacity>
          </View>

          {/* Tip Badge */}
          <View style={styles.floatingBadge}>
            <Text style={styles.badgeText}>Health Tip</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{tip.Title}</Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>Today</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaText}>3 min read</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>❤️</Text>
              <Text style={styles.metaText}>256 likes</Text>
            </View>
          </View>

          {/* Content */}
          {tip.Content && (
            <View style={styles.section}>
              <Text style={styles.content}>{tip.Content}</Text>
            </View>
          )}

          {/* Key Points */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Takeaways</Text>
            <View style={styles.keyPointsList}>
              {['Stay consistent with healthy habits', 'Listen to your body', 'Make gradual changes', 'Seek professional advice when needed'].map((point, index) => (
                <View key={index} style={styles.keyPointItem}>
                  <View style={styles.keyPointNumber}>
                    <Text style={styles.keyPointNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.keyPointText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.likeButton} activeOpacity={0.8}>
              <Text style={styles.likeIcon}>❤️</Text>
              <Text style={styles.likeText}>Like</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#4ecdc4', '#44a08d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                <Text style={styles.saveIcon}>🔖</Text>
                <Text style={styles.saveText}>Save Tip</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#35168a',
    fontWeight: '600',
  },
  heroContainer: {
    position: 'relative',
    height: height * 0.45,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  placeholderHero: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 80,
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  contentContainer: {
    backgroundColor: '#fff',
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
    color: '#1a1a1a',
    marginBottom: 20,
    letterSpacing: 0.3,
    lineHeight: 36,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 28,
  },
  keyPointsList: {
    marginTop: 8,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  keyPointNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#35168a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  keyPointNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  keyPointText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    paddingTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  likeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 16,
  },
  likeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  likeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  saveIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});


