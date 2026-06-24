import NotificationIcon from "@/assets/icons/navigation/notifications.svg";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery, useLazyGetMeQuery } from "../../../redux/features/auth/authApi";
import AnimatedScreen from "../../../components/layout/AnimatedScreen";
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
import RequestCard from "../../../components/tabs/home/home/RequestCard";
import ReusableButton from "../../../components/reusable/ReusableButton/ReusableButton";
import EditIcon from '@/assets/icons/actions/edit.svg';
import AstrologerCardSkeleton from "../../../components/tabs/astrologer/astrologer/AstrologerCard/AstrologerCardSkeleton";
import { AstrologerCard } from "../../../components/tabs/astrologer/astrologer/AstrologerCard/AstrologerCard";
import { useGetAstrologersQuery } from "../../../redux/features/astrologer/astrologerApi";
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
  const chatRequests = [
    {
      id: "1",
      name: "Meera Joshi",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },

    {
      id: "2",
      name: "Rahul Sharma",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      id: "3",
      name: "Meera Joshi",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },

    {
      id: "4",
      name: "Rahul Sharma",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
  ];
  const { data, isLoading, isFetching, refetch } = useGetAstrologersQuery({
    isIdentityVerified: true,
  });
  const astrologers = data?.data?.astrologers || [];
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
      fetchLatestUser();
      await Promise.all([
      ]);
    } catch (error) {
      console.log("REFRESH ERROR:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);
console.log(user,"user")
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
                {profile?.profile?.firstName} {profile?.profile?.lastName}
              </SatoshiText>
            </View>

            <View>
              <IconButton
                Icon={NotificationIcon}
                iconColor="#0D0D0D"
                onPress={() => {
                  navigation.navigate("NotificationScreen");
                }}
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
              {chatRequests.map((item) => (
                <RequestCard
                  key={item.id}
                  item={item}
                  type="Chat"
                  isVerified={user?.profile?.isIdentityVerified}
                  onAccept={() => {
                    console.log("ACCEPT:", item.id);
                  }}
                  onCancel={() => {
                    console.log("CANCEL:", item.id);
                  }}
                />
              ))}
            </ScrollView>
          </View>

          {/* CALL REQUESTS */}

          <View style={styles.section}>
            <ContentSection
              title="Call Requests"
              sectionStyle={{ paddingHorizontal: 16 }}
            >
              <SansText>
                Your call requests will appear here. Sample requests shown for
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
              {chatRequests.map((item) => (
                <RequestCard
                  key={item.id}
                  item={item}
                  type="Call"
                  isVerified={user?.profile?.isIdentityVerified}
                  onAccept={() => {
                    console.log("ACCEPT:", item.id);
                  }}
                  onCancel={() => {
                    console.log("CANCEL:", item.id);
                  }}
                />
              ))}
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
                  <SatoshiText style={styles.timeText}>10.00 AM</SatoshiText>

                  <SansText style={styles.dash}>—</SansText>

                  <SatoshiText style={styles.timeText}>05.00 PM</SatoshiText>
                </View>

                <SansText>Same applies to all selected days.</SansText>
                {/* DAYS */}

                <View style={styles.daysRow}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => {
                      // Check if this day exists in availableDays array
                      const isAvailable =
                        profile?.availability?.availableDays?.includes(day);
                      return (
                        <View
                          key={day}
                          style={[
                            styles.dayPill,
                            // isAvailable && styles.dayPillActive,
                          ]}
                        >
                          <SansText
                            style={[
                              styles.dayText,
                              // isAvailable && styles.dayTextActive,
                            ]}
                          >
                            {day}
                          </SansText>
                        </View>
                      );
                    },
                  )}
                </View>

                {/* BUTTON */}
                <ReusableButton
                  title="Edit Availability"
                  onPress={() => { }}
                  variant="outline"
                  iconPosition="left"
                  disabled={!user?.profile?.isIdentityVerified}
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
    fontSize: 18,
    color: "#4A4A4A",
    marginBottom: 4,
  },

  userName: {
    fontSize: 22,
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
    fontSize: 24,
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
    fontSize: 20,
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
    fontSize: 24,
    color: "#4A4A4A",
    fontFamily: "Satoshi-Bold",
  },

  dash: {
    fontSize: 22,
    color: "#8A8A8A",
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },

  dayPill: {
    height: 34,
    borderRadius: 999,
    backgroundColor: "#D4AF37",
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  dayText: {
    fontSize: 14,
    color: "#0D0D0D",
    fontFamily: "SansMedium",
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
    fontSize: 15,
    color: "#111",
    fontFamily: "SansMedium",
  },
});
