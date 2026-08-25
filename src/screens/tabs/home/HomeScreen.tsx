/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import NotificationIcon from '@/assets/icons/navigation/notifications.svg';
import React, { useCallback, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetMeQuery,
  useLazyGetMeQuery,
} from '../../../redux/features/auth/authApi';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { SansText } from '../../../components/reusable/Text/SansText';
import { getTimeBasedGreeting } from '../../../utils/greetings';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import IconButton from '../../../components/reusable/IconButton/IconButton';
import ContentSection from '../../../components/reusable/ContentSectoin/ContentSection';
import { selectUser, updateUser } from '../../../redux/features/auth/authSlice';
import { Storage } from '../../../services/storage/storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RequestCard from '../../../components/tabs/home/home/RequestCard/RequestCard';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import { useGetMyConsultationBookingsQuery } from '../../../redux/features/consultation/consultationApi';
import RequestCardSkeleton from '../../../components/tabs/home/home/RequestCard/RequestCardSkeleton';
import { useGetMyNotificationsQuery } from '../../../redux/features/notification/notificationApi';
import QuickActions from '../../../components/HomePage/QuickAction/QuickAction';
import { ICONS } from '../../../assets/svg';
import { useGetStatsQuery } from '../../../redux/features/astrologer/astrologerApi';
const HomeScreen = () => {
  const user = useSelector(selectUser);
  const [refreshing, setRefreshing] = useState(false);
  const { data: userData } = useGetMeQuery({});
  const profile = userData?.data?.profile;
  const [getMe] = useLazyGetMeQuery();
  const dispatch = useDispatch();
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const {
    data: consultationBookings,
    isLoading: isBookingLoading,
    isFetching: isBookingFetching,
    refetch: refetchBooking,
  } = useGetMyConsultationBookingsQuery({});
  const bookings = consultationBookings?.data?.data || [];
  const { data: myNotifications } = useGetMyNotificationsQuery({});
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;
  const fetchLatestUser = useCallback(async () => {
    try {
      const meRes = await getMe({}).unwrap();
      const finalUser = meRes.data;
      await Storage.setUser(finalUser);
      dispatch(updateUser(finalUser));
    } catch (error) {
      console.log('GET ME ERROR:', error);
    }
  }, [getMe, dispatch]);

  const { data, isLoading, refetch } = useGetStatsQuery({});

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);
      refetchBooking();
      fetchLatestUser();
      refetch();
      await Promise.all([]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLatestUser();
    }, [fetchLatestUser]),
  );

  const IconComponent = ICONS.EmptyFile;

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
              colors={['#816B22']}
              progressBackgroundColor="#FBF7EB"
            />
          }
        >
          {/* HEADER */}

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.greetingContainer}>
                <SansText style={styles.greeting}>
                  {getTimeBasedGreeting()},
                </SansText>
                <View style={styles.nameContainer}>
                  <SatoshiText style={styles.userName}>
                    {profile?.displayName ??
                      `${profile?.firstName ?? ''} ${
                        profile?.lastName ?? ''
                      }`.trim()}
                  </SatoshiText>
                </View>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('NotificationScreen')}
              >
                <IconButton
                  Icon={NotificationIcon}
                  size={20}
                  iconColor="#0D0D0D"
                  onPress={() => {
                    navigation.navigate('NotificationScreen');
                  }}
                  update={unreadCount > 0}
                  updateCount={unreadCount}
                />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <SansText style={styles.notificationCount}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </SansText>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('ProfileScreen')}
              >
                <Image
                  source={{ uri: profile?.profilePicture }}
                  style={styles.profileAvatar}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONTENT */}
          <View style={styles.section}>
            <QuickActions stats={data?.data || {}} isLoading={isLoading} />
          </View>

          {/* Recent Requests */}
          <View style={styles.section}>
            <ContentSection
              title="Recent Consultation Requests"
              sectionStyle={{ paddingHorizontal: 16 }}
            >
              <SansText>
                Here are your latest consultation requests. Tap on any request
                to view details and respond.
              </SansText>
            </ContentSection>

            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 6,
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
              ) : bookings && bookings.length > 0 ? (
                bookings.map((item: any) => (
                  <RequestCard
                    key={item._id}
                    item={item}
                    isVerified={user?.profile?.isIdentityVerified}
                  />
                ))
              ) : (
                // --- Empty State Component ---
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIcon}>
                    {/* Replace with your actual icon component */}
                    <IconComponent width={50} height={50} />
                  </View>

                  <SatoshiText style={styles.emptyTitle}>
                    No Recent Requests
                  </SatoshiText>

                  <SansText style={styles.emptySubtext}>
                    You don't have any recent consultation requests. When new
                    requests come in, they'll appear here.
                  </SansText>
                </View>
                // --- End of Empty State Component ---
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 26,
  },
  headerLeft: {
    flex: 1,
  },
  greetingContainer: {
    gap: 2,
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationCount: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },

  profileCard: {
    marginHorizontal: 16,

    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  profileSmall: {
    fontSize: 12,
    color: '#5A4A12',
    marginBottom: 4,
  },

  profileTitle: {
    fontSize: 21,
    color: '#111',
    fontFamily: 'Satoshi-Bold',
  },

  profileDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4A4A4A',
  },

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionTitle: {
    fontSize: 21,
    color: '#111',
    fontFamily: 'Satoshi-Bold',
  },

  sectionDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6A6A6A',
    marginTop: 4,
  },

  availabilityCard: {
    backgroundColor: '#FBF7EB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E3C55A',
    padding: 18,
    margin: 16,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },

  timeText: {
    fontSize: 21,
    color: '#4A4A4A',
    fontFamily: 'Satoshi-Bold',
  },

  dash: {
    fontSize: 21,
    color: '#8A8A8A',
  },

  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 12,
  },

  dayButton: {
    minWidth: 52,
    height: 38,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: '#D4AF37',
    backgroundColor: '#FBF7EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  selectedDayButton: {
    backgroundColor: '#D4AF37',
  },

  dayText: {
    fontSize: 14,
    color: '#0D0D0D',
  },

  selectedDayText: {
    color: '#0D0D0D',
    fontFamily: 'GeneralSans-Medium',
  },

  editAvailabilityButton: {
    height: 48,

    borderRadius: 999,

    borderWidth: 1,

    borderColor: '#D4AF37',

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    gap: 10,
  },

  editAvailabilityText: {
    fontSize: 14,
    color: '#111',
    fontFamily: 'GeneralSans-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});
