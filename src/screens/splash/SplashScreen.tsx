import React, { useEffect } from "react";
import { View } from "react-native";
import
Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, } from "react-redux";
import { setAuth, updateUser } from "../../redux/features/auth/authSlice";
import ScreenWrapper from "../../components/layout/ScreenWrapper";
import { SatoshiText } from "../../components/reusable/Text/SatoshiText";
import { Storage } from "../../services/storage/storage";
import { useLazyGetMeQuery } from "../../redux/features/auth/authApi";

const SplashScreen = () => {
  const dispatch = useDispatch();
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const navigation = useNavigation<any>();
  const [getMe] =
    useLazyGetMeQuery();
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });

    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const token = await Storage.getAccessToken();
      const user = await Storage.getUser();
      const onboardingDone = await Storage.getOnboardingDone();


      if (token) {
        dispatch(setAuth({ token, user }));
        const meRes = await getMe({}).unwrap();
        const finalUser = meRes.data;
        await Storage.setUser(finalUser);
        dispatch(updateUser(finalUser));
        const isProfileCompleted =
          finalUser?.profile?.isProfileCompleted ||
          finalUser?.isProfileComplete ||
          false;
        await Storage.setProfileCompleted(isProfileCompleted);
        setTimeout(() => {
          if (isProfileCompleted) {
            navigation.reset({
              index: 0,
              routes: [{ name: "HomeTabs" }],
            });
          } else {
            navigation.replace("MultiStepForm");
          }
        }, 1500);

        return;
      }

      setTimeout(() => {
        if (onboardingDone) {
          navigation.replace("LoginWithPhone");
        } else {
          navigation.replace("Onboarding");
        }
      }, 1500);
    } catch (error) {
      console.log(error);
    }
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
              fontSize: 21,
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