import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Header from "../../componenets/Header";
import MessageBox from "../../componenets/MessageBox";
import MessageInput from "../../componenets/MessageInput";
import { listenToConversation } from "../../utils/firebaseChatEmployee";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { initializing, user } = useAuth();
  const params = useLocalSearchParams();
  const conversationId = params.id;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/signin");
      return;
    }
    if (!conversationId) {
      router.back();
      return;
    }
  }, [initializing, user, conversationId, router]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = listenToConversation(conversationId, (data) => {
      if (data) {
        setConversation(data.conversation);
        setMessages(data.messages);
        setLoading(false);
      }
    });

    return () => unsubscribe?.();
  }, [conversationId]);

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  console.log(user);

  if (initializing || !user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
  const renderMessage = ({ item }) => (
    <MessageBox
      key={item.id}
      currentUser={user.uid}
      message={item}
      currentMessageUserName={
        item.senderId === user.uid
          ? user.displayName
          : conversation?.participantNames.find(
              (name) => name !== user.displayName,
            )
      }
    />
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <Header
          title={`Chat with ${conversation?.participantNames.find(
            (name) => name !== user.displayName,
          )}`}
          showBackButton
          onBack={() => router.back()}
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          style={styles.messagesList}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
        />

        <MessageInput conversationId={conversationId} currentUser={user.uid} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messagesList: {
    paddingTop: Platform.OS === "ios" ? 90 : 70,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
