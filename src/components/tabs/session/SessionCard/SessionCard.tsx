import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ReusableButton from '../../../reusable/ReusableButton/ReusableButton';
import { SansText } from '../../../reusable/Text/SansText';
import { SatoshiText } from '../../../reusable/Text/SatoshiText';
import BottomSheetService from '../../../../redux/features/ui/GlobalSheet/BottomSheetService';
import ConnectGoogleSection from '../../../reusable/BottomSheet/ConnectGoogleSection';
import { formatDate } from '../../../../utils/formatDate';
import { ICONS } from '../../../../assets/svg';

type Props = {
  item: any;
  onPress: () => void;
  onChat: (item: any) => void;
};

const SessionCard = ({ item, onPress, onChat }: Props) => {
  const [imageError, setImageError] = useState(false);

  const onScheduleCallPress = () => {
    BottomSheetService.open(
      React.createElement(ConnectGoogleSection as React.ComponentType<any>, {
        consultationId: item?._id,
        userName: item?.user?.fullName,
        userImage: item?.user?.profilePicture,
        date: item?.slotId?.date,
        time: `${item?.bookedSlot?.startTime} - ${item?.bookedSlot?.endTime}`,
        onCancel: BottomSheetService.close,
      }),
      {
        height: 400,
        hasGradient: true,
      },
    );
  };

  const handleJoinCall = () => {
    if (item?.meeting?.link) {
      console.log('Joining call:', item?.meeting?.link);
    }
  };

  const handleReschedule = () => {
    console.log('Reschedule requested:', item?.meeting?.rescheduleRequest);
  };

  const hasRescheduleRequest = item?.meeting?.rescheduleRequest?.reason;

  const formatBookingDate = (date: string) => {
    if (!date) return '';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  // Determine status color
  const getStatusColor = () => {
    if (item?.status === 'ended') return '#10b404';
    if (item?.status === 'scheduled') return '#D4AF37';
    if (item?.status === 'pending') return '#FFB74D';
    return '#E0E0E0';
  };

  const getStatusText = () => {
    if (item?.status === 'ended') return 'Ended';
    if (item?.status === 'scheduled') return 'Scheduled';
    if (item?.status === 'pending') return 'Pending';
    return 'Unknown';
  };

  // Check if status badge should be shown
  const shouldShowStatusBadge = () => {
    // Don't show status badge for chat method with pending status
    if (item?.method === 'chat' && item?.status === 'pending') {
      return false;
    }
    return true;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      {/* Top Row: User Info + Status */}
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Image
            source={
              item?.user?.profilePicture &&
              !imageError && { uri: item.user.profilePicture }
            }
            onError={() => setImageError(true)}
            style={styles.userImage}
          />

          <View style={styles.userInfo}>
            <SatoshiText style={styles.userName} numberOfLines={1}>
              {item?.user?.fullName}
            </SatoshiText>

            {/* Consultation For Tag */}
            {item?.consultationFor && (
              <View style={styles.consultationTag}>
                <SansText style={styles.consultationText}>
                  {item?.consultationFor}
                </SansText>
              </View>
            )}
          </View>
        </View>

        {/* Status Badge - Hide for chat pending */}
        {shouldShowStatusBadge() && (
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <SansText style={styles.statusBadgeText}>
              {getStatusText()}
            </SansText>
          </View>
        )}
      </View>

      {/* Bottom Row: Booking Details + Action Button */}
      <View style={styles.bottomRow}>
        {/* Left: Booking Details */}
        <View style={styles.detailsSection}>
          {/* Show booking details for call method */}
          {item?.method === 'call' && (
            <View style={styles.detailsGrid}>
              {item?.slotId?.date && (
                <View style={styles.detailItem}>
                  <ICONS.CalendarIcon
                    width={18}
                    height={18}
                  />
                  <SansText style={styles.detailText}>
                    {formatBookingDate(item?.slotId?.date)}
                  </SansText>
                </View>
              )}

              {item?.bookedSlot?.startTime && item?.bookedSlot?.endTime && (
                <View style={styles.detailItem}>
                  <SansText style={styles.detailIcon}>🕐</SansText>
                  <SansText style={styles.detailText}>
                    {item?.bookedSlot?.startTime} - {item?.bookedSlot?.endTime}
                  </SansText>
                </View>
              )}
            </View>
          )}

          {/* Show createdAt for both call and chat */}
          {item?.createdAt && (
            <View style={styles.detailItem}>
              <SansText style={styles.detailIcon}>📆</SansText>
              <SansText style={styles.detailText}>
                Booked: {formatBookingDate(item?.createdAt)}
              </SansText>
            </View>
          )}
        </View>

        {/* Right: Action Buttons */}
        <View style={styles.actionSection}>
          {item?.method === 'call' ? (
            <View style={styles.buttonWrapper}>
              {item?.status === 'scheduled' ? (
                <ReusableButton
                  variant="solid"
                  title="Join Call"
                  height={32}
                  textSize={12}
                  style={styles.button}
                  onPress={handleJoinCall}
                />
              ) : item?.status === 'pending' ? (
                <ReusableButton
                  variant="solid"
                  title="Schedule"
                  height={32}
                  textSize={12}
                  style={styles.button}
                  onPress={onScheduleCallPress}
                />
              ) : null}
            </View>
          ) : item?.method === 'chat' ? (
            <View style={styles.buttonWrapper}>
              {item?.status === 'scheduled' || item?.status === 'pending' ? (
                <ReusableButton
                  variant="solid"
                  title="Chat Now"
                  height={32}
                  textSize={12}
                  style={styles.button}
                  onPress={() => onChat(item)}
                />
              ) : null}
            </View>
          ) : null}

          {/* Reschedule Button */}
          {hasRescheduleRequest && (
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={handleReschedule}
              activeOpacity={0.7}
            >
              <SansText style={styles.rescheduleText}>↻ Reschedule</SansText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SessionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
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

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  userInfo: {
    flex: 1,
    gap: 4,
  },

  userName: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  consultationTag: {
    backgroundColor: '#F5F0E8',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  consultationText: {
    fontSize: 10,
    color: '#8B7A5E',
    fontFamily: 'GeneralSans-Medium',
    textTransform: 'capitalize',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    minWidth: 70,
    alignItems: 'center',
  },

  statusBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontFamily: 'GeneralSans-Medium',
    textTransform: 'capitalize',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 12,
  },

  detailsSection: {
    flex: 1,
    marginRight: 12,
  },

  detailsGrid: {
    gap: 4,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  detailIcon: {
    fontSize: 12,
    width: 20,
  },

  detailText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'GeneralSans-Regular',
  },

  actionSection: {
    alignItems: 'flex-end',
    gap: 6,
  },

  buttonWrapper: {
    alignItems: 'flex-end',
  },

  button: {
    borderRadius: 8,
    minWidth: 80,
  },

  rescheduleButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },

  rescheduleText: {
    fontSize: 10,
    color: '#E65100',
    fontFamily: 'GeneralSans-Medium',
  },
});
