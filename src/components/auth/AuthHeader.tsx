
import Ionicons from "@react-native-vector-icons/ionicons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function AuthHeader() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="#0F121C" />
      </TouchableOpacity>

      {/* Center Logo */}
      <View style={styles.center}>
        <Image
          source={require("../../assets/images/vedicNameLogo.png")}
          style={styles.textLogo}
        />
      </View>
    ``
      {/* Spacer (to balance back button) */}
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
  },

  backBtn: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBF6EE",
    boxShadow: " 0 4px 6px 0 rgba(163, 163, 163, 0.11)",
    borderColor: "#F2E4C9",
    borderWidth: 1,
    padding: 6,
  },

  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  logo: {
    width: 28,
    height: 28,
  },

  textLogo: {
    width: 170,
    height: 34,
  },
});
