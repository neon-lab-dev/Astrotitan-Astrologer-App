import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CallControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onSwitchCamera: () => void;
  onLeave: () => void;
  onEnd: () => void;
  isAstrologer: boolean;
}

const CallControls = ({
  isMuted,
  isVideoOn,
  onToggleMute,
  onToggleVideo,
  onSwitchCamera,
  onLeave,
  onEnd,
  isAstrologer,
}: CallControlsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.control}
        onPress={onToggleMute}
      >
        <Text style={styles.icon}>
          {isMuted ? "🔇" : "🎤"}
        </Text>

        <Text style={styles.label}>
          {isMuted ? "Unmute" : "Mute"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.control}
        onPress={onToggleVideo}
      >
        <Text style={styles.icon}>
          {isVideoOn ? "📹" : "🚫"}
        </Text>

        <Text style={styles.label}>
          {isVideoOn ? "Camera" : "Video Off"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.control}
        onPress={onSwitchCamera}
      >
        <Text style={styles.icon}>
          🔄
        </Text>

        <Text style={styles.label}>
          Flip
        </Text>
      </TouchableOpacity>

      {isAstrologer ? (
        <TouchableOpacity
          style={[
            styles.control,
            styles.endButton,
          ]}
          onPress={onEnd}
        >
          <Text style={styles.icon}>
            📞
          </Text>

          <Text style={styles.label}>
            End
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.control,
            styles.endButton,
          ]}
          onPress={onLeave}
        >
          <Text style={styles.icon}>
            📞
          </Text>

          <Text style={styles.label}>
            Leave
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },

  control: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  endButton: {
    backgroundColor: "#D92D20",
  },

  icon: {
    fontSize: 21,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 9,
    marginTop: 2,
  },
});

export default CallControls;