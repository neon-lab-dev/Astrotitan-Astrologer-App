import React from "react";
import { StyleSheet, View } from "react-native";
import { SansText } from "../../../reusable/Text/SansText";
type Props = {
  text: string;
  time: string;
  isMine?: boolean;
};

const ChatBubble = ({
  text,
  time,
  isMine,
}: Props) => {
  return (
    <View
      style={[
        styles.wrapper,
        isMine
          ? styles.mineWrapper
          : styles.otherWrapper,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine
            ? styles.mineBubble
            : styles.otherBubble,
        ]}
      >
        <SansText style={styles.text}>
          {text}
        </SansText>

        <View style={styles.timeRow}>
          {isMine && (
            <SansText style={styles.tick}>
              ✓
            </SansText>
          )}

          <SansText style={styles.time}>
            {time}
          </SansText>
        </View>
      </View>
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },

  mineWrapper: {
    alignItems: "flex-end",
  },

  otherWrapper: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 10,
  },

  mineBubble: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DCC67C",
  },

  otherBubble: {
    backgroundColor: "#E6D08D",
  },

  text: {
    fontSize: 12,
    lineHeight: 18,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },

  tick: {
    marginRight: 4,
    fontSize: 10,
  },

  time: {
    fontSize: 10,
    color: "#666",
  },
});