import React from "react";
import { StyleSheet, View } from "react-native";
import { SansText } from "../reusable/Text/SansText";

const AuthSecondaryNavigation = ({
  question,
  option,
  action,
}: {
  question: string;
  option: string;
  action: () => void;
}) => {
  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <SansText style={styles.footerText}>
        {question}
        <SansText style={styles.link} onPress={action}>
          {option}
        </SansText>
      </SansText>
    </View>
  );
};

export default AuthSecondaryNavigation;

const styles = StyleSheet.create({
  link: {
    color: "#947A27",
    textDecorationLine: "underline",
  },

  footerText: {
    fontSize: 14,
    color: "#0D0D0D",
  },
});
