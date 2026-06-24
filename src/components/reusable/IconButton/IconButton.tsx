import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SansText } from "../Text/SansText";

type Props = {
  Icon: React.FC<any>;   // SVG component
  size?: number;         // total button size
  iconSize?: number;     // inner icon size
  bgColor?: string;
  iconColor?: string;
  onPress?: () => void;
  style?: any;
  update?: boolean;// just a flag for update design
  updateCount?: number; // if update is true, show this count in badge
};

const IconButton = ({
  Icon,
  size = 48,
  iconSize = 24,
  bgColor = "#F5F5F5",
  iconColor = "#000",
  onPress,
  style,
  update = true,
  updateCount = 0,
}: Props) => {
  return (
    <TouchableOpacity style={{ position: "relative" }} onPress={onPress} activeOpacity={0.8}>
      {update &&  updateCount < 0 && <View style={{
        position: "absolute",
        zIndex: 100, top: 0, backgroundColor: "#D4AF37", width: 12, height: 12, borderRadius: 6, right: 0,
      }}>

      </View>
      }
     {update && updateCount > 0 && (
  <View
    style={{
      position: "absolute",
      zIndex: 100,
      top: -4,
      right: -4,
      backgroundColor: "#D4AF37",
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    }}
  >
    <SansText style={{ color: "#0D0D0D", fontSize: 12 }}>
      {updateCount > 99 ? "99+" : updateCount}
    </SansText>
  </View>
)}
      
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
          },
          style,
        ]}
      >
        <Icon width={iconSize} height={iconSize} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});