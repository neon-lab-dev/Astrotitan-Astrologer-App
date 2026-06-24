import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SansText } from "../../../reusable/Text/SansText";

const ChatEndedState = () => {
  return (
    <View style={styles.container}>
      <SansText style={styles.text}>
        You've used the questions available in
        this session.
      </SansText>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.outline}>
          <SansText>
            View plans
          </SansText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filled}>
          <SansText>
            End Session
          </SansText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatEndedState;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  text: {
    textAlign: "center",
    marginBottom: 20,
  },

  buttons: {
    flexDirection: "row",
    gap: 12,
  },

  outline: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D3AF2C",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },

  filled: {
    flex: 1,
    backgroundColor: "#D3AF2C",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
});