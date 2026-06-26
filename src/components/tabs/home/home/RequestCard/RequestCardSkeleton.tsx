import React from "react";
import { View } from "react-native";
import SkeletonLoader from "../../../../reusable/SkeletonLoader/SkeletonLoade";

const RequestCardSkeleton = () => {
    return (
        <View style={{
            borderWidth: 1,
            borderRadius: 12,
            borderColor: "#D4AF37",
            backgroundColor: "#FBF7EB",
        }}>
            <SkeletonLoader
                width={244}
                height={255}
                array={[1]}
                borderRadius={12}

                innerSkeleton={
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            padding: 20,
                        }}
                    >
                        {/* Avatar */}
                        <View
                            style={{
                                width: 84,
                                height: 84,
                                borderRadius: 42,
                                backgroundColor: "#F4E8BE",
                                marginBottom: 15,
                            }}
                        />

                        {/* Name */}
                        <View
                            style={{
                                width: 120,
                                height: 18,
                                borderRadius: 8,
                                backgroundColor: "#F4E8BE",
                                marginBottom: 10,
                            }}
                        />

                        {/* Type */}
                        <View
                            style={{
                                width: 150,
                                height: 14,
                                borderRadius: 8,
                                backgroundColor: "#F4E8BE",
                                marginBottom: 25,
                            }}
                        />

                        {/* Buttons */}
                        <View
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                gap: 10,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    height: 42,
                                    borderRadius: 12,
                                    backgroundColor: "#F4E8BE",
                                }}
                            />

                            <View
                                style={{
                                    flex: 1,
                                    height: 42,
                                    borderRadius: 12,
                                    backgroundColor: "#F4E8BE",
                                }}
                            />
                        </View>
                    </View>
                }
            /></View>
    );
};

export default RequestCardSkeleton;