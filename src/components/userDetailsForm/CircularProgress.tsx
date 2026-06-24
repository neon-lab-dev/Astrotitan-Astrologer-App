// components/CircularProgress.tsx

import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
    step: number;
    total: number;
    size?: number;
    strokeWidth?: number;
}

const CircularProgress: React.FC<Props> = ({
    step,
    total,
    size = 48,
    strokeWidth = 10,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const progress = (step + 1) / total;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    stroke="#E6D18B"
                    fill="transparent"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />

                {/* Progress Arc */}
                <Circle
                    stroke="#D4AF37"
                    fill="transparent"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
        </View>
    );
};

export default CircularProgress;