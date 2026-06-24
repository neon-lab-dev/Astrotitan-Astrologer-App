import React from "react";
import { View } from "react-native";
import SuccessScreen from "../../../../components/reusable/successScreen/successScreen";
import { SansText } from "../../../../components/reusable/Text/SansText";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
const RaiseQuerySuccess = () => {
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
   const route = useRoute<any>();
      const {slug} = route.params || {};
  return (
    <SuccessScreen
      title="Query submitted"

      buttons={[

        {
          title: "Back To Profile",

          onPress: () => {

            navigation.replace(
              "ProfileScreen"
            );
          },
        },
      ]}
    >
      <View
  style={{
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  }}
>
  <SansText
    style={{
      fontSize: 14,
      color: "#6B6B6B",
      textAlign: "center",
    }}
  >
    Ticket ID
  </SansText>

  
    <SansText
      style={{
        fontFamily: "GeneralSans-Bold",
        fontSize: 16,
        color: "#0D0D0D",
        letterSpacing: 0.4,
        textAlign: "center",
      }}
    >
      {slug}
    </SansText>
</View>
    </SuccessScreen>
  );
};

export default RaiseQuerySuccess;