import React from "react";
import { StyleSheet, View } from "react-native";
import { SansText } from "../reusable/Text/SansText";
import { SatoshiText } from "../reusable/Text/SatoshiText";

const AuthTitle = ({
  title,
  titleFontSize,
  children,
}: {
  title?: string;
  titleFontSize?:number;
  children?: React.ReactNode;
}) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <SatoshiText style={[styles.title,{  fontSize: titleFontSize||28,}]}>{title}</SatoshiText>

      {children && <SansText style={styles.subtitle}>{children}</SansText>}
    </View>
  );
};

export default AuthTitle; 

const styles = StyleSheet.create({
  title: {
  
    fontFamily: "Satoshi-Bold",
    letterSpacing: -0.32,
    color: "#0D0D0D",
  },

  subtitle: {
    fontSize: 18,
    marginTop: 8,
    color: "#0D0D0D",
    lineHeight: 26,
  },
});
