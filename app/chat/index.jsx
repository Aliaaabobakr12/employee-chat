import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { listenToConversations } from "../../utils/firebaseChatEmployee";
import { signOutEmployee } from "../../utils/firebaseEmployees";
import { useAuth } from "../context/AuthContext";

export default function ChatList() {
  const [hrUsers, setHRUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, initializing } = useAuth();

  const handleLogout = async () => {
    await signOutEmployee();
    router.replace("/signin");
  };

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/signin");
      return;
    }

    if (!user) return;

    const unsubscribe = listenToConversations((conversations) => {
      const userConversations = conversations.filter((conv) =>
        conv.participantIds.includes(user.uid),
      );
      setHRUsers(userConversations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, initializing, router]);

  const renderConversation = ({ item }) => {
    const otherParticipantName =
      item.participantNames.find(
        (_, index) => item.participantIds[index] !== user?.uid,
      ) || "HR Admin";

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => router.push(`/chat/${item.id}`)}
      >
        <View style={styles.conversationContent}>
          <Text style={styles.participantName}>{otherParticipantName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || "No messages yet"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Chats</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={hrUsers}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No active chats. Wait for HR to initiate a conversation.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  logoutButton: {
    padding: 8,
  },
  list: {
    flexGrow: 1,
  },
  conversationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  conversationContent: {
    gap: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
