import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { useGoogleCalendar } from '../hooks/useGoogleCalendar';

const ConnectGoogleCalendar = () => {
  const {
    isConnected,
    user,
    isLoading,
    connectCalendar,
    disconnectCalendar,
  } = useGoogleCalendar();

  return (
    <View style={styles.container}>
      {isConnected ? (
        <>
          <Text style={styles.email}>
            Connected:
          </Text>

          <Text style={styles.email}>
            {user?.user?.email || user?.email}
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.disconnect]}
            onPress={disconnectCalendar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.text}>
                Disconnect Google
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.connect]}
          onPress={connectCalendar}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.text}>
              Connect Google Calendar
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ConnectGoogleCalendar;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  connect: {
    backgroundColor: '#4285F4',
  },

  disconnect: {
    backgroundColor: '#d32f2f',
  },

  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  email: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 15,
  },
});