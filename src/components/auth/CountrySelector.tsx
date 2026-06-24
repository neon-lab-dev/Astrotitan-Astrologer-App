import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SansText } from "../reusable/Text/SansText";
import Ionicons from "@react-native-vector-icons/ionicons";

type Props = {
  label?: string;
  value: string;
  flag?: string;
};

export default function CountrySelector({
  label,
  value,
  flag,
}: Props) {
  return (
    <View>
      {label && <SansText style={styles.label}>{label}</SansText>}

      <TouchableOpacity style={styles.container} >
        <View style={styles.left}>
          {/* You can later replace with flag dynamically */}
          <SansText style={styles.flag}>{flag}</SansText>
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
    includeFontPadding: false, // 🔥 same as text
    textAlignVertical: "center",
  },

  text: {
    fontSize: 16,
    color: "#1C1C1C",
    includeFontPadding: false, // 🔥 ANDROID FIX
    textAlignVertical: "center",
  },
});
