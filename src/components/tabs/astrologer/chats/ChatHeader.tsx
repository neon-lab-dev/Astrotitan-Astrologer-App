import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SansText } from "../../../reusable/Text/SansText";

type Props = {
  onEndPress: () => void;
};

const ChatHeader = ({ onEndPress }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar} />

        <View>
          <SansText style={styles.name}>
            Rahul Sharma
          </SansText>

          <SansText style={styles.subtitle}>
            Career & clarity guidance
          </SansText>
        </View>
      </View>

      <TouchableOpacity
        style={styles.endButton}
        onPress={onEndPress}
      >
        <SansText style={styles.endText}>
          End
        </SansText>
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5D69D",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D58B3D",
    marginRight: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 11,
    color: "#666",
  },

  endButton: {
    backgroundColor: "#D3AF2C",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  endText: {
    fontSize: 12,
    fontWeight: "600",
  },
});