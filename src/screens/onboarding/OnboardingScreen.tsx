import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";



import { SatoshiText } from "../../components/reusable/Text/SatoshiText";
import { SansText } from "../../components/reusable/Text/SansText";
import ReusableButton from "../../components/reusable/ReusableButton/ReusableButton";
import { Storage } from "../../services/storage/storage";

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const finish = async () => {
    await Storage.setOnboardingDone();
    navigation.replace("RegisterWithPhone");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/splash-screen.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.textSection}>
          <SatoshiText style={styles.title}>
            Consult with purpose
          </SatoshiText>

          <SansText style={styles.subtitle}>
            Connect with genuine users, manage your availability and earn with
            clarity.
          </SansText>
        </View>

        <ReusableButton
          onPress={finish}
          title="Get Started"
          variant="solid"
          width="auto"
          paddingHorizontal={22}
        />
      </View>
    </ImageBackground>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  textSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    color: "#F5F5F5",
    lineHeight: 28,
    letterSpacing: -0.07,
  },

  subtitle: {
    fontSize: 16,
    color: "#F5F5F5",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 56,
  },
});