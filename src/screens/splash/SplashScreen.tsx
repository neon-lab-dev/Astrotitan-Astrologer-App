import React, { useEffect } from "react";
import { View } from "react-native";
import
Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useDispatch,} from "react-redux";
import { setAuth } from "../../redux/features/auth/authSlice";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { SatoshiText } from "../../components/reusable/Text/SatoshiText";
import { Storage } from "../../services/storage/storage";

const SplashScreen = () => {
  const dispatch = useDispatch();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const navigation = useNavigation<any>();
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });

    initializeApp();
  }, []);

  const initializeApp = async () => {
    const token = await Storage.getAccessToken();
    const user = await Storage.getUser();
    const onboardingDone =
      await Storage.getOnboardingDone();
    const profileCompleted =
      await Storage.getProfileCompleted();
    setTimeout(() => {
      if (token) {
        dispatch(
          setAuth({
            token,
            user,
          })
        );

        if (profileCompleted) {
          navigation.reset({
            index: 0,
            routes: [{ name: "HomeTabs" }],
          });
        } else {
          navigation.replace("MultiStepForm");
        }

        return;
      }

      if (onboardingDone) {
        navigation.replace("LoginWithPhone");
      } else {
        navigation.replace("Onboarding");
      }
    }, 1500);

  };
  
  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));
  
  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}

      >
        <Animated.View style={logoStyle}>
          <SatoshiText
            style={{
              color: "#0D0D0D",
              fontSize: 28,
              fontFamily: "Satoshi-Regular",
            }}
          >
            AstroTitan
          </SatoshiText>
        </Animated.View>
      </View></ScreenWrapper>
  );

};

export default SplashScreen;