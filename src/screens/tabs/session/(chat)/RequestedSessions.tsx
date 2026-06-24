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
import { SatoshiText } from "../../../../components/reusable/Text/SatoshiText";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

const RequestedSessions = () => {
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  const chats = [
    {
      id: "1",
      name: "Rahul Sharma",
      description:
        "Career & clarity guidance",
      status: "Pending",
      type: "chat",
      image: require("@/assets/images/dummy/experts/expert1.png"),
    },
    {
      id: "2",
      name: "Kajal Agrawal",
      description:
        "Love & Relationship",
      status: "Accepted",
      type: "chat",
      image: require("@/assets/images/dummy/experts/expert2.png"),
    },
    {
      id: "3",
      name: "Rahul Sharma",
      description:
        "Career & clarity guidance",
      status: "Pending",
      type: "chat",
      image: require("@/assets/images/dummy/experts/expert1.png"),
    },
    {
      id: "4",
      name: "Kajal Agrawal",
      description:
        "Love & Relationship",
      status: "Accepted",
      type: "chat",
      image: require("@/assets/images/dummy/experts/expert2.png"),
    },
  ];

  const calls = [
    {
      id: "3",
      name: "Rahul Sharma",
      description:
        "Career & clarity guidance",
      status: "Accepted",
      type: "call",
      image: require("@/assets/images/dummy/experts/expert1.png"),
    },
    {
      id: "4",
      name: "Kajal Agrawal",
      description:
        "Marriage Guidance",
      status: "Pending",
      type: "call",
      image: require("@/assets/images/dummy/experts/expert2.png"),
    },
  ];

  const hasSessions =
    chats.length > 0 || calls.length > 0;

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader>
          <AuthTitle title="Requested Sessions">
            <SansText>
              Your upcoming sessions
            </SansText>
          </AuthTitle>
        </AppHeader>

        <View
          style={{
            flex: 1,
          }}
        >
          {!hasSessions ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
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
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  paddingVertical: 16,
                  gap: 16,
                }}
              >
                {/* CHATS */}

                <View>
                  <ContentSection
                    sectionStyle={{
                      paddingLeft: 16,
                    }}
                    title="Chats"
                  />

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                      false
                    }
                    contentContainerStyle={{
                      paddingTop: 12,
                      paddingLeft: 16,
                    }}
                  >
                    {chats.map((item) => (
                      <SessionCard
                        key={item.id}
                        {...item}
                        onPress={() =>
                          navigation.navigate(
                            "AstrologerChatScreen"
                          )
                        }
                      />
                    ))}
                  </ScrollView>
                </View>

                {/* CALLS */}

                <View>
                  <ContentSection
                    sectionStyle={{
                      paddingLeft: 16,
                    }}
                    title="Calls"
                  />

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={
                      false
                    }
                    contentContainerStyle={{
                      paddingTop: 12,
                      paddingLeft: 16,
                    }}
                  >
                    {calls.map((item) => (
                      <SessionCard
                        key={item.id}
                        {...item}
                        onPress={() => {}}
                      />
                    ))}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          )}

          <ReusableButton
            title="View Astrologers"
            style={{  margin:16, }}
            onPress={() =>
              navigation.navigate(
                "AstrologerScreen"
              )
            }
          />
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default RequestedSessions;

const SessionCard = ({
  name,
  image,
  description,
  type,
  status,
  onPress,
}: any) => {
  const showActionButton =
    status !== "Pending";

  const getStatusColor = () => {
    switch (status) {
      case "Accepted":
        return "#E8F8EE";
      case "Completed":
        return "#EAF3FF";
      case "Rejected":
        return "#FDEDED";
      default:
        return "#FFF4E5";
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case "Accepted":
        return "#1E8E5A";
      case "Completed":
        return "#1D4ED8";
      case "Rejected":
        return "#D32F2F";
      default:
        return "#B7791F";
    }
  };

  return (
    <View
      style={{
        width: 170,
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#D4AF37",
      }}
    >
      <Image
        source={image}
        style={{
          width: "100%",
          height: 170,
          borderRadius: 10,
        }}
      />

      <SatoshiText
        numberOfLines={1}
        style={{
          textAlign: "center",
          marginTop: 12,
          fontSize: 16,
          fontFamily: "Satoshi-Bold",
        }}
      >
        {name}
      </SatoshiText>

      <SansText
        numberOfLines={2}
        style={{
          marginTop: 4,
          textAlign: "center",
          fontSize: 13,
          color: "#666",
          minHeight: 38,
        }}
      >
        {description}
      </SansText>

      {!showActionButton ? (
        <View
          style={{
            alignSelf: "center",
            marginTop: 8,
            backgroundColor:
              getStatusColor(),
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 100,
          }}
        >
          <SansText
            style={{
              color:
                getStatusTextColor(),
              fontSize: 12,
            }}
          >
            {status}
          </SansText>
        </View>
      ) : (
        <TouchableOpacity
          disabled={type === "call"}
          onPress={() => {
            if (type === "chat") {
              onPress?.();
            }
          }}
          style={{
            backgroundColor:
              type === "call"
                ? "#E5E5E5"
                : "#D4AF37",
            paddingVertical: 10,
            borderRadius: 8,
          
          }}
        >
          <SansText
            style={{
              textAlign: "center",
              color:
                type === "call"
                  ? "#888"
                  : "#FFF",
              fontFamily:
                "Satoshi-Bold",
            }}
          >
            {type === "chat"
              ? "Start Chat"
              : "Start Call"}
          </SansText>
        </TouchableOpacity>
      )}
    </View>
  );
};