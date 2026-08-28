import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface WaitingForParticipantProps {
  participantName: string;
}

const WaitingForParticipant = ({
  participantName,
}: WaitingForParticipantProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
      />

      <Text style={styles.title}>
        Waiting for {participantName}
      </Text>

      <Text style={styles.subtitle}>
        The consultation will begin when
        they join the call.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },

  subtitle: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default WaitingForParticipant;