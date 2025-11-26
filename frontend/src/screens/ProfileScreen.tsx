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
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <ActivityIndicator size="large" color="#6C6CFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          {editing ? (
            <View style={styles.editFields}>
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={formData.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
                placeholder="First Name"
                autoFocus
              />
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={formData.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
                placeholder="Last Name"
              />
            </View>
          ) : (
            <Text style={styles.name}>
              {profile?.FirstName} {profile?.LastName}
            </Text>
          )}
          <Text style={styles.email}>{profile?.Email}</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
        >
          <Text style={styles.editButtonText}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        {editing && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditing(false);
              // Reset form to original values
              setFormData({
                firstName: profile?.FirstName || "",
                lastName: profile?.LastName || "",
              });
            }}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Favorites</Text>
        {favorites?.length === 0 ? (
          <Text style={styles.noFavorites}>No favorites yet</Text>
        ) : (
          <FlatList
            data={favorites as Match[]}
            keyExtractor={(item) => item.Id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MatchCard
                match={item}
                onPress={() => navigation.navigate("MatchDetails", { match: item })}
              />
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6C6CFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  editPhotoButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#6C6CFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  email: {
    color: "#666",
    fontSize: 16,
  },
  editFields: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  nameInput: {
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#6C6CFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
  section: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  noFavorites: {
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  signOutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff4444",
    alignItems: "center",
  },
  signOutText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
});