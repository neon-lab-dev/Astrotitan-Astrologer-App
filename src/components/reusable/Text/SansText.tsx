import { Text, TextProps } from "react-native";

export function SansText({
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
      style={[{ fontFamily: "GeneralSans-Regular" }, style]}
    />
  );
}
