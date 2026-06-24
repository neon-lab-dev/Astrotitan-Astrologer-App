// components/reusable/VerifiedPopup.tsx
import React from "react";
import { Image, StyleSheet } from "react-native";
import ReusableButton from "../ReusableButton/ReusableButton";
import ModalService from "../../../redux/features/ui/GlobalModal/globalModalService";
import LinearGradient from "react-native-linear-gradient";
import { SatoshiText } from "../Text/SatoshiText";
import { useNavigation } from "@react-navigation/native";
type Props = {
  isProfileCompleted: boolean;
};



export default function VerifiedPopup({ isProfileCompleted }: Props) {
  const navigation = useNavigation<any>();
  const handleClose = () => {
    ModalService.close();


    if (isProfileCompleted) {
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeTabs" }],
      });
    } else {
      navigation.replace("MultiStepForm");
    }
  };

  return (
    <LinearGradient
      colors={["#EDDEAD", "#F1E8C9", "#F5F5F5"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* ICON */}
      <Image
        source={require("@/assets/images/tick.png")}
        style={styles.image}
      />

      {/* TEXT */}
      <SatoshiText style={styles.title}>
        {isProfileCompleted ? "Otp is verified!" : " Otp is verified! Let’s set up your profile."}
      </SatoshiText>

      {/* BUTTON */}
      <ReusableButton
        title="Ok"
        width={148}
        variant="solid"
        onPress={handleClose}
        style={{ marginTop: 24 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
    borderRadius: 12,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#6BAA2F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  check: {
    fontSize: 28,
    color: "#6BAA2F",
  },
  image: {
    width: 124,
    height: 124,
    marginBottom: 20,
    objectFit: 'contain'
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
    lineHeight: 26,
  },
});