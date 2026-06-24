import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
    height?: number;
    showDate?: boolean;
    showDescription?: boolean;
    showCTA?: boolean;
};

const FeatureCardSkeleton = ({
    height = 256,
    showDate = true,
    showDescription = true,
    showCTA = true,
}: Props) => {
    return (
        <View
            style={[
                styles.container,
                {
                    height,
                },
            ]}
        >
            {/* TOP DATE */}

            <View style={styles.topRow}>
                {showDate && (
                    <SkeletonLoader
                        width={90}
                        height={32}
                        borderRadius={20}
                        array={[1]}
                    />
                )}
            </View>

            {/* BOTTOM CONTENT */}

            <View style={styles.bottomContent}>
                {/* TITLE */}

                <SkeletonLoader
                    width={"75%"}
                    height={22}
                    borderRadius={8}
                    array={[1]}
                />

                {/* DESCRIPTION */}

                {showDescription && (
                    <>
                        <SkeletonLoader
                            width={"95%"}
                            height={14}
                            borderRadius={6}
                            array={[1]}
                        />

                        <SkeletonLoader
                            width={"80%"}
                            height={14}
                            borderRadius={6}
                            array={[1]}
                        />
                    </>
                )}

                {/* CTA */}

                {showCTA && (
                    <View
                        style={{
                            marginTop: 8,
                        }}
                    >
                        <SkeletonLoader
                            width={120}
                            height={16}
                            borderRadius={6}
                            array={[1]}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default FeatureCardSkeleton;

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderColor: "#D4AF37",
        backgroundColor: "#FBF7EB",
        overflow: "hidden",
        padding: 24,
        justifyContent: "space-between",
        borderWidth:1
    },

    topRow: {
        alignItems: "flex-start",
    },

    bottomContent: {
        gap: 10,
    },
});