import SkeletonLoader from "@/components/reusable/SkeletonLoader/SkeletonLoade";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

const SCREEN_WIDTH =
    Dimensions.get("window").width;

const AstrologerDetailSkeleton =
    () => {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        paddingBottom: 140,
                    }}
                >
                    {/* HERO */}

                    <View
                        style={
                            styles.header
                        }
                    >
                        <SkeletonLoader width={SCREEN_WIDTH} height={SCREEN_WIDTH} borderBottomLeftRadius={12} borderBottomRightRadius={12} borderTopLeftRadius={0} borderTopRightRadius={0}
                            array={[1]}
                        />

                        {/* BACK BUTTON */}

                        <View
                            style={
                                styles.backBtn
                            }
                        >
                            <SkeletonLoader
                                width={48}
                                height={48}
                                borderRadius={100}
                                array={[1]}
                            />
                        </View>

                        {/* OVERLAY */}

                        <View
                            style={
                                styles.overlayContent
                            }
                        >
                            <SkeletonLoader
                                width="72%"
                                height={32}
                                borderRadius={10}
                                array={[1]}
                            />

                            <SkeletonLoader
                                width="48%"
                                height={18}
                                borderRadius={8} array={[1]}
                            />

                            <SkeletonLoader
                                width={180}
                                height={40}
                                borderRadius={100}
                                array={[1]}
                            />
                        </View>
                    </View>

                    {/* CONTENT */}

                    <View
                        style={styles.container}
                    >
                        {/* STATS */}

                        <View
                            style={styles.statsRow}
                        >
                            {[1, 2].map(
                                (item) => (
                                    <View
                                        key={item}
                                        style={
                                            styles.statBox
                                        }
                                    >
                                        <SkeletonLoader
                                            width={80}
                                            height={24}
                                            borderRadius={8}
                                            array={[1]}
                                        />

                                        <SkeletonLoader
                                            width="70%"
                                            height={14}
                                            borderRadius={6}
                                            array={[1]}
                                        />

                                        <SkeletonLoader
                                            width="55%"
                                            height={14}
                                            borderRadius={6}
                                            array={[1]}
                                        />
                                    </View>
                                )
                            )}
                        </View>

                        {/* ABOUT */}

                        <View
                            style={{ gap: 32, }}
                        >
                            {[1, 2, 3].map(
                                (section) => (
                                    <View
                                        key={section}
                                    >
                                        {/* TITLE */}

                                        <SkeletonLoader
                                            width="45%"
                                            height={22}
                                            borderRadius={8}
                                            array={[1]}
                                        />

                                        {/* SUBTEXT */}

                                        <View
                                            style={{
                                                marginTop: 12,
                                                gap: 10,
                                            }}
                                        >
                                            <SkeletonLoader
                                                width="100%"
                                                height={14}
                                                borderRadius={6}
                                                array={[1]}
                                            />

                                            <SkeletonLoader
                                                width="88%"
                                                height={14}
                                                borderRadius={6}
                                                array={[1]}
                                            />

                                            <SkeletonLoader
                                                width="76%"
                                                height={14}
                                                borderRadius={6}
                                                array={[1]}
                                            />
                                        </View>

                                        {/* TAGS */}
                                        <View
                                            style={
                                                styles.skeletonTags
                                            }
                                        >
                                            {[1, 2, 3].map(
                                                (tag) => (
                                                    <SkeletonLoader
                                                        key={tag} width={90} height={42} borderRadius={12} array={[1,]}
                                                    />
                                                )
                                            )}
                                        </View>
                                    </View>
                                )
                            )}
                        </View>
                    </View>
                </ScrollView>

            </View>
        );
    };

export default AstrologerDetailSkeleton;

const styles =
    StyleSheet.create({
        header: {
            position: "relative",
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: "#D4AF37",
            backgroundColor: "#FBF7EB",
            borderBottomRightRadius: 24,
            borderBottomLeftRadius: 24,
            overflow: "hidden"
        },

        backBtn: {
            position: "absolute",
            top: 36,
            left: 20,
        },

        overlayContent: {
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 24,
            gap: 12,
        },

        container: {
            padding: 16,
            gap: 28,
        },

        statsRow: {
            flexDirection: "row",
            gap: 12,
        },

        statBox: {
            flex: 1,
            backgroundColor: "#FBF7EB",
            borderWidth: 1,
            borderColor: "#D4AF37",
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
            gap: 12,
        },

        skeletonTags: {
            flexDirection: "row",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 18,
        },

        fixedBottom: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: "row",
            gap: 12,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
            backgroundColor:
                "#FBF7EB",
        },
    });