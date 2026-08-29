import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { SansText } from './reusable/Text/SansText';

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
          <SansText style={styles.email}>
            Connected:
          </SansText>

          <SansText style={styles.email}>
            {user?.user?.email || user?.email}
          </SansText>

          <TouchableOpacity
            style={[styles.button, styles.disconnect]}
            onPress={disconnectCalendar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <SansText style={styles.text}>
                Disconnect Google
              </SansText>
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
            <SansText style={styles.text}>
              Connect Google Calendar
            </SansText>
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