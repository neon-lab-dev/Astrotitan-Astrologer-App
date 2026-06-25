import React from "react";
import SuccessScreen from "../../components/reusable/successScreen/successScreen";
import { useNavigation } from "@react-navigation/native";
import AnimatedScreen from "../../components/layout/AnimatedScreen";

const ProfileCompleted = () => {
  const navigation = useNavigation<any>();
  return (
    <AnimatedScreen>
      <SuccessScreen
        title="Profile completed!"
        description="Your personalized astrology experience is ready."
        image={require("@/assets/images/profile-verified.png")}
        buttons={[

          {
            title: "Go To Dashboard",

            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "HomeTabs" }],
              });
            },
          },
        ]}
      />
    </AnimatedScreen>
  );
};

export default ProfileCompleted;