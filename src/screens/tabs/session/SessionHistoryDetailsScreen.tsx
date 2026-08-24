/* eslint-disable react-native/no-inline-styles */
import StarInactive from '@/assets/icons/navigation/star-inactive.svg';
import ClockIcon from '@/assets/icons/visual/clock.svg';
import StatusIcon from '@/assets/icons/visual/user-status.svg';
import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import { SansText } from '../../../components/reusable/Text/SansText';
import ContentSection from '../../../components/reusable/ContentSectoin/ContentSection';
import { useRoute } from '@react-navigation/native';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import BottomSheetService from '../../../redux/features/ui/GlobalSheet/BottomSheetService';
import ConnectGoogleSection from '../../../components/reusable/BottomSheet/ConnectGoogleSection';
import AppBar from '../../../components/reusable/AppBar/AppBar';
import { useNavigation } from '@react-navigation/native';
import RenderHTML, {
  defaultSystemFonts,
  MixedStyleDeclaration,
} from 'react-native-render-html';
import { formatDate } from '../../../utils/formatDate';

const SessionHistoryDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params as any;

  const sessionType = params.sessionType || 'call';
  const consultationId = params.consultationId || '';
  const userName = params.userName || 'N/A';
  const date = params.date || 'N/A';
  const time = params.time || 'N/A';
  const startTime = params.startTime || null;
  const endTime = params.endTime || null;
  const meetingDate = params.meetingDate || null;
  const status = params.status || 'pending';
  const rating = params.rating || null;
  const image = params.image || 'https://via.placeholder.com/84';
  const meetingLink = params.meetingLink || null;
  const bookedSlot = params.bookedSlot || null;
  const slotId = params.slotId || null;
  const recommendations = params.recommendations || null;
  const consultationFor = params.consultationFor || 'N/A';

  /*
    CONDITIONS
  */
  const isCompleted = status === 'Completed' || status === 'ended';
  const isCancelled = status === 'Cancelled';
  const isMissed = status === 'Missed';
  const isPending = status === 'pending';
  const isScheduled = status === 'scheduled';

  /*
    STATUS COLOR
  */
  const statusColor = useMemo(() => {
    if (isCompleted) return '#1B7726';
    if (isCancelled) return '#882715';
    if (isMissed) return '#4A4A4A';
    if (isPending) return '#FFB74D';
    if (isScheduled) return '#D4AF37';
    return '#4A4A4A';
  }, [isCompleted, isCancelled, isMissed, isPending, isScheduled]);

  const statusBgColor = useMemo(() => {
    if (isCompleted) return '#E8F5E9';
    if (isCancelled) return '#FDE8E5';
    if (isMissed) return '#F0F0F0';
    if (isPending) return '#FFF8E7';
    if (isScheduled) return '#FFF8E7';
    return '#F0F0F0';
  }, [isCompleted, isCancelled, isMissed, isPending, isScheduled]);

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isCancelled) return 'Cancelled';
    if (isMissed) return 'Missed';
    if (isPending) return 'Pending';
    if (isScheduled) return 'Scheduled';
    return status;
  };

  // Handle Schedule Call
  const onScheduleCallPress = () => {
    BottomSheetService.open(
      React.createElement(ConnectGoogleSection as React.ComponentType<any>, {
        consultationId: consultationId,
        userName: userName,
        userImage: image,
        date: slotId?.date || date,
        time: `${bookedSlot?.startTime || startTime} - ${
          bookedSlot?.endTime || endTime
        }`,
        onCancel: BottomSheetService.close,
      }),
      {
        height: 400,
        hasGradient: true,
      },
    );
  };

  // Handle Join Call
  const handleJoinCall = () => {
    if (meetingLink) {
      console.log('Joining call:', meetingLink);
    }
  };

  // Handle Chat
  const handleChat = () => {
    console.log('Opening chat for:', userName);
  };

  const { width } = useWindowDimensions();
  const systemFonts = [
    ...defaultSystemFonts,
    'Satoshi-Regular',
    'Satoshi-Medium',
    'Satoshi-Bold',
  ];
  const htmlStyles: Record<string, MixedStyleDeclaration> = {
    body: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
    },

    div: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
      marginBottom: 12,
    },

    p: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
      marginBottom: 12,
    },

    b: {
      fontFamily: 'Satoshi-Bold',
      color: '#1A1A1A',
    },

    strong: {
      fontFamily: 'Satoshi-Bold',
      color: '#1A1A1A',
    },

    i: {
      fontStyle: 'italic',
    },

    em: {
      fontStyle: 'italic',
    },

    ul: {
      marginVertical: 10,
      fontFamily: 'Satoshi-Regular',
    },

    ol: {
      marginVertical: 10,
      fontFamily: 'Satoshi-Regular',
    },

    li: {
      color: '#4A4A4A',
      fontSize: 16,
      lineHeight: 28,
      fontFamily: 'Satoshi-Regular',
      marginBottom: 6,
    },
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <AppBar
          title={sessionType === 'chat' ? 'Chat Details' : 'Call Details'}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
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
              style={[styles.statusBadge, { backgroundColor: statusBgColor }]}
            >
              <SansText
                style={[styles.statusBadgeText, { color: statusColor }]}
              >
                {getStatusText()}
              </SansText>
            </View>

            {/* Time */}
            {sessionType === 'call' && (
              <View style={styles.timeRow}>
                <SansText style={styles.timeText}>{time}</SansText>
              </View>
            )}

            {/* Action Buttons - Based on Status */}
            <View style={styles.actionRow}>
              {sessionType === 'call' ? (
                <>
                  {isPending && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={onScheduleCallPress}
                    >
                      <SansText style={styles.primaryButtonText}>
                        Schedule Call
                      </SansText>
                    </TouchableOpacity>
                  )}

                  {isScheduled && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={handleJoinCall}
                    >
                      <SansText style={styles.primaryButtonText}>
                        Join Call
                      </SansText>
                    </TouchableOpacity>
                  )}

                  {(isCompleted || isCancelled || isMissed) && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.primaryButton,
                        styles.disabledButton,
                      ]}
                      disabled
                    >
                      <SansText style={styles.primaryButtonText}>
                        {isCompleted
                          ? 'Completed'
                          : isCancelled
                          ? 'Cancelled'
                          : 'Missed'}
                      </SansText>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                // Chat Session
                <>
                  {(isPending || isScheduled) && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={handleChat}
                    >
                      <SansText style={styles.primaryButtonText}>
                        Chat Now
                      </SansText>
                    </TouchableOpacity>
                  )}

                  {(isCompleted || isCancelled || isMissed) && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.primaryButton,
                        styles.disabledButton,
                      ]}
                      disabled
                    >
                      <SansText style={styles.primaryButtonText}>
                        {isCompleted
                          ? 'Completed'
                          : isCancelled
                          ? 'Cancelled'
                          : 'Missed'}
                      </SansText>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Session Summary */}
          <View style={styles.section}>
            <ContentSection
              title="Session Summary"
              sectionStyle={styles.sectionHeader}
              titleFontSize={20}
            />

            <View style={styles.summaryCard}>
              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                {/* Duration */}
                <View style={styles.statItem}>
                  <View style={styles.statIconWrapper}>
                    <ClockIcon width={20} height={20} />
                  </View>
                  <SansText style={styles.statLabel}>Meeting</SansText>
                  <SatoshiText style={styles.statValue}>
                    {formatDate(meetingDate)}
                  </SatoshiText>
                </View>

                {/* Status */}
                <View style={styles.statItem}>
                  <View style={styles.statIconWrapper}>
                    <StatusIcon width={20} height={20} />
                  </View>
                  <SansText style={styles.statLabel}>Status</SansText>
                  <SatoshiText
                    style={[styles.statValue, { color: statusColor }]}
                  >
                    {getStatusText()}
                  </SatoshiText>
                </View>

                {/* Rating */}
                <View style={styles.statItem}>
                  <View style={styles.statIconWrapper}>
                    <StarInactive width={20} height={20} />
                  </View>
                  <SansText style={styles.statLabel}>Ratings</SansText>
                  <SatoshiText style={styles.statValue}>
                    {rating || 'Not Rated'}
                  </SatoshiText>
                </View>
              </View>
            </View>
          </View>

          {/* Session Notes */}
          <View style={styles.section}>
            <ContentSection
              title="Session Notes"
              sectionStyle={styles.sectionHeader}
              titleFontSize={20}
            />

            {recommendations ? (
              <View style={styles.notesContainer}>
                <RenderHTML
                  contentWidth={width - 40}
                  source={{
                    html: recommendations || '',
                  }}
                  systemFonts={systemFonts}
                  tagsStyles={htmlStyles}
                  baseStyle={{
                    fontFamily: 'Satoshi',
                    color: '#4A4A4A',
                    fontSize: 16,
                    lineHeight: 28,
                  }}
                />
              </View>
            ) : (
              <View style={styles.emptyNotesContainer}>
                <SansText style={styles.emptyNotesText}>
                  No session notes available
                </SansText>
                <ReusableButton
                  title="Provide Note"
                  onPress={() => {
                    navigation.navigate('ProvideNotes', {
                      consultationId: consultationId,
                    });
                  }}
                  variant="outline"
                  borderColor="#D4AF37"
                  textColor="#D4AF37"
                  width={160}
                  height={40}
                  style={styles.provideNoteButton}
                />
              </View>
            )}
          </View>
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

  // Section
  section: {
    marginTop: 24,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  statLabel: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
    marginBottom: 2,
  },

  statValue: {
    fontSize: 13,
    color: '#0D0D0D',
    fontFamily: 'Satoshi-Bold',
    textAlign: 'center',
  },

  // Notes
  notesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4AF37',
    marginTop: 8,
  },

  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#4A4A4A',
    fontFamily: 'GeneralSans-Regular',
    lineHeight: 22,
  },

  emptyNotesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  emptyNotesText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'GeneralSans-Regular',
    marginBottom: 16,
  },

  provideNoteButton: {
    borderRadius: 10,
  },
});
