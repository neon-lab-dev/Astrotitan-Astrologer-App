import React from "react";
import { StyleSheet, View } from "react-native";
import { SansText } from "../reusable/Text/SansText";

const OrDivider = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
        gap: 12,
        paddingHorizontal: 24,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: "#949494" }} />
      <SansText style={[styles.orDivider]}>OR</SansText>
      <View style={{ flex: 1, height: 1, backgroundColor: "#949494" }} />
    </View>
  );
};

export default OrDivider;
const styles = StyleSheet.create({
  orDivider: {
    fontWeight: 500,
    fontSize: 14,
    marginHorizontal: "auto",
    color: "#949494",
  },
});
