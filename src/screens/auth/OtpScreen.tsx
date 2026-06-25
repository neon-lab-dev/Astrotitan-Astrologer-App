
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { useLazyGetMeQuery, useResendLoginOtpMutation, useResendSignupOtpMutation, useVerifyLoginOtpMutation, useVerifySignupOtpMutation } from "../../redux/features/auth/authApi";
import { setAuth } from "../../redux/features/auth/authSlice";
import { Storage } from "../../services/storage/storage";
import globalModalService from "../../redux/features/ui/GlobalModal/globalModalService";
import VerifiedPopup from "../../components/reusable/Popups/VerifiedPopup";
import AppHeader from "../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../components/auth/AuthTitle";
import { SansText } from "../../components/reusable/Text/SansText";
import { SatoshiText } from "../../components/reusable/Text/SatoshiText";
import ReusableButton from "../../components/reusable/ReusableButton/ReusableButton";
import { useRoute } from "@react-navigation/native";
import AuthLayout from "../../components/layout/layouts/AuthLayout";
type FormType = {
  otp: string;
};

export default function OtpScreen() {
  const [status, setStatus] = useState<
    "default" | "error" | "success" | "expired" | "not_received"
  >("default");
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  const { watch, setValue } = useForm<FormType>({
    defaultValues: { otp: "" },
  });

  const [getMe] = useLazyGetMeQuery({});
  const inputs = useRef<TextInput[]>([]);
  const [otpArray, setOtpArray] = useState(["", "", "", ""]);
  const route = useRoute<any>();
  const params = route.params || {};

  const otp = watch("otp");

  // 🔥 API hooks
  const [verifyLoginOtp] = useVerifyLoginOtpMutation();
  const [verifySignupOtp] = useVerifySignupOtpMutation();
  const [resendLoginOtp] = useResendLoginOtpMutation();
  const [resendSignupOtp] = useResendSignupOtpMutation();

  // ✅ VERIFY OTP
  const onSubmit = async (otpValue: string) => {
    if (loading) return;

    try {
      setLoading(true);
      setStatus("default");

      const payload = {
        emailOrPhone: params.phone || params.email,
        otp: otpValue,
      };
      // 🔥 IMPORTANT: capture response
      let response;

      if (params.source === "login") {
        response = await verifyLoginOtp(payload).unwrap();

      } else {
        response = await verifySignupOtp(payload).unwrap();
      }
      const data = response?.data;
      const accessToken = data?.accessToken;
      const refreshToken = data?.refreshToken;
      const user = data?.user;
      console.log(accessToken)
      dispatch(setAuth({ token: accessToken, user: user }));
      const isProfileCompleted =
        user?.profile?.isProfileCompleted ||
        user?.isProfileComplete ||
        false;
      await Storage.setAccessToken(accessToken);
      await Storage.setRefreshToken(refreshToken);
      await Storage.setUser(user);
      await Storage.setProfileCompleted(isProfileCompleted);
      console.log(user,"opt screen profile status")
      setStatus("success");
      let finalUser = user;
      try {
        const meRes = await getMe({}).unwrap();
        finalUser = meRes.data;
        await Storage.setUser(finalUser);
        console.log("user from login", finalUser)
      } catch {
        console.log("Using fallback user");
      }
      globalModalService.open(<VerifiedPopup
        isProfileCompleted={isProfileCompleted}
      />, {
        dismissible: false,
      });

    } catch (err: any) {
      const message =
        err?.data?.message || "Invalid OTP. Please try again.";

      if (message.toLowerCase().includes("expired")) {
        setStatus("expired");
        setCanResend(true);
      } else {
        setStatus("error");
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ TIMER
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);

      const isEmpty = otpArray.every((digit) => digit === "");
      if (isEmpty) setStatus("not_received");

      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, otpArray]);

  // ✅ RESEND OTP
  const handleResend = async () => {
    try {
      setLoading(true);

      const payload = {
        emailOrPhone: params.phone || params.email,
      };

      if (params.source === "login") {
        await resendLoginOtp(payload).unwrap();
      } else {
        await resendSignupOtp(payload).unwrap();
      }

      setTimer(30);
      setCanResend(false);
      setStatus("default");
      setOtpArray(["", "", "", ""]);
      setValue("otp", "");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ INPUT HANDLING
  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && !otpArray[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;

    const newOtp = [...otpArray];
    newOtp[index] = text;
    setOtpArray(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    const fullOtp = newOtp.join("");
    setValue("otp", fullOtp);

    if (fullOtp.length === 4) {
      onSubmit(fullOtp);
    }
  };

  return (
    <AuthLayout>
        <View style={styles.container}>
          <View>
            <AppHeader>
              <AuthTitle title="OTP Verification">
                <SansText>
                  Enter the 4-digit OTP sent to your{" "}
                  {params.source === "login"
                    ? "mobile number"
                    : "email"}{" "}
                  <SatoshiText style={styles.param}>
                    {params.phone || params.email}
                  </SatoshiText>
                </SansText>
              </AuthTitle>
            </AppHeader>

            <View style={styles.content}>
              <View style={styles.otpContainer}>
                {[0, 1, 2, 3].map((_, index) => (
                  <TextInput
                    key={index}
                    value={otp[index] || ""}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleBackspace(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    style={[
                      styles.otpBox,
                      status === "error" && styles.errorBorder,
                      status === "success" && styles.successBorder,
                    ]}
                    ref={(ref) => {
                      if (ref) inputs.current[index] = ref;
                    }}
                  />
                ))}
              </View>

              {/* STATUS */}
              {loading && <ActivityIndicator />}

              {status === "success" && (
                <SansText style={styles.successText}>
                  OTP verified successfully
                </SansText>
              )}

              {status === "error" && (
                <SansText style={styles.errorText}>
                  {errorMessage}
                </SansText>
              )}

              {status === "expired" && (
                <SansText style={styles.errorText}>
                  {errorMessage}
                </SansText>
              )}

              {status === "not_received" && (
                <SansText>Didn’t receive the OTP? You can request a new one.</SansText>
              )}

              {!canResend &&
                status === "default" && (
                  <SansText>
                    Resend OTP in {timer}s
                  </SansText>
                )}
            </View>
          </View>

          {canResend && (
            <View style={styles.resendBox}>
              <ReusableButton
                title={loading ? "Please wait..." : "Resend OTP"}
                variant="solid"
                onPress={handleResend}
              />
            </View>
          )}
        </View>
      </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },

  otpBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Satoshi-Bold",
    color: "#816B22",
  },

  content: {
    marginTop: 24,
    gap: 20,
    paddingHorizontal: 16,
  },

  param: {
    fontFamily: "Satoshi-Bold",
  },

  errorBorder: {
    borderColor: "#C2371E",
    color: "#C2371E",
  },

  successBorder: {
    borderColor: "#27AA36",
    color: "#1B7726",
  },

  successText: {
    color: "#1B7726",
  },

  errorText: {
    color: "#C2371E",
  },

  resendBox: {
    padding: 16,
    backgroundColor: "#FBF7EB",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
});