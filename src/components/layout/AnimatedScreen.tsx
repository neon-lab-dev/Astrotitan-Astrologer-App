// src/components/layout/AnimatedScreen.tsx

import { ReactNode, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useRoute } from "@react-navigation/native";
type Props = {
  children: ReactNode;
  delay?: number;
};

export default function AnimatedScreen({ children, delay = 0 }: Props) {
    const route = useRoute();

  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = 120;
    opacity.value = 0;

    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      })
    );

    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 600,
      })
    );
  }, [route.name, delay,opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}