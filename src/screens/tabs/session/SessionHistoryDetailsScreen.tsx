/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import { SansText } from '../../../components/reusable/Text/SansText';
import AppBar from '../../../components/reusable/AppBar/AppBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { formatDate } from '../../../utils/formatDate';
import { useDispatch } from 'react-redux';
import { setSelectedConsultation } from '../../../redux/features/consultation/consultationChatSlice';
import {
  useEndConsultationSessionMutation,
  useGetSingleConsultationBookingByIdQuery,
  useRejectConsultationMutation,
  useScheduleConsultationMutation,
} from '../../../redux/features/consultation/consultationApi';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import SessionNotes from '../../../components/SessionDetailsPage/SessionNotes/SessionNotes';
import SessionSummary from '../../../components/SessionDetailsPage/SessionSummary/SessionSummary';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';

const SessionHistoryDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const params = route.params as any;

  const [endConsultationSession, { isLoading: isEnding }] =
    useEndConsultationSessionMutation();

  const consultationId = params?.consultationId || params?.id || '';

  const handleEndConsultation = async () => {
    Alert.alert(
      'Mark as Completed',
      'Are you sure you want to mark this consultation as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              await endConsultationSession(consultationId).unwrap();
              Alert.alert('Success', 'Consultation marked as completed.');
              navigation.navigate('ProvideNotes', {
                consultationId: consultationId,
              });
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Failed to mark consultation as completed.');
            }
          },
        },
      ],
    );
  };

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { data, isLoading, isFetching, refetch } =
    useGetSingleConsultationBookingByIdQuery(consultationId, {
      skip: !consultationId,
    });

  const {
    user,
    method,
    bookedSlot,
    slotId,
    recommendations,
    consultationFor,
    status,
    rating,
    createdAt,
  } = data?.data || {};

  const meetingDate = slotId?.date || null;
  const userName = `${user?.firstName} ${user?.lastName}` || 'N/A';
  const image = user?.profilePicture || 'https://via.placeholder.com/84';
  const time =
    `${formatDate(meetingDate)} at ${bookedSlot?.startTime} - ${
      bookedSlot?.endTime
    }` || 'N/A';
  const bookedDate = formatDate(createdAt);

  /*
    CONDITIONS
  */
  const isCompleted = status === 'ended';
  const isRejected = status === 'rejected';
  const isPending = status === 'pending';
  const isAccepted = status === 'accepted';
  const isCall = method === 'call';
  const isChat = method === 'chat';

  const getStatusColor = () => {
    if (status === 'ended') return '#10b404';
    if (status === 'accepted') return '#2196F3';
    if (status === 'rejected') return '#FF0000';
    if (status === 'pending') return '#D4AF37';
    return '#E0E0E0';
  };

  const getStatusText = () => {
    if (status === 'ended') return 'Completed';
    if (status === 'accepted') return 'Accepted';
    if (status === 'pending') return 'Pending';
    if (status === 'rejected') return 'Rejected';
    return 'Unknown';
  };

  const [scheduleConsultation, { isLoading: isScheduling }] =
    useScheduleConsultationMutation();
  const [rejectConsultation, { isLoading: isRejecting }] =
    useRejectConsultationMutation();

  const handleScheduleConsultation = async () => {
    try {
      await scheduleConsultation(consultationId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectConsultation = async () => {
    try {
      await rejectConsultation(consultationId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Chat
  const handleChatNow = (booking: any) => {
    const participant = booking?.user;
    const currentParticipantId = booking?.astrologer;
    dispatch(
      setSelectedConsultation({
        consultationId: booking?._id,
        currentParticipantId: currentParticipantId,
        participant: {
          _id: participant?.accountId,
          name: participant?.fullName,
          firstName: participant?.firstName,
          lastName: participant?.lastName,
          profilePicture: participant?.profilePicture || '',
          accountId: participant?.accountId,
          role: 'user',
        },
      }),
    );

    // Navigate to chat page
    navigation.navigate('AstrologerChatScreen', {
      id: booking?._id,
      profilePicture: booking?.user?.profilePicture,
      name: booking?.user?.fullName,
      consultationFor: booking.consultationFor,
    });
  };

  // Handle Join Consultation
  const handleJoinConsultation = () => {
    navigation.navigate('ConsultationCallScreen', {
      consultationId: consultationId,
      otherParticipantName: userName,
    });
  };

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);

      await Promise.all([refetch().unwrap()]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  if (isLoading || isFetching) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <View style={styles.loaderContainer}>
            <SansText style={styles.loadingText}>Loading...</SansText>
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppBar title={method === 'chat' ? 'Chat Details' : 'Call Details'} />

        <ScrollView
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
          contentContainerStyle={styles.scrollContent}
        >
          {/* Customer Card */}
          <View style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <Image source={{ uri: image }} style={styles.customerImage} />
              <View style={styles.customerInfo}>
                <SatoshiText style={styles.customerName}>
                  {userName}
                </SatoshiText>
                <SansText style={styles.customerLocation}>
                  Purpose : {consultationFor}
                </SansText>
              </View>
            </View>

            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor() },
              ]}
            >
              <SansText style={[styles.statusBadgeText, { color: '#ffff' }]}>
                {getStatusText()}
              </SansText>
            </View>

            {/* Time */}
            {method === 'call' && (
              <View style={styles.timeRow}>
                <SansText style={styles.timeText}>{time}</SansText>
              </View>
            )}

            {/* Action Buttons */}
            {isPending && (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <ReusableButton
                  title="Reject"
                  onPress={handleRejectConsultation}
                  variant="outline"
                  style={{ flex: 1 }}
                  borderColor="#C2371E"
                  loading={isRejecting}
                />
                <ReusableButton
                  title="Accept"
                  onPress={handleScheduleConsultation}
                  variant="solid"
                  style={{ flex: 1 }}
                  backgroundColor="#28A745"
                  borderColor="#28A745"
                  textColor="#fff"
                  loading={isScheduling}
                />
              </View>
            )}

            {isRejected && (
              <ReusableButton
                title="Accept Consultation"
                onPress={handleScheduleConsultation}
                variant="solid"
                style={{ flex: 1 }}
                backgroundColor="#28A745"
                borderColor="#28A745"
                textColor="#fff"
                loading={isScheduling}
              />
            )}

            {isCall && isAccepted && (
              <ReusableButton
                title="Join Session"
                onPress={handleJoinConsultation}
                variant="solid"
                width="100%"
              />
            )}

            {isChat && isAccepted && (
              <ReusableButton
                title="Chat Now"
                onPress={() => handleChatNow(data?.data)}
                variant="solid"
                width="100%"
              />
            )}

            {!isCompleted && !isRejected && !isPending && (
              <ReusableButton
                title="Mark as Completed"
                onPress={handleEndConsultation}
                variant="outline"
                width="100%"
                loading={isEnding}
                style={{ marginTop: 10 }}
              />
            )}
          </View>

          {/* Session Summary */}
          <SessionSummary
            rating={rating}
            meetingDate={meetingDate}
            bookedDate={bookedDate}
            method={method}
            statusColor={getStatusColor}
            getStatusText={getStatusText}
          />
          {/* Session Notes */}
          <SessionNotes
            recommendations={recommendations}
            consultationId={consultationId}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default SessionHistoryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F1D7',
  },

  scrollContent: {
    paddingBottom: 60,
    paddingHorizontal: 16,
  },

  // Customer Card
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  customerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  customerInfo: {
    flex: 1,
    marginLeft: 14,
  },

  customerName: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
    marginBottom: 2,
  },

  customerLocation: {
    fontSize: 13,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },

  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'GeneralSans-Medium',
    textTransform: 'capitalize',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  timeText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'GeneralSans-Regular',
  },

  actionRow: {
    flexDirection: 'row',
    width: '100%',
  },

  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  primaryButton: {
    backgroundColor: '#D4AF37',
  },

  primaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'GeneralSans-Bold',
  },

  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
