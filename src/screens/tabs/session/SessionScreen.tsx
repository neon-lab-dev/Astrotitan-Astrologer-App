import ChatIcon from "@/assets/icons/actions/bubble-chat.svg";
import CalenderIcon from "@/assets/icons/navigation/calendar.svg";
import CallIcon from "@/assets/icons/visual/call.svg";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SansText } from "../../../components/reusable/Text/SansText";
// import LinearGradient from "react-native-linear-gradient";
import ContentSection from "../../../components/reusable/ContentSectoin/ContentSection";
import AnimatedScreen from "../../../components/layout/AnimatedScreen";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import AppHeader from "../../../components/reusable/AppHeader/AppHeader";
import AuthTitle from "../../../components/auth/AuthTitle";
import ReusableButton from "../../../components/reusable/ReusableButton/ReusableButton";
import { useNavigation } from "@react-navigation/native";
import { useChangeBookingStatusMutation, useGetMyConsultationBookingsQuery } from "../../../redux/features/consultation/consultationApi";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";
import { setSelectedConsultation } from "../../../redux/features/consultation/consultationChatSlice";
import { useDispatch } from "react-redux";
import SessionCardSkeleton from "../../../components/tabs/session/SessionCard/SessionCardSkeleton";
import SessionCard from "../../../components/tabs/session/SessionCard/SessionCard";
import { formatDate } from "../../../utils/validators/dateValidators";



const SessionsScreen = () => {

  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] =
    useState("calls");
  const [containerWidth, setContainerWidth] =
    useState(0);
  const [refreshing, setRefreshing] =
    useState(false);
  const translateX = useRef(
    new Animated.Value(0)
  ).current;
  const opacity = useRef(
    new Animated.Value(1)
  ).current;

  const tabs = useMemo(
    () => [
      {
        key: "calls",
        label: "Calls",
        icon: CallIcon,
      },

      {
        key: "chats",
        label: "Chats",
        icon: ChatIcon,
      },
    ],
    []
  );

  const TAB_WIDTH =
    containerWidth / tabs.length;

  const handleTabPress = (
    index: number,
    key: string
  ) => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(key);

    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  };



  const [changeBookingStatus, { isLoading }] = useChangeBookingStatusMutation();
  const handleAccept = async (id:any) => {
    try {
      const payload = { status: "accepted" };
      const response = await changeBookingStatus({
        id: id,
        data: payload,
      }).unwrap();

      if (response?.success) {
      }
    } catch (err: any) {
      console.error("Error accepting booking:", err);
    }
  };

  const handleReject = async (id:any) => {
    try {
      const payload = { status: "rejected" };
      const response = await changeBookingStatus({
        id: id,
        data: payload,
      }).unwrap();

      if (response?.success) {
      }
    } catch (err: any) {
      console.error("Error rejecting booking:", err);
    }
  };

  const handleChatNow = (booking: any) => {
    const participant = booking.user;
    const currentParticipantId = booking.astrologer;
    dispatch(
        setSelectedConsultation({
            consultationId: booking._id,
            currentParticipantId: currentParticipantId,
            participant: {
                _id: participant?.accountId,
                name: participant?.fullName,
                firstName: participant?.firstName,
                lastName: participant?.lastName,
                profilePicture: participant?.profilePicture || "",
                accountId: participant?.accountId,
                role: "user",
            },
        })
    );

    // Navigate to chat page
    navigation.navigate("AstrologerChatScreen", { id: booking?._id,profilePicture:booking?.user?.profilePicture,name:booking?.user?.fullName, consultationFor: booking.consultationFor, })
  };

  const renderContent =
    () => {
      return (
        <View>
          {/* FILTER */}




          {/* TODAY */}

          <View
            style={
              styles.section
            }
          >
            <ContentSection title="Today" sectionStyle={{ marginBottom: 12 }} />

            <View
              style={
                styles.cardsContainer
              }
            >
              <View style={styles.cardsContainer}>
                {isBookingLoading ? (
                  <SessionCardSkeleton />
                ) : (
                  bookings.map((item: any) => (
                    <SessionCard
                      key={item._id}
                      item={item}
                      onPress={() =>
                        navigation.navigate("SessionHistoryDetailsScreen", {
                          sessionType: item.method,
                          userName: item?.user?.fullName,
                          date: formatDate(item.createdAt),
                          time: "10:30 AM",
                          duration: item?.duration,
                          status: item?.status,
                          rating: item?.rating,
                          subscriptionType: item?.type,
                          image: item?.user?.profilePicture,
                        })
                      }
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onChat={handleChatNow}
                    />
                  ))
                )}
              </View>
            </View>
          </View>
        </View>
      );
    };


  const {
    data: consultationBookings,
    isLoading: isBookingLoading,refetch:bookingRefetch
  } = useGetMyConsultationBookingsQuery({});
  const bookings = consultationBookings?.data?.data || [];

  return (
    // <AnimatedScreen>
    <ScreenWrapper>
      <View style={styles.container}>
        {/* HEADER */}

        <AppHeader
          showBack={false}
        >
          <AuthTitle title="Sessions">
            <SansText>
              Review your
              completed chat
              and call
              sessions.
            </SansText>
          </AuthTitle>

          {/* TABS */}

          <View
            style={
              styles.tabsContainer
            }
            onLayout={(e) =>
              setContainerWidth(
                e.nativeEvent.layout.width
              )
            }
          >
            {tabs.map(
              (tab, index) => {
                const isActive =
                  activeTab ===
                  tab.key;

                const Icon =
                  tab.icon;

                return (
                  <Pressable
                    key={tab.key}
                    style={
                      styles.tabItem
                    }
                    onPress={() =>
                      handleTabPress(
                        index,
                        tab.key
                      )
                    }
                  >
                    <View
                      style={
                        styles.tabInner
                      }
                    >
                      <Icon
                        width={18}
                        height={18}
                      />

                      <SansText
                        style={[
                          styles.tabText,

                          isActive &&
                          styles.activeTabText,
                        ]}
                      >
                        {
                          tab.label
                        }
                      </SansText>
                    </View>
                  </Pressable>
                );
              }
            )}

            <Animated.View
              style={[
                styles.animatedIndicator,
                {
                  width:
                    TAB_WIDTH,

                  transform: [
                    {
                      translateX,
                    },
                  ],
                },
              ]}
            />
          </View>
        </AppHeader>

        {/* BODY */}
        <View
          style={
            styles.filterRow
          }
        >
          <View />

          <ReusableButton title="Date Filter"
            onPress={() => { }}
            variant="outline"
            iconPosition="left"
            // iconName={CalenderIcon} 
            icon={<CalenderIcon
              width={24}
              height={24}
            />}
            iconSize={20}
            width={160}
            style={{ borderRadius: 16 }} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              tintColor="#D4AF37"
              colors={[
                "#D4AF37",
              ]}
              progressBackgroundColor="#FBF7EB"
            />
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 18,
            paddingBottom: 140,
          }}
        >
          <Animated.View
            style={{
              opacity,
            }}
          >
            {renderContent()}
          </Animated.View>
        </ScrollView>
      </View>
    </ScreenWrapper>
    // </AnimatedScreen>
  );
};

export default SessionsScreen;

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

    filterRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",

      alignItems: "center",

      marginTop: 16,
      paddingHorizontal: 16
    },

    filterButton: {
      height: 42,

      borderRadius: 12,

      borderWidth: 1.2,

      borderColor:
        "#D4AF37",

      backgroundColor:
        "#FBF7EB",

      paddingHorizontal: 14,

      flexDirection: "row",

      alignItems: "center",

      gap: 8,
    },

    filterText: {
      fontSize: 14,
      color: "#4A4A4A",
    },

    section: {
      marginBottom: 24,
    },

    sectionTitle: {
      fontSize: 16,
      color: "#0D0D0D",
      fontFamily:
        "Satoshi-Bold",
      marginBottom: 12,
    },

    cardsContainer: {
      backgroundColor:
        "#FBF7EB",

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        "#D4AF37",

      overflow: "hidden",
    },

    card: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center",

      padding: 14,
    },

    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },

    userImage: {
      width: 84,
      height: 84,
      borderRadius: 12,
    },

    userName: {
      fontSize: 18,
      color: "#0D0D0D",
      lineHeight: 26,
      fontFamily:
        "Satoshi-Bold",
      marginBottom: 4,
    },

    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 4,
    },

    durationText: {
      fontSize: 14,
      color: "#0D0D0D",
    },

    statusText: {
      fontSize: 14,
    },

    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    ratingText: {
      fontSize: 16,
      color: "#0D0D0D",
      fontFamily:
        "GeneralSans-Bold",
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
  });