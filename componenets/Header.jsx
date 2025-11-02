import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Header({ title, showBackButton, onBack }) {
  return (
    <BlurView intensity={80} tint="light" style={styles.header}>
      <View style={styles.row}>
        {showBackButton && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
});
