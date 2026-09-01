import { StyleSheet, View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { formatDate } from '../../../utils/formatDate';
import StarInactive from '@/assets/icons/navigation/star-inactive.svg';
import ClockIcon from '@/assets/icons/visual/clock.svg';
import StatusIcon from '@/assets/icons/visual/user-status.svg';

const SessionSummary = ({
  rating,
  method,
  meetingDate,
  bookedDate,
  getStatusText,
  statusColor,
}: any) => {
  return (
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
            <SansText style={styles.statLabel}>
              {method === 'call' ? 'Meeting' : 'Booked At'}
            </SansText>
            <SatoshiText style={styles.statValue}>
              {method === 'call' ? formatDate(meetingDate) : bookedDate}
            </SatoshiText>
          </View>

          {/* Status */}
          <View style={styles.statItem}>
            <View style={styles.statIconWrapper}>
              <StatusIcon width={20} height={20} />
            </View>
            <SansText style={styles.statLabel}>Status</SansText>
            <SatoshiText style={[styles.statValue, { color: statusColor }]}>
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
  );
};

export default SessionSummary;

const styles = StyleSheet.create({
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
});
