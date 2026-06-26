import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import ReusableButton from "../../../reusable/ReusableButton/ReusableButton";
import { SansText } from "../../../reusable/Text/SansText";
import { SatoshiText } from "../../../reusable/Text/SatoshiText";
import StarIcon from '@/assets/icons/visual/star.svg';

type Props = {
    item: any;
    onPress: () => void;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onChat: (item: any) => void;
};

const SessionCard = ({
    item,
    onPress,
    onAccept,
    onReject,
    onChat,
}: Props) => {
    const [imageError, setImageError] = useState(false);
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={styles.card}
            onPress={onPress}
        >
            <View style={styles.leftSection}>
                <Image
                    source={
                        item?.user?.profilePicture && !imageError
                        && { uri: item.user.profilePicture }
                    }
                    onError={() => setImageError(true)}
                    style={styles.userImage}
                />

                <View style={{ flex: 1 }}>
                    <SatoshiText style={styles.userName}>
                        {item?.user?.fullName}
                    </SatoshiText>

                    <View style={styles.statusRow}>
                        <SansText style={styles.durationText}>
                            {`${item?.method} Request`}
                        </SansText>
                    </View>

                    <View style={styles.ratingRow}>
                        <StarIcon width={24} height={24} />

                        <SansText style={styles.ratingText}>
                            {item?.rating ?? "N/A"}
                        </SansText>
                    </View>
                </View>
            </View>

            {item?.status === "pending" ? (
                <View style={styles.buttonContainer}>
                    <ReusableButton
                        variant="solid"
                        title="Accept"
                        height={30}
                        textSize={12}
                        style={styles.button}
                        onPress={() => onAccept(item._id)}
                    />

                    <ReusableButton
                        variant="outline"
                        title="Decline"
                        height={30}
                        textSize={12}
                        style={styles.button}
                        onPress={() => onReject(item._id)}
                    />
                </View>
            ) : item?.status === "accepted" ? (
                <View style={styles.chatButtonContainer}>
                    <ReusableButton
                        variant="solid"
                        title={`${item.method} Now`}
                        height={32}
                        textSize={12}
                        style={styles.button}
                        onPress={() => onChat(item)}
                    />
                </View>
            ) : (
                <View style={styles.chatButtonContainer}>
                    <View

                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: "#D4AF37",
                            backgroundColor: item.status === "ended" ? "#E8CC7254" : "#F51E1E8F",
                        }}
                    > <SansText>{item.status === "ended" ? "Session Ended" : "Declined"}</SansText></View>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default SessionCard;

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                "#F8F1D7",
        },

        tabsContainer: {
            flexDirection: "row",

            position:
                "relative",

        },

        tabItem: {
            flex: 1,

            alignItems:
                "center",

            justifyContent:
                "center",

            paddingBottom: 16,

            paddingTop: 2,
        },

        tabInner: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },

        tabText: {
            fontSize: 16,
            color: "#0D0D0D",
            fontFamily:
                "GeneralSans-Medium",
        },

        activeTabText: {
            fontFamily:
                "GeneralSans-Bold",
        },

        animatedIndicator: {
            position: "absolute",

            bottom: 0,

            height: 3,

            backgroundColor:
                "#D4AF37",

            borderRadius: 999,
        },

        card: {
            flexDirection: "row",

            justifyContent:
                "space-between",

            alignItems: "center",

            padding: 14,
        },


        statusText: {
            fontSize: 14,
        },


        rightSection: {
            alignItems: "flex-end",
            justifyContent:
                "space-between",
            gap: 16,
        },

        tag: {
            // height: 28,

            borderRadius: 12,

            backgroundColor:
                "#D4AF37",

            justifyContent:
                "center",

            alignItems:
                "center",

            paddingHorizontal: 12,
            paddingVertical: 9
        },

        tagText: {
            fontSize: 12,
            color: "#0D0D0D",
        },
        leftSection: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },

        userImage: {
            width: 60,
            height: 60,
            borderRadius: 30,
            marginRight: 12,
        },

        userName: {
            fontSize: 16,
        },

        statusRow: {
            marginTop: 4,
        },

        durationText: {
            fontSize: 13,
        },

        ratingRow: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
            gap: 4,
        },

        ratingText: {
            fontSize: 13,
        },

        buttonContainer: {
            justifyContent: "center",
            gap: 8,
            marginLeft: 12,
        },

        chatButtonContainer: {
            justifyContent: "center",
            marginLeft: 12,
        },

        button: {
            borderRadius: 10,
            minWidth: 90,
        },
    });