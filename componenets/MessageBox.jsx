import { StyleSheet, Text, View } from "react-native";

const Avatar = ({ children }) => <View style={styles.avatar}>{children}</View>;

const AvatarFallback = ({ children }) => (
  <Text style={styles.avatarText}>{children}</Text>
);

export default function MessageBox({
  currentUser,
  message,
  currentMessageUserName,
}) {
  const date = message?.timestamp?.toDate();
  const formatted = date?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const avatarName = () => {
    return currentMessageUserName.split(" ")[0][0];
  };

  const isCurrentUser = message.senderId === currentUser;
  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.messageContainerReverse : null,
      ]}
    >
      <Avatar>
        <AvatarFallback>{avatarName()}</AvatarFallback>
      </Avatar>

      <View
        style={[
          styles.messageContent,
          isCurrentUser ? styles.messageContentEnd : styles.messageContentStart,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser
              ? styles.messageBubbleSent
              : styles.messageBubbleReceived,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isCurrentUser
                ? styles.messageTextSent
                : styles.messageTextReceived,
            ]}
          >
            {message.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatted}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-end",
    width: "100%",
    marginBottom: 8,
  },
  messageContainerReverse: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  messageContent: {
    flexDirection: "column",
    maxWidth: "70%",
  },
  messageContentStart: {
    alignItems: "flex-start",
  },
  messageContentEnd: {
    alignItems: "flex-end",
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  messageBubbleSent: {
    backgroundColor: "#3b82f6",
  },
  messageBubbleReceived: {
    backgroundColor: "#f3f4f6",
  },
  messageText: {
    fontSize: 14,
  },
  messageTextSent: {
    color: "#ffffff",
  },
  messageTextReceived: {
    color: "#000000",
  },
  timestamp: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
});
