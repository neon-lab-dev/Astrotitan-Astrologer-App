import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import ReusableButton from '../ReusableButton/ReusableButton';
import { SatoshiText } from '../Text/SatoshiText';
import { SansText } from '../Text/SansText';
import { formatDate } from '../../../utils/formatDate';
import { useScheduleMeetingMutation } from '../../../redux/features/consultation/consultationApi';
import { useState } from 'react';

type Props = {
  consultationId: string;
  userName: string;
  userImage?: string;
  date: string;
  time: string;
  onNotNow: () => void;
  onSuccess?: () => void; // Optional callback when scheduling succeeds
};

const ScheduleMeeting = ({
  userName,
  consultationId,
  userImage,
  date,
  time,
  onNotNow,
  onSuccess,
}: Props) => {
  const [scheduleMeeting, { isLoading }] = useScheduleMeetingMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleScheduleMeeting = async () => {
    try {
      await scheduleMeeting(consultationId).unwrap();
      setIsSuccess(true);
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Success State UI
  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          {/* Close Button - Top Right */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onNotNow}
            activeOpacity={0.7}
          >
            <SansText style={styles.closeIconText}>✕</SansText>
          </TouchableOpacity>

          {/* Success Icon */}
          <View style={styles.successIconWrapper}>
            <Image
              source={require('@/assets/images/tick.png')}
              style={styles.image}
            />
          </View>

          <SatoshiText style={styles.successTitle}>
            Meeting Scheduled!
          </SatoshiText>

          <SansText style={styles.successSubtitle}>
            Your meeting has been successfully scheduled with{' '}
            <SansText style={styles.successSubtitleBold}>{userName}</SansText>
          </SansText>

          {/* Meeting Summary */}
          <View style={styles.successCard}>
            <View style={styles.successDetail}>
              <SansText style={styles.successDetailIcon}>📅</SansText>
              <SatoshiText style={styles.successDetailText}>
                {formatDate(date)}
              </SatoshiText>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successDetail}>
              <SansText style={styles.successDetailIcon}>🕐</SansText>
              <SatoshiText style={styles.successDetailText}>{time}</SatoshiText>
            </View>
          </View>

          <SansText style={styles.successNote}>
            A reminder notification will be sent 30 minutes before the meeting.
          </SansText>
        </View>
      </View>
    );
  }

  // Default UI
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <SatoshiText style={styles.headerTitle}>Schedule Meeting</SatoshiText>
        <SansText style={styles.headerSubtitle}>
          Please confirm the meeting details
        </SansText>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        {userImage ? (
          <Image source={{ uri: userImage }} style={styles.userImage} />
        ) : (
          <View style={styles.userImagePlaceholder}>
            <SansText style={styles.userInitial}>
              {userName?.charAt(0).toUpperCase() || '?'}
            </SansText>
          </View>
        )}

        <View style={styles.userInfo}>
          <SatoshiText style={styles.userName}>{userName}</SatoshiText>
          <View style={styles.userBadge}>
            <SansText style={styles.userBadgeText}>Session with you</SansText>
          </View>
        </View>
      </View>

      {/* Meeting Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <View style={styles.detailIconWrapper}>
            <SansText style={styles.detailIcon}>📅</SansText>
          </View>
          <View>
            <SansText style={styles.detailLabel}>Date</SansText>
            <SatoshiText style={styles.detailValue}>
              {formatDate(date)}
            </SatoshiText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <View style={styles.detailIconWrapper}>
            <SansText style={styles.detailIcon}>🕐</SansText>
          </View>
          <View>
            <SansText style={styles.detailLabel}>Time</SansText>
            <SatoshiText style={styles.detailValue}>{time}</SatoshiText>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <ReusableButton
          title="Not Now"
          onPress={onNotNow}
          variant="outline"
          borderColor="#D4AF37"
          textColor="#D4AF37"
          width="45%"
        />

        <ReusableButton
          title="Schedule Now"
          onPress={handleScheduleMeeting}
          variant="solid"
          width="55%"
          loading={isLoading}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default ScheduleMeeting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
  },

  closeButton: {
    position: 'absolute',
    top: -12,
    right: -3,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  closeIconText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'GeneralSans-Medium',
  },

  image: {
    width: 124,
    height: 124,
    objectFit: 'contain',
  },

  // ✅ Header Styles
  headerContainer: {
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 22,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
  },

  // ✅ User Card Styles
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  userImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  userImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  userInitial: {
    fontSize: 22,
    fontWeight: '600',
    color: '#D4AF37',
    fontFamily: 'GeneralSans-Bold',
  },

  userInfo: {
    flex: 1,
    marginLeft: 14,
    gap: 6,
  },

  userName: {
    fontSize: 17,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
  },

  userBadge: {
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  userBadgeText: {
    fontSize: 11,
    color: '#D4AF37',
    fontFamily: 'GeneralSans-Medium',
  },

  // ✅ Meeting Details Styles
  detailsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 20,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  detailIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },

  detailIcon: {
    fontSize: 18,
  },

  detailLabel: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  detailValue: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 14,
  },

  // ✅ Button Row Styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },

  // ✅ Success State Styles
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  successIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  successIcon: {
    fontSize: 40,
  },

  successTitle: {
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
    marginBottom: 8,
    textAlign: 'center',
  },

  successSubtitle: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'GeneralSans-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  successSubtitleBold: {
    fontFamily: 'GeneralSans-Medium',
    color: '#0D0D0D',
  },

  successCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    width: '100%',
    marginBottom: 16,
  },

  successDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },

  successDetailIcon: {
    fontSize: 18,
    width: 32,
  },

  successDetailText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    color: '#0D0D0D',
  },

  successDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 8,
  },

  successNote: {
    fontSize: 13,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
});
