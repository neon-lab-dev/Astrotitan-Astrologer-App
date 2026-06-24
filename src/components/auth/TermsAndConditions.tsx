
import React from "react";
import { StyleSheet } from "react-native";
import { SansText } from "../reusable/Text/SansText";
import { useNavigation } from "@react-navigation/native";

const TermsAndConditions = () => {
  const navigation=useNavigation<any>();
  return (
    <SansText style={[styles.continue, { color: "#0D0D0D" }]}>
      By continuing, you agree to our{" "}<SansText onPress={()=>{navigation.navigate("TermsAndConditions")}} style={styles.continueHighlight}>Terms & Conditions</SansText>
    </SansText>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  continue: {
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
  },
  continueHighlight: {
    textDecorationLine: "underline",
  },
});
