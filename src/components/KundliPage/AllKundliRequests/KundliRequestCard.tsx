import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { formatDate } from '../../../utils/validators/dateValidators';
import { ICONS } from '../../../assets/svg';

type Props = {
  item: any;
  onPress: () => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#D4AF37';
    case 'accepted':
      return '#2196F3';
    case 'completed':
      return '#4CAF50';
    case 'cancelled':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status || 'Unknown';
  }
};

export const getKundliTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    birthChart: 'Birth Chart',
    compatibility: 'Compatibility',
    career: 'Career',
    marriage: 'Marriage',
    yearly: 'Yearly',
    love: 'Love',
    health: 'Health',
    finance: 'Finance',
    education: 'Education',
    business: 'Business',
    child: 'Child',
    foreignTravel: 'Foreign Travel',
    property: 'Property',
    doshaAnalysis: 'Dosha Analysis',
    gemstone: 'Gemstone',
  };
  return types[type] || type;
};

const KundliRequestCard = ({ item, onPress }: Props) => {
  const GenerateKundliIcon = ICONS.GenerateKundli;
  const AnalyzeKundliIcon = ICONS.AnalyzeKundli;

  const isGenerate = item.requestType === 'generateKundli';

  const IconComponent = ICONS.RightArrow;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Left Section - Icon */}
      <View style={styles.iconContainer}>
        {isGenerate ? (
          <GenerateKundliIcon width={18} height={18} />
        ) : (
          <AnalyzeKundliIcon width={18} height={18} />
        )}
      </View>

      {/* Middle Section - Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <SatoshiText style={styles.userName} numberOfLines={1}>
            {item.userName}
          </SatoshiText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '15' },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            />
            <SansText
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusLabel(item.status)}
            </SansText>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <SansText style={styles.typeText}>
            Req Type: {isGenerate ? 'Generate Kundli' : 'Analyze Kundli'}
          </SansText>
          <SansText style={styles.dateText}>
            {formatDate(item.createdAt)}
          </SansText>
        </View>
        <View style={styles.bottomRow}>
          <SansText style={styles.typeText}>
            kundli Type: {getKundliTypeLabel(item.kundliType) || "N/A"}
          </SansText>
          <View style={styles.nextBtn}>
            <IconComponent width={16} height={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c092',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 8,
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Satoshi-Medium',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeText: {
    fontSize: 12,
    color: '#545456',
  },
  dateText: {
    fontSize: 11,
    color: '#545456',
  },
  nextBtn: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(98, 97, 106, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KundliRequestCard;
