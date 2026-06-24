import { useForm } from "react-hook-form";
import { useSignupMutation } from "../../redux/features/auth/authApi";
import { useNavigation } from "@react-navigation/native";
import AnimatedScreen from "../../components/layout/AnimatedScreen";
import { StyleSheet, View } from "react-native";
import AuthTitle from "../../components/auth/AuthTitle";
import FormInput from "../../components/reusable/InputField/FormInput";
import { SansText } from "../../components/reusable/Text/SansText";
import OrDivider from "../../components/auth/OrDivider";
import ReusableButton from "../../components/reusable/ReusableButton/ReusableButton";
import AuthSecondaryNavigation from "../../components/auth/AuthSecondaryNavigation";
import TermsAndConditions from "../../components/auth/TermsAndConditions";
import AuthLayout from "../../components/layout/layouts/AuthLayout";
type RegisterForm = {
  email: string;
  role: string;
};

export default function EmailRegister() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<RegisterForm>({
    defaultValues: {
      email: "",
       role: "astrologer"
    },
    mode: "onBlur", // 🔥 IMPORTANT
  });
  const navigation = useNavigation<any>();

  const email = watch("email");
  const isFormFilled = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  const [signup, { isLoading, error }] = useSignupMutation();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const payload = {
        email: data.email,
        phoneNumber: "",
         role: "astrologer",
      };

      await signup(payload).unwrap();

      navigation.navigate({
        name: "OTPScreen",
        params: {
          source: "signup",
          email: data.email,
        },
      });
    } catch (err: any) {
      console.log("SIGNUP ERROR:", err);
    }
  };

  return (
    <AuthLayout>
      <AnimatedScreen>
        <View style={styles.container}>
          <View>
            <AuthTitle title="Create Account "></AuthTitle>

            <View style={{ gap: 26 }}>
              {/* PASSWORD */}
              <FormInput
                control={control}
                name="email"
                label="Email Address"
                variant="text" // 🔥 IMPORTANT
                placeholder="Enter email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                }}
              />

              {/* API ERROR */}
              {error && (
                <SansText style={styles.apiError}>
                  {(error as any)?.data?.message || "Login failed"}
                </SansText>
              )}
            </View>
            <OrDivider />
            <ReusableButton
              title="Register with Mobile number"
              variant="outline"
              onPress={() => navigation.replace("RegisterWithPhone")}
            />
          </View>
          <View style={{ gap: 24 }}>
            <AuthSecondaryNavigation
              question="Old User?"
              option=" SignIn"
              action={() => navigation.replace("LoginWithPhone")}
            />
            {isValid && isFormFilled && (
              <ReusableButton
                title="Send OTP"
                variant="solid"
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
              />
            )}
            <TermsAndConditions />
          </View>
        </View>
      </AnimatedScreen></AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  apiError: {
    color: "#C2371E",
    fontFamily: "GeneralSans-Medium",
    textAlign: "left",
    fontSize: 14,
    marginTop: 12,
  },
});
