import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { setOnboardingDone } from "../../redux/features/app/appSlice";
import { clearAuth } from "../../redux/features/auth/authSlice";
import { Storage } from "../../services/storage/storage";

export function DevResetPanel() {
  const dispatch = useDispatch();

  if (!__DEV__) return null;

  const resetOnboarding = () => {
    Storage.removeOnboardingDone();

    dispatch(setOnboardingDone(false));

    Alert.alert("Onboarding reset. Restart app.");
  };

  const resetAuth = () => {
    Storage.removeAccessToken();
    Storage.removeUser();
    Storage.removeProfileCompleted();

    dispatch(clearAuth());
    
    Alert.alert("Auth reset (logged out).");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={resetOnboarding}
        style={styles.btn}
      >
        <Text style={styles.text}>
          Reset Onboarding
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resetAuth}
        style={styles.btn}
      >
        <Text style={styles.text}>
          Reset Auth
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    right: 16,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 10,
    gap: 8,
    opacity: 0.85,
    zIndex: 999,
  },

  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#333",
    borderRadius: 6,
  },

  text: {
    color: "white",
    fontSize: 12,
  },
});