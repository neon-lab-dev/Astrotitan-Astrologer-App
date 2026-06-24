import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SansText } from "../Text/SansText";
import { SatoshiText } from "../Text/SatoshiText";

const ContentSection = ({
  title,
  titleFontSize,
  titleColor,
  descriptionColor,
  children,
  children2,
  sectionStyle
}: {
  title: string;
  titleFontSize?: number;
  titleColor?:string;
  descriptionColor?:string;
  children?: React.ReactNode;
  children2?: React.ReactNode;
  sectionStyle?: ViewStyle;
}) => {
  return (
    <View style={sectionStyle}>
      <SatoshiText style={[styles.title, { fontSize: titleFontSize || 16, } ,{ color: titleColor || "#0D0D0D" }]}>{title}</SatoshiText>

      {children && <SansText style={[styles.subtitle ,{ color: descriptionColor || "#0D0D0D" }]}>{children}</SansText>}
      {children2 && <View style={[styles.subtitle ]}>{children2}</View>}
    </View>
  );
};

export default ContentSection;

const styles = StyleSheet.create({
  title: {

    fontFamily: "Satoshi-Bold",
    letterSpacing: -0.32,
    lineHeight:28
  },

  subtitle: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});
