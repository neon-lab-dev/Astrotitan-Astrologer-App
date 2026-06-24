import { StyleSheet, View } from "react-native";
import { SansText } from "../Text/SansText";

const BulletPoint = ({
  text,
}: {
  text: string;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />

      <SansText style={styles.text}>
        {text}
      </SansText>
    </View>
  );
};

export default BulletPoint;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },

  dot: {
    height: 8,
    width: 8,
    borderRadius: 999,
    backgroundColor: "#0D0D0D",
    marginTop: 9,
  },

  text: {
    flex: 1,
    fontSize: 18,
    lineHeight: 26,
  },
});