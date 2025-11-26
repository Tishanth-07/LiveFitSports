import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchProfile,
  updateProfile,
  uploadAvatar,
  getFavourites,
  API_BASE_URL,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSports } from "../context/SportsContext";
import MatchCard from "../components/MatchCard";
import { Match } from "../utils/types";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [uploading, setUploading] = useState(false);
  const { signOut } = useAuth();
  const { favorites } = useSports();

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const toAbsolute = (url?: string | null) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    const sep = url.startsWith("/") ? "" : "/";
    return `${API_BASE_URL}${sep}${url}`;
  };

  const normalizeUser = (u: any) => ({
    Id: u?.Id ?? u?.id,
    FirstName: u?.FirstName ?? u?.firstName ?? "",
    LastName: u?.LastName ?? u?.lastName ?? "",
    Email: u?.Email ?? u?.email ?? "",
    AvatarUrl: u?.AvatarUrl ?? u?.avatarUrl ?? undefined,
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await fetchProfile();
      const normalized = normalizeUser(data);
      setProfile(normalized);
      setFormData({
        firstName: normalized.FirstName || "",
        lastName: normalized.LastName || "",
      });
    } catch (err) {
      console.error("loadProfile", err);
      Alert.alert("Error", "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert("Error", "First name and last name are required");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile({
        FirstName: formData.firstName.trim(),
        LastName: formData.lastName.trim(),
      });
      const normalized = normalizeUser(updated);
      setProfile((p: any) => ({ ...p, ...normalized }));
      setEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      console.error("updateProfile", err);
      Alert.alert("Error", "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const pickImageAndUpload = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    const selectedUri = (result as any).assets?.[0]?.uri;
    if (!selectedUri) {
      Alert.alert("Error", "No image selected");
      return;
    }

    setUploading(true);
    try {
      const uriParts = selectedUri.split("/");
      const fileName = uriParts[uriParts.length - 1];
      const res = await uploadAvatar(selectedUri, fileName);
      setProfile((p: any) => ({
        ...p,
        AvatarUrl: res.avatarUrl || res.AvatarUrl,
      }));
      Alert.alert("Success", "Profile picture updated");
    } catch (err) {
      console.error("uploadAvatar", err);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#35168aff" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#0e0428ff", "#815ee1ff"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {profile?.AvatarUrl ? (
              <Image
                source={{ uri: toAbsolute(profile.AvatarUrl) }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {profile?.FirstName?.[0] || "U"}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={pickImageAndUpload}
              disabled={uploading}
            >
              <MaterialIcons
                name={uploading ? "hourglass-empty" : "camera-alt"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="#35168aff" />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Profile Info Card */}
      <View style={styles.profileCard}>
        <View style={styles.nameContainer}>
          {editing ? (
            <View style={styles.editFields}>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
                placeholder="First Name"
                placeholderTextColor="#999"
                autoFocus
              />
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
                placeholder="Last Name"
                placeholderTextColor="#999"
              />
            </View>
          ) : (
            <View style={styles.nameDisplay}>
              <Text style={styles.name}>
                {profile?.FirstName} {profile?.LastName}
              </Text>
              <View style={styles.emailContainer}>
                <MaterialIcons name="email" size={16} color="#666" />
                <Text style={styles.email}>{profile?.Email}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.editButton, editing && styles.saveButton]}
            onPress={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons
                  name={editing ? "check" : "edit"}
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.editButtonText}>
                  {editing ? "Save Changes" : "Edit Profile"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {editing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditing(false);
                setFormData({
                  firstName: profile?.FirstName || "",
                  lastName: profile?.LastName || "",
                });
              }}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Favorites Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="favorite" size={24} color="#e30e27ff" />
          <Text style={styles.sectionTitle}>Your Favorites</Text>
          <View style={styles.favoritesCount}>
            <Text style={styles.favoritesCountText}>
              {favorites?.length || 0}
            </Text>
          </View>
        </View>

        {favorites?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>💔</Text>
            <Text style={styles.emptyStateText}>No favorites yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start adding matches to your favorites
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.favoritesScroll}
          >
            {favorites.map((item: Match) => (
              <View key={item.Id} style={styles.favoriteCard}>
                <MatchCard
                  match={item}
                  onPress={() =>
                    navigation.navigate("MatchDetails", { match: item })
                  }
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={signOut}
        activeOpacity={0.8}
      >
        <MaterialIcons name="logout" size={20} color="#35168aff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0F0F0",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    color: "#35168aff",
    fontSize: 48,
    fontWeight: "800",
  },
  editPhotoButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#35168aff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginTop: -50,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameDisplay: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  email: {
    color: "#666",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  editFields: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
  },
  buttonGroup: {
    gap: 12,
  },
  editButton: {
    backgroundColor: "#35168aff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#35168aff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#ffffffff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 8,
    flex: 1,
  },
  favoritesCount: {
    backgroundColor: "#FFE5DB",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  favoritesCountText: {
    color: "#35168aff",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
  },
  favoritesScroll: {
    paddingRight: 20,
  },
  favoriteCard: {
    marginRight: 12,
    width: 280,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#35168aff",
    shadowColor: "#35168aff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    color: "#35168aff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
