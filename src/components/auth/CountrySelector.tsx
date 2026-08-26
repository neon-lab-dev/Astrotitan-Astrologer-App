import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SansText } from "../reusable/Text/SansText";
import Ionicons from "@react-native-vector-icons/ionicons";

type Props = {
  label?: string;
  value: string;
  flag?: string;
  onPress?: () => void;
  disabled?: boolean;
};

export default function CountrySelector({
  label,
  value,
  flag,
  onPress,
  disabled = false,
}: Props) {
  return (
    <View>
      {label && <SansText style={styles.label}>{label}</SansText>}

      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.left}>
          <SansText style={styles.flag}>{flag || '🌍'}</SansText>
          <SansText style={styles.text}>{value}</SansText>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#6B5E2E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: "#0D0D0D",
    marginBottom: 8,
    lineHeight: 26,
  },

  container: {
    height: 72,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    backgroundColor: "#E9D8A6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  flag: {
    fontSize: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  text: {
    fontSize: 16,
    color: "#1C1C1C",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});