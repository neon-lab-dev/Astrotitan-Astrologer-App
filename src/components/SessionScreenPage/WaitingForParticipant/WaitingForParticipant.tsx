import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface WaitingForParticipantProps {
  participantName: string;
}

const WaitingForParticipant = ({
  participantName,
}: WaitingForParticipantProps) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(212, 175, 55, 0.15)', 'transparent']} // Soft gold glow
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.glowEffect}
      />
      <ActivityIndicator size="large" />

      <Text style={styles.title}>Waiting for {participantName}</Text>

      <Text style={styles.subtitle}>
        The consultation will begin when they join the call.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  glowEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },

  subtitle: {
    color: '#AAAAAA',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default WaitingForParticipant;
