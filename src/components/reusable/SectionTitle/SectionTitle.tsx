import React from "react";
import { StyleSheet, View } from "react-native";
import { SatoshiText } from "../Text/SatoshiText";

const SectionTitle = ({
  title,
  titleFontSize,
  children,
}: {
  title: string;
  titleFontSize?:number;
  children?: React.ReactNode;
}) => {
  return (
    <View style={{ flexDirection: "row",alignContent:"center", justifyContent:"space-between"  }}>
      <SatoshiText style={[styles.title,{  fontSize: titleFontSize||28,}]}>{title}</SatoshiText>
{
        children
}
    </View>
  );
};

export default SectionTitle;

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
