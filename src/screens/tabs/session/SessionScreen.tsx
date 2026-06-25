import ChatIcon from "@/assets/icons/actions/bubble-chat.svg";
import CalenderIcon from "@/assets/icons/navigation/calendar.svg";
import CallIcon from "@/assets/icons/visual/call.svg";
import StarIcon from "@/assets/icons/visual/star.svg";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SatoshiText } from "../../../components/reusable/Text/SatoshiText";
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



const SessionsScreen = () => {

  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const dispatch=useDispatch();
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

  const renderSessionCard = (
    item: any
  ) => {
    const isCompleted =
      item.status ===
      "Completed";

    const isCancelled =
      item.status ===
      "Cancelled";

    const isMissed =
      item.status ===
      "Missed";

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => {
          navigation.navigate(
            "SessionHistoryDetailsScreen",
            {
              sessionType:
                "call",

              userName:
                item.name,

              date:
                "17 February 2026",

              time:
                "10:30 AM",

              duration:
                item.duration,

              status:
                item.status,

              rating:
                item.rating,

              subscriptionType:
                item.type,

              image:
                item.image,
            },
          );
        }}
      >
        {/* LEFT */}

        <View
          style={styles.leftSection}
        >
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.userImage}
          />

          <View
            style={{
              flex: 1,
            }}
          >
            <SatoshiText
              style={styles.userName}
            >
              {item?.user?.fullName}
            </SatoshiText>

            <View style={styles.statusRow}>
              <SansText style={styles.durationText}>Request Type : {item?.method}</SansText>

            </View>

            <View
              style={styles.ratingRow}
            >
              <StarIcon
                width={24}
                height={24}
              />

              <SansText style={styles.ratingText}  >
                {item.rating}
              </SansText>
            </View>
          </View>
        </View>

        {/* RIGHT */}

        {/* <View
          style={styles.rightSection}
        >
          {item.type ===
            "Subscription" ? (
            <LinearGradient
              colors={[
                "#D4AF37",
                "#E6D18B",
              ]}
              start={{
                x: 1,
                y: 0,
              }}
              end={{
                x: 0,
                y: 0,
              }}
              style={styles.tag}
            >
              <SansText
                style={
                  styles.tagText
                }
              >
                {item.type}
              </SansText>
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.tag,

                {
                  backgroundColor:
                    "transparent",

                  borderWidth: 1,

                  borderColor:
                    "#D4AF37",
                },
              ]}
            >
              <SansText
                style={[
                  styles.tagText,

                  {
                    color:
                      "#7A5B00",
                  },
                ]}
              >
                {item.type}
              </SansText>
            </View>
          )}

        
        </View> */}
        {item?.status === "pending" ? (<View style={{ gap: 6 }}>
          <View style={{ flex: 1 }}><ReusableButton variant="solid" style={{ borderRadius: 12, paddingVertical: 0 }} textSize={12} height={24} onPress={() => { handleAccept(item?._id) }} title="Accept" /></View>
          <View style={{ flex: 1 }}><ReusableButton variant="outline" style={{ borderRadius: 12, paddingVertical: 0 }} textSize={12} height={24} onPress={() => { handleReject(item?._id) }} title="Reject" /></View>

        </View>) : (<View style={{ flex: 1 }}><ReusableButton variant="solid" style={{ borderRadius: 12, paddingVertical: 0 }} textSize={12} height={24}
          onPress={() => { handleChatNow(item) }} title="Chat Now" /></View>)}
      </TouchableOpacity>
    );
  };

  const [changeBookingStatus, { isLoading }] = useChangeBookingStatusMutation();
  const handleAccept = async (id) => {
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

  const handleReject = async (id) => {
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

  const handleChatNow = (booking:any) => {
    // Astrologer is the current user, participant is always the User
    const participant = booking.user;

    // ✅ Astrologer's Object ID (from booking.astrologer._id)
    const currentParticipantId = booking.astrologer;

    // Store selected consultation in Redux
    dispatch(
      setSelectedConsultation({
        consultationId: booking._id,
        currentParticipantId: currentParticipantId,
        participant: {
          _id: participant?._id,
          name: participant?.fullName || participant?.displayName || "User",
          firstName: participant?.firstName,
          lastName: participant?.lastName,
          profilePicture: participant?.profilePicture,
          accountId: participant?.accountId,
          role: "user", // Participant is always the user in astrologer panel
        },
      })
    );

    // Navigate to chat page
    navigation.navigate("AstrologerChatScreen", { id: booking?._id })
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
              {bookings.map(
                renderSessionCard
              )}
            </View>
          </View>
        </View>
      );
    };


  const { data: consultationBookings } = useGetMyConsultationBookingsQuery({});
  const bookings = consultationBookings?.data?.bookings?.data || [];
  console.log(consultationBookings,"booking")

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
      fontSize: 18,
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
      fontSize: 18,
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