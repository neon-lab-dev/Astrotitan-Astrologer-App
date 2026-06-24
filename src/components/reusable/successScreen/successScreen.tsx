import React from "react";

import {
  Image,
  StyleSheet,
  View,
} from "react-native";
import ReusableButton from "../ReusableButton/ReusableButton";
import AnimatedScreen from "../../layout/AnimatedScreen";
import ScreenWrapper from "../../layout/ScreenWrapper";
import AppHeader from "../AppHeader/AppHeader";
import { SansText } from "../Text/SansText";
import AuthTitle from "../../auth/AuthTitle";

type ButtonItem = {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline" | "ghost" | "error";
};

type Props = {
  title: string;
  description?: string;
  image?: any;
  buttons?: ButtonItem[];
  children?: React.ReactNode
};

const SuccessScreen = ({
  title,
  description,
  image,
  children,
  buttons = [],
}: Props) => {
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        {/* HEADER */}
        <AppHeader showBack={false}>
          <AuthTitle title={title} >
            <SansText>{/* DESCRIPTION */}
              {description && (
                <SansText style={styles.description}>
                  {description}
                </SansText>
              )}</SansText>
          </AuthTitle>
        </AppHeader>

        {/* CONTENT */}
        <View style={styles.container}>
          <View style={styles.centerContent}>
            {/* IMAGE */}
            <Image
              source={
                image ||
                require("@/assets/images/tick.png")
              }
              style={styles.image}
            />
            {children}

          </View>

          {/* BUTTONS */}
          <View style={styles.buttonContainer}>
            {buttons.map(
              (button, index) => (
                <ReusableButton
                  key={index}
                  title={button.title}
                  onPress={button.onPress}
                  variant={
                    button.variant ||
                    "solid"
                  }
                />
              )
            )}
          </View>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 16,

    paddingBottom: 16,

    justifyContent: "space-between",
  },

  centerContent: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    paddingHorizontal: 20,
  },

  image: {
    width: 220,

    height: 220,
  },

  description: {
    marginTop: 24,

    fontSize: 16,

    lineHeight: 26,

    color: "#5B5B5B",
  },

  buttonContainer: {
    gap: 12,
  },
});