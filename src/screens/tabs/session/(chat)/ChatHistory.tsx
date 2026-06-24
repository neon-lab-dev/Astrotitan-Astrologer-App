import ArrowRoundedIcon from "@/assets/icons/actions/arrow-down-round.svg";
import NoteIcon from "@/assets/icons/navigation/note.svg";


import React from "react";

import {
    Image,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import AnimatedScreen from "../../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../../components/layout/ScreenWrapper";
import AppHeader from "../../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../../components/auth/AuthTitle";
import { SansText } from "../../../../components/reusable/Text/SansText";
import ContentSection from "../../../../components/reusable/ContentSectoin/ContentSection";
import ReusableButton from "../../../../components/reusable/ReusableButton/ReusableButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";

const ChatHistory = () => {
    type NavigationProp =
        NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();
    const dummySessions = [
        {
            title: "Today",

            data: [
                {
                    id: "1",

                    name: "Rahul Sharma",

                    time: "09:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert1.png"),
                },

                {
                    id: "2",

                    name: "Kajal Agrawal",

                    time: "08:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert2.png"),
                },
            ],
        },

        {
            title: "Yesterday",

            data: [
                {
                    id: "3",

                    name: "Rahul Sharma",

                    time: "09:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert1.png"),
                },

                {
                    id: "4",

                    name: "Kajal Agrawal",

                    time: "08:30 AM",

                    type: "Career & clarity guidance",

                    image: require("@/assets/images/dummy/experts/expert2.png"),
                },
            ],
        },
    ];

    const sessions = dummySessions;

    const hasSessions =
        sessions.length > 0;

    return (
        <AnimatedScreen>
            <ScreenWrapper>
                <AppHeader
                >
                    <AuthTitle title="Session History">
                        <SansText>
                            Review your past
                            consultations.
                        </SansText>
                    </AuthTitle>
                </AppHeader>

                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 16,
                    }}
                >
                    {!hasSessions ? (
                        /* EMPTY STATE */

                        <View
                            style={{
                                flex: 1,
                                justifyContent:
                                    "center",
                                alignItems: "center",
                            }}
                        >
                            <NoteIcon
                                height={124}
                                width={124}
                            />

                            <SansText
                                style={{
                                    marginTop: 16,
                                    textAlign: "center",
                                }}
                            >
                                No sessions yet
                            </SansText>
                        </View>
                    ) : (
                        /* LIST */

                        <ScrollView
                            showsVerticalScrollIndicator={
                                false
                            }
                        >
                            <View
                                style={{
                                    paddingVertical: 16,
                                }}
                            >
                                {sessions.map(
                                    (
                                        section,
                                        sectionIndex
                                    ) => (
                                        <View
                                            key={
                                                sectionIndex
                                            }
                                        >
                                            {/* SECTION TITLE */}

                                            <ContentSection
                                                title={
                                                    section.title
                                                }
                                            />

                                            {/* ITEMS */}

                                            {section.data.map(
                                                (item) => (
                                                    <SessionItem
                                                        key={
                                                            item.id
                                                        }
                                                        name={
                                                            item.name
                                                        }
                                                        time={
                                                            item.time
                                                        }
                                                        image={
                                                            item.image
                                                        }
                                                        description={
                                                            item.type
                                                        }
                                                        onPress={() => {
                                                            navigation.navigate(
                                                             "AstrologerChatScreen"
                                                            );
                                                        }}
                                                    />
                                                )
                                            )}
                                        </View>
                                    )
                                )}
                            </View>
                        </ScrollView>
                    )}

                    {/* BUTTON */}

                    <ReusableButton
                        onPress={() =>
                            navigation.navigate(
                                "RequestedSessions"
                            )
                        }
                        style={{marginVertical:16}}
                        title="View Requested Sessions"
                    />
                </View>
            </ScreenWrapper>
        </AnimatedScreen>
    );
};

export default ChatHistory;

/* ---------------- SESSION ITEM ---------------- */

const SessionItem = ({
    name,
    time,
    image,
    description = "Career & clarity guidance",
    onPress,
}: any) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent:
                    "space-between",
                paddingVertical: 20,
            }}
        >
            {/* LEFT */}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    flex: 1,
                }}
            >
                {/* IMAGE */}

                <Image
                    source={image}
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: 100,
                        backgroundColor:
                            "#D8D8D8",
                    }}
                />

                {/* CONTENT */}

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    {/* TOP */}

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 12,
                        }}
                    >
                        <SatoshiText
                            numberOfLines={1}
                            style={{
                                flex: 1,
                                fontSize: 18,
                                color: "#0D0D0D",
                                fontFamily:
                                    "Satoshi-Bold",
                            }}
                        >
                            {name}
                        </SatoshiText>

                        <SansText
                            style={{
                                fontSize: 12,
                                color: "#757575",
                            }}
                        >
                            {time}
                        </SansText>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 12,
                        }}
                    >
                        <SansText
                            numberOfLines={1}
                            style={{
                                marginTop: 4,
                                fontSize: 15,
                                color: "#4B4B4B",
                                lineHeight: 22,
                            }}
                        >
                            {description}
                        </SansText>

                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [{ rotate: "-90deg", },],
                            }}
                        >
                            <ArrowRoundedIcon
                                width={20}
                                height={20}
                            />
                        </View>
                    </View>

                    {/* DESCRIPTION */}


                </View>
            </View>

            {/* RIGHT */}


        </TouchableOpacity>
    );
};