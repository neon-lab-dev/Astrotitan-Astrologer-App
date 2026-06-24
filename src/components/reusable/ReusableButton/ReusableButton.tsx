import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SatoshiText } from "../Text/SatoshiText";
import { ICONS } from "../../../assets/svg";
type ButtonVariant = "solid" | "outline" | "ghost" | "error";

type Props = {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  iconName?: keyof typeof ICONS;    // 👈 ADD THIS
  iconSize?: number;
  /** NEW FLEXIBILITY */
  width?: number | "auto" | string;
  height?: number;
  textSize?: number;
  paddingHorizontal?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
};

export default function ReusableButton({
  title,
  onPress,
  variant = "solid",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  iconName,         // fallback
  iconSize = 20,
  style,
  width,
  height,
  textSize,
  backgroundColor,
  borderColor,
  textColor,
  paddingHorizontal,
}: Props) {
  const IconComponent = iconName ? ICONS[iconName] : null;
  const sizeStyle = [
    width === "auto" && { width: "auto" },
    typeof width === "number" && { width },
    typeof height === "number" && { height },
    {
      paddingHorizontal:
        typeof paddingHorizontal === "number" ? paddingHorizontal : 18,
    },
  ];

  const content = (
    <View
      style={[
        styles.content,
        iconPosition === "right" && { flexDirection: "row-reverse" },
      ]}
    >
      {(IconComponent || icon) && (
        <View style={styles.icon}>
          {IconComponent ? (
            <IconComponent width={iconSize} height={iconSize} />
          ) : (
            icon
          )}
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          color={
            textColor
              ? textColor
              : variant === "outline"
                ? "#D6A850"
                : variant === "error"
                  ? "#F9EBE9"
                  : "#FFFFFF"
          }
        />
      ) : (
        <SatoshiText
          style={[
            styles.SatoshiText,
            typeof textSize === "number" && { fontSize: textSize },

            textColor && { color: textColor },

            !textColor && variant === "outline" && { color: "#0D0D0D" },
            !textColor && variant === "ghost" && { color: "#0D0D0D" },
            !textColor && variant === "solid" && { color: "#0D0D0D" },
            !textColor && variant === "error" && { color: "#F9EBE9" },
          ]}
        >
          {title}
        </SatoshiText>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.base,
        ...sizeStyle,

        variant === "solid" && [
          styles.solid,
          backgroundColor && { backgroundColor },
          borderColor && { borderColor },
        ],

        variant === "outline" && [
          styles.outline,
          borderColor && { borderColor },
        ],

        variant === "ghost" && [
          styles.ghost,
          backgroundColor && { backgroundColor },
        ],
        variant === "error" && [
          styles.error,
          backgroundColor && { backgroundColor },
        ],

        disabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: 999, // 👈 makes it pill shape
    alignItems: "center",
    justifyContent: "center",
  },
  solid: {
    backgroundColor: "#D4AF37",
    borderColor: "#D4AF37",
    borderWidth: 1.5,
  },

  outline: {
    borderWidth: 2,
    borderColor: "#D4AF37",
    backgroundColor: "transparent",
  },

  ghost: {
    backgroundColor: "transparent",
  },
  error: {
    backgroundColor: "#C2371E",
  },

  disabled: {
    opacity: 0.6,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  SatoshiText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Satoshi-Medium",
    letterSpacing: 0.08,
  },
  icon: {
    height: 24,
    width: 24,
  },
});
