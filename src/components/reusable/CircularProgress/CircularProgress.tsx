import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SatoshiText } from '../Text/SatoshiText';

interface Props {
  value: number; // ✅ percentage (0–100)
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: React.FC<Props> = ({
  value,
  size = 90,
  strokeWidth = 18,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = value / 100; // ✅ FIXED
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg width={size} height={size}>
        {/* Background */}
        <Circle
          stroke="#E6D18B"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <Circle
          stroke="#D4AF37"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center Text */}
      <SatoshiText
        style={{
          position: 'absolute',
          fontSize: 16,
          fontFamily:"Satoshi-Bold"
        }}
      >
        {value}%
      </SatoshiText>
    </View>
  );
};

export default CircularProgress;