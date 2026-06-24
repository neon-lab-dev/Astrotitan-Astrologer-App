import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  onSend: () => void;
};

const ChatInput = ({
  value,
  onChangeText,
  onSend,
}: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your question here..."
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.sendButton}
        onPress={onSend}
      >
        {/* Your Send SVG */}
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#E7D38D",
    borderRadius: 10,
    paddingHorizontal: 16,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
});