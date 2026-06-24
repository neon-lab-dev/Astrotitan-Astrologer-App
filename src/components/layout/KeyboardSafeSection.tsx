import React from "react";

import {
    StyleProp,
    ViewStyle,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  children: React.ReactNode;

  contentContainerStyle?: StyleProp<ViewStyle>;

  extraScrollHeight?: number;
};

const KeyboardSafeSection = ({
  children,
  contentContainerStyle,
  extraScrollHeight = 20,
}: Props) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        {
          flexGrow: 1,
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={extraScrollHeight}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardSafeSection;