// src/components/layout/ScreenWrapper.tsx

import { StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function ScreenWrapper({ children }: any) {
  return (
    <LinearGradient
      colors={["#EDDEAD", "#F1E8C9", "#F5F5F5"]}
      locations={[0, 0.45, 1]}
      // start={{ x: 0, y: 0 }}
      // end={{ x: 1, y: 0.6 }} // approx 169deg
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
