import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenWrapper from "../ScreenWrapper";

type AuthLayoutProps = {
  children: React.ReactNode;
};
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }} // 🔥 IMPORTANT
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={20}
        >
          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}