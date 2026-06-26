import React from "react";
import { View } from "react-native";
import SkeletonLoader from "../../../reusable/SkeletonLoader/SkeletonLoade";

const SessionCardSkeleton = () => {
  return (
    <SkeletonLoader
      width={"100%"}
      height={110}
      array={[1, 2, 3]}
      borderRadius={16}
      direction="column"
      innerSkeleton={
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          {/* Left */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#F4E8BE",
              }}
            />

            <View
              style={{
                marginLeft: 14,
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 120,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#F4E8BE",
                  marginBottom: 10,
                }}
              />

              <View
                style={{
                  width: 100,
                  height: 12,
                  borderRadius: 8,
                  backgroundColor: "#F4E8BE",
                  marginBottom: 10,
                }}
              />

              <View
                style={{
                  width: 70,
                  height: 12,
                  borderRadius: 8,
                  backgroundColor: "#F4E8BE",
                }}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={{ gap: 8 }}>
            <View
              style={{
                width: 90,
                height: 30,
                borderRadius: 10,
                backgroundColor: "#F4E8BE",
              }}
            />

            <View
              style={{
                width: 90,
                height: 30,
                borderRadius: 10,
                backgroundColor: "#F4E8BE",
              }}
            />
          </View>
        </View>
      }
    />
  );
};

export default SessionCardSkeleton;