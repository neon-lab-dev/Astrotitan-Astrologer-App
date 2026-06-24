// components/global/GlobalModal.tsx

import { RootState } from "../../../redux/store";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { BackHandler, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import globalModalService from "../../../redux/features/ui/GlobalModal/globalModalService";

export default function GlobalModal() {
  const modal = useSelector((state: RootState) => state.globalModal);
  const navigation = useNavigation<any>();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (modal.visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 250 });
      translateY.value = withTiming(0, { duration: 250 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 });
      translateY.value = withTiming(50, { duration: 200 });
    }
  }, [modal.visible]);

 const close = useCallback(() => {
  globalModalService.close();

  if (modal.redirectTo) {
    navigation.navigate(modal.redirectTo);
  }
}, [modal.redirectTo, navigation]);
  const backdropOpacity = useSharedValue(0);

useEffect(() => {
  backdropOpacity.value = withTiming(modal.visible ? 1 : 0, {
    duration: 200,
  });
}, [modal.visible]);

const backdropAnimatedStyle = useAnimatedStyle(() => ({
  opacity: backdropOpacity.value,
}));

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (modal.visible) {
          close();
          return true;
        }
        return false;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [modal.visible])
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (modal.animation === "fade") {
      return { opacity: opacity.value };
    }

    if (modal.animation === "slide") {
      return {
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
      };
    }

    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (!modal.visible) return null;

  return (
    <View
  pointerEvents={modal.visible ? "auto" : "none"}
  style={[
    styles.root,
    {
      opacity: modal.visible ? 1 : 0,
    },
  ]}
>
  {/* BACKDROP */}
  <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />

  {/* TOUCH HANDLER */}
  {modal.dismissible && (
    <TouchableOpacity
      style={StyleSheet.absoluteFill}
      onPress={close}
    />
  )}

  {/* MODAL */}
  <Animated.View style={[styles.modal, animatedStyle]}>
    {modal.content}
  </Animated.View>
</View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 999999,
    elevation: 999999,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modal: {
    width: "90%",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
});