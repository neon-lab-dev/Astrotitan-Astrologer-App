// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTNjMWJiZDljMzczZmU5YzE5OTFhN2QiLCJlbWFpbCI6ImJhZHdhbmVwcmVybmFAZ21haWwuY29tIiwicm9sZSI6ImFzdHJvbG9nZXIiLCJpYXQiOjE3ODIzMjQxNzcsImV4cCI6MTc4MjkyODk3N30.ZsnYX4sepd24AfUVJ88Cw5GsJYvfj2ivBo0DXi5AHGM', 'loadAuth'
// 06-25 00:04:56.792  6032  8070 I ReactNativeJS: 'Redux after initial load:', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTNjMWJiZDljMzczZmU5YzE5OTFhN2QiLCJlbWFpbCI6ImJhZHdhbmVwcmVybmFAZ21haWwuY29tIiwicm9sZSI6ImFzdHJvbG9nZXIiLCJpYXQiOjE3ODIzMjQxNzcsImV4cCI6MTc4MjkyODk3N30.ZsnYX4sepd24AfUVJ88Cw5GsJYvfj2ivBo0DXi5AHGM

import NotificationIcon from "@/assets/icons/navigation/notifications.svg";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery, useLazyGetMeQuery } from "../../../redux/features/auth/authApi";
import ScreenWrapper from "../../../components/layout/ScreenWrapper";
import { SansText } from "../../../components/reusable/Text/SansText";
import { getTimeBasedGreeting } from "../../../utils/greetings";
import { SatoshiText } from "../../../components/reusable/Text/SatoshiText";
import IconButton from "../../../components/reusable/IconButton/IconButton";
import ContentSection from "../../../components/reusable/ContentSectoin/ContentSection";
import { selectUser, updateUser } from "../../../redux/features/auth/authSlice";
import { Storage } from "../../../services/storage/storage";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RequestCard from "../../../components/tabs/home/home/RequestCard/RequestCard";
import ReusableButton from "../../../components/reusable/ReusableButton/ReusableButton";
import EditIcon from '@/assets/icons/actions/edit.svg';
import AstrologerCardSkeleton from "../../../components/tabs/astrologer/astrologer/AstrologerCard/AstrologerCardSkeleton";
import { AstrologerCard } from "../../../components/tabs/astrologer/astrologer/AstrologerCard/AstrologerCard";
import { useGetAstrologersQuery } from "../../../redux/features/astrologer/astrologerApi";
import AnimatedScreen from "../../../components/layout/AnimatedScreen";
import { useGetMyConsultationBookingsQuery } from "../../../redux/features/consultation/consultationApi";
import RequestCardSkeleton from "../../../components/tabs/home/home/RequestCard/RequestCardSkeleton";
import { useGetMyNotificationsQuery } from "../../../redux/features/notification/notificationApi";
const HomeScreen = () => {
  const user = useSelector(selectUser);
  const [refreshing, setRefreshing] = useState(false);
  const { data: userData } = useGetMeQuery({});
  const profile = userData?.data?.profile;
  const [getMe] = useLazyGetMeQuery();
  const dispatch = useDispatch();
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const DAYS = [
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
    { short: "Sat", full: "Saturday" },
    { short: "Sun", full: "Sunday" },
  ];
  const { data, isLoading, isFetching, refetch } = useGetAstrologersQuery({
    isIdentityVerified: true,
  });
  const { data: consultationBookings, isLoading: isBookingLoading, isFetching: isBookingFetching, refetch: refetchBooking } = useGetMyConsultationBookingsQuery({});
  const bookings = consultationBookings?.data?.data || [];
  const astrologers = data?.data?.astrologers || [];
  const { data: myNotifications } = useGetMyNotificationsQuery({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;
  const fetchLatestUser = useCallback(async () => {
    try {
      const meRes = await getMe({}).unwrap();
      const finalUser = meRes.data;
      await Storage.setUser(finalUser);
      dispatch(updateUser(finalUser));
    } catch (error) {
      console.log("GET ME ERROR:", error);
    }
  },
    [getMe, dispatch]
  );
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);
      refetch();
      refetchBooking();
      fetchLatestUser();
      await Promise.all([
      ]);
    } catch (error) {
      console.log("REFRESH ERROR:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchLatestUser();
    }, [fetchLatestUser])
  );


  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#816B22"
              colors={["#816B22"]}
              progressBackgroundColor="#FBF7EB"
            />
          }
        >
          {/* HEADER */}

          <View style={styles.header}>
            <View
              style={{
                flex: 1,
              }}
            >
              <SansText style={styles.greeting}>
                {getTimeBasedGreeting()},
              </SansText>

              <SatoshiText style={styles.userName}>
                {profile?.displayName ??
                  `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()}
              </SatoshiText>
            </View>

            <View>
              <IconButton
                Icon={NotificationIcon}
                iconColor="#0D0D0D"
                onPress={() => {
                  navigation.navigate("NotificationScreen");
                }}
                update={unreadCount > 0}
                updateCount={unreadCount}
              />
            </View>
          </View>

          {/* CONTENT */}

          <View style={styles.section}>
            <ContentSection
              title="Chat Requests"
              sectionStyle={{ paddingHorizontal: 16 }}
            >
              <SansText>
                Your chat requests will appear here. Sample requests shown for
                preview.
              </SansText>
            </ContentSection>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 14,
                paddingTop: 14,
                paddingHorizontal: 16,
              }}
            >
              {isBookingLoading ? (
                <>
                  <RequestCardSkeleton />
                  <RequestCardSkeleton />
                  <RequestCardSkeleton />
                </>
              ) : (
                bookings?.map((item) => (
                  <RequestCard
                    key={item._id}
                    item={item}
                    isVerified={user?.profile?.isIdentityVerified}
                  />
                ))
              )}
            </ScrollView>
          </View>


          {/* AVAILABILITY */}

          <View style={styles.section}>
            <View>
              <ContentSection
                title="Availability"
                sectionStyle={{ paddingHorizontal: 16 }}
              >
                <SansText>
                  Set your availability once your&apos;s ready to receive chat
                  and call requests
                </SansText>
              </ContentSection>

              <View style={styles.availabilityCard}>
                {/* TIME */}

                <View style={styles.timeRow}>
                  <SatoshiText style={styles.timeText}>
                    {profile?.availability?.availableTime?.startTime}
                  </SatoshiText>

                  <SansText style={styles.dash}>—</SansText>

                  <SatoshiText style={styles.timeText}>
                    {profile?.availability?.availableTime?.endTime}
                  </SatoshiText>
                </View>

                <SansText>Same applies to all selected days.</SansText>
                {/* DAYS */}

                <View style={styles.daysContainer}>
                  {DAYS.map((item) => {
                    const selected =
                      profile?.availability?.availableDays?.includes(item.full);

                    return (
                      <View
                        key={item.short}
                        style={[
                          styles.dayButton,
                          selected && styles.selectedDayButton,
                        ]}
                      >
                        <SansText
                          style={[
                            styles.dayText,
                            selected && styles.selectedDayText,
                          ]}
                        >
                          {item.short}
                        </SansText>
                      </View>
                    );
                  })}
                </View>

                {/* BUTTON */}
                <ReusableButton
                  title="Edit Availability"
                  onPress={() => { navigation.getParent()?.navigate("AvailabilityTab") }}
                  variant="outline"
                  iconPosition="left"
                  // disabled={!user?.profile?.isIdentityVerified}
                  icon={<EditIcon width={24} height={24} />}
                  iconSize={20}
                  style={{ borderRadius: 999 }}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View>
              <ContentSection
                title="Astrologers on the platform"
                sectionStyle={{ paddingHorizontal: 16 }}
              >
                <SansText>
                  Explore how astrologer profiles appear to users.
                </SansText>
              </ContentSection>

              <FlatList
                data={astrologers}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#816B22"
                    colors={["#816B22"]}
                    progressBackgroundColor="#FBF7EB"
                  />
                }
                renderItem={({ item }) => <AstrologerCard item={item} />}
                contentContainerStyle={{
                  padding: 16,
                  gap: 16,
                  paddingBottom: 40,
                }}
                ListEmptyComponent={
                  isLoading || isFetching ? (
                    <View style={{ gap: 16 }}>
                      {[1, 2, 3].map((item) => (
                        <AstrologerCardSkeleton key={item} />
                      ))}
                    </View>
                  ) : (
                    <View style={{ alignItems: "center", marginTop: 80 }}>
                      <SansText>No astrologers found</SansText>
                    </View>
                  )
                }
              />
            </View>
          </View>

        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );


};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },

  greeting: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 4,
  },

  userName: {
    fontSize: 21,
    color: "#111",
    fontFamily: "Satoshi-Bold",
  },

  profileCard: {
    marginHorizontal: 16,

    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  profileSmall: {
    fontSize: 12,
    color: "#5A4A12",
    marginBottom: 4,
  },

  profileTitle: {
    fontSize: 21,
    color: "#111",
    fontFamily: "Satoshi-Bold",
  },

  profileDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4A4A4A",
  },

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionTitle: {
    fontSize: 21,
    color: "#111",
    fontFamily: "Satoshi-Bold",
  },

  sectionDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6A6A6A",
    marginTop: 4,
  },

  availabilityCard: {
    backgroundColor: "#FBF7EB",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E3C55A",
    padding: 18,
    margin: 16,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },

  timeText: {
    fontSize: 21,
    color: "#4A4A4A",
    fontFamily: "Satoshi-Bold",
  },

  dash: {
    fontSize: 21,
    color: "#8A8A8A",
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },

  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 12
  },

  dayButton: {
    minWidth: 52,
    height: 38,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: "#D4AF37",
    backgroundColor: "#FBF7EB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  selectedDayButton: {
    backgroundColor: "#D4AF37",
  },

  dayText: {
    fontSize: 14,
    color: "#0D0D0D",
  },

  selectedDayText: {
    color: "#0D0D0D",
    fontFamily: "GeneralSans-Medium",
  },


  editAvailabilityButton: {
    height: 48,

    borderRadius: 999,

    borderWidth: 1,

    borderColor: "#D4AF37",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    gap: 10,
  },

  editAvailabilityText: {
    fontSize: 14,
    color: "#111",
    fontFamily: "GeneralSans-Medium",
  },
});
