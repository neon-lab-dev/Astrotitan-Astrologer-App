import { Image, StyleSheet, View } from "react-native";
import ReusableButton from "../ReusableButton/ReusableButton";
import { SatoshiText } from "../Text/SatoshiText";
import { SansText } from "../Text/SansText";

type AstrologerType = {
  name: string;
  image: any;
};

type Props = {
  onCancel: () => void;
  onConsult: () => void;
  astrologer: AstrologerType;
};

const ConsultAstrologerSection = ({
  onCancel,
  onConsult,
  astrologer,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={{ gap: 8 }}>
        <Image
          source={astrologer.image}
          style={styles.avatar}
        />

        <SatoshiText style={styles.title}>
          {astrologer.name} is available
        </SatoshiText>

        <SansText style={styles.description}>
          You can continue your pending call consultation and get clear guidance.
        </SansText>
      </View>

      <View style={styles.buttonRow}>
        <View style={{ flex: 1 }}>
          <ReusableButton
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            width="100%"
          />
        </View>

        <View style={{ flex: 1 }}>
          <ReusableButton
            title="Consult Now"
            onPress={onConsult}
            variant="solid"
            width="100%"
          />
        </View>
      </View>
    </View>
  );
};

export default ConsultAstrologerSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 56,
    justifyContent: "flex-end",

  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 100,
  },

  title: {
    fontSize: 28,
    fontFamily: "Satoshi-Bold",
    color: "#0D0D0D",
  },

  description: {
    fontSize: 18,
    color: "#000",
    lineHeight: 26,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
  },
});