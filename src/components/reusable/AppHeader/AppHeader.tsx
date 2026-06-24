
import React, { useCallback, useEffect } from "react";
import { BackHandler, StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
type Props = {
  showBack?: boolean;
  onPressBack?: () => void;

  backText?: React.ReactNode;
  backgroundColor?: string;
  showBorder?: boolean;
  borderColor?: string;

  children?: React.ReactNode;
};

const AppHeader = ({
  showBack = true,
  onPressBack,
  backText,
  backgroundColor = "#EDDEAD",
  showBorder = true,
  borderColor = "#E6D18B",
  children,
}: Props) => {
 const navigation = useNavigation();

  const handleBack = useCallback(() => {
  if (onPressBack) {
    onPressBack();
  } else {
    navigation.goBack();
  }

  return true;
}, [onPressBack, navigation]);

  // 🔥 SYSTEM BACK CONTROL
  useEffect(() => {
    if (!showBack) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack
    );

    return () => subscription.remove();
  }, [showBack, handleBack]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderBottomWidth: showBorder ? 1 : 0,
          borderBottomColor: borderColor,
        },
      ]}
    >
      {/* 🔥 TOP ROW */}
      {showBack && (
        <View style={styles.backRow}>
          <TouchableOpacity
            onPress={() => {
              if (onPressBack) {
                onPressBack();
              } else {
               navigation.goBack();
              }
            }}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
          </TouchableOpacity>

          {/* TEXT */}
          <View style={{ flex: 1 }}>{backText}</View>
        </View>
      )}

      {/* 🔥 CONTENT BELOW */}
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 12, 
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  childrenContainer: {
    justifyContent: "space-between", // optional
  },
});