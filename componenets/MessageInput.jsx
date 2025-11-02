import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { sendMessage } from "../utils/firebaseChatEmployee";

export default function MessageInput({ conversationId, currentUser }) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(conversationId, currentUser, message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === "Enter" && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSendMessage}
          placeholder="Type your message..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSendMessage}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    padding: 8,
    backgroundColor: "#ffffff",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
    outlineStyle: "none",
    height: 20,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
