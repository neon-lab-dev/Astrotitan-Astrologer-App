import React, { useCallback, useEffect } from "react";
import { BackHandler, Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import BottomSheetService from "../../../redux/features/ui/GlobalSheet/BottomSheetService";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
export default function GlobalBottomSheet() {
  const sheet = useSelector((state: RootState) => state.globalSheet);
  const translateY = useSharedValue(800);
  const navigation = useNavigation<any>();
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      keyboardHeight.value = e.endCoordinates.height;
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      keyboardHeight.value = 0;
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  },);

  useEffect(() => {
    translateY.value = withTiming(sheet.visible ? 0 : 800, { duration: 280 });
  }, [sheet.visible, translateY]);
  const close = useCallback(() => {
  translateY.value = withTiming(800, { duration: 250 });

  setTimeout(() => {
    BottomSheetService.close();

    if (sheet.redirectTo) {
      navigation.navigate(sheet.redirectTo);
    }
  }, 250);
}, [sheet.redirectTo, navigation, translateY]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.value - keyboardHeight.value * (sheet.translate ?? 0.6),
        // translateY: translateY.value - keyboardHeight.value * 0.1,
      },
    ],
  }));

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (sheet.visible) {
          close(); // close sheet instead of going back
          return true; // prevent default behavior
        }
        return false; // allow normal ba
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [sheet.visible, close]),
  );

  return (
    
    <View
      pointerEvents={sheet.visible ? "auto" : "none"}
      style={[styles.root, { opacity: sheet.visible ? 1 : 0 }]}
    >
      {/* backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={close}
      />

      <Animated.View
  style={[
    styles.sheet,
    animatedStyle,
    sheet.height ? { height: sheet.height } : { maxHeight: "85%" },
  ]}
>
  {sheet.hasGradient ? (
    <LinearGradient 
      colors={["#EDDEAD", "#F1E8C9", "#F5F5F5"]}
      locations={[0, 0.45, 1]}
      style={{ flex: 1 }}
    >
      {sheet.content}
    </LinearGradient>
  ) : (
    sheet.content
  )}
</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({

  Gradient: {
    position: "absolute",
    top: -50,
    width: "150%",
    height: 260,

    left: "20%",
    right: "50%",
    transform: [
      { translateX: -130 }, // 👈 THIS
    ], // half of width
  },
  root: {
  ...StyleSheet.absoluteFill,
    zIndex: 99999,
    elevation: 99999,
    justifyContent: "flex-end",
  },
  backdrop: {
  ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  // sheet: {
  //   backgroundColor: "#F9F9F9",
  //   borderTopLeftRadius: 24,
  //   borderTopRightRadius: 24,
  //   paddingBottom: 40,
  //   overflow: "hidden",
  // },
  sheet: {
    position: "relative",
    backgroundColor: "#F9F9F9",
    overflow:"hidden",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    maxHeight: "90%", // 👈 only constraint
    alignSelf: "stretch",
  },
});
