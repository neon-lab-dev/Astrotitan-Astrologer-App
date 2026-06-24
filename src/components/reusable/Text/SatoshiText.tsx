import { Text, TextProps } from "react-native";

export function SatoshiText({
  style,
  numberOfLines,
  ellipsizeMode,
  ...props
}: TextProps) {
  return (
    <Text
      {...props}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[{ fontFamily: "Satoshi-Regular" }, style]}
    />
  );
}
