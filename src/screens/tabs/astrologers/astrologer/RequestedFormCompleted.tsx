import { useNavigation } from "@react-navigation/native";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import SuccessScreen from "../../../../components/reusable/successScreen/successScreen";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetForm } from "../../../../redux/features/RequestConsultationForm/RequestConsultationFormSlice";

const RequestedFormCompleted = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  useEffect(() => {
    dispatch(resetForm());
  })
  return (

    <AnimatedScreen>
      <SuccessScreen
        title="Request Submitted!"
        description="Your personalized astrology experience is ready."
        image={require("@/assets/images/profile-verified.png")}
        buttons={[

          {
            title: "Go To Dashboard",

            onPress: () => {
              navigation.replace(
                "AstrologerScreen"
              );
            },
          },
        ]}
      /></AnimatedScreen>

  );
};

export default RequestedFormCompleted;