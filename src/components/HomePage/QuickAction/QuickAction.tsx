import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ICONS } from '../../../assets/svg';
import { useNavigation } from '@react-navigation/native';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface QuickActionItemProps {
  bgColor?: string;
  label: string;
  value: string | number;
  buttonText: string;
  onPress: () => void;
  iconColor?: string;
  isLoading?: boolean;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({
  bgColor = '#F8F4EC',
  label,
  value,
  buttonText,
  onPress,
  isLoading = false,
}) => {
  const RightIcon = ICONS.RightArrow;
  
  // Format the value to show with leading zero for single digits, but keep 0 as 0
  const formatValue = (val: string | number) => {
    const num = typeof val === 'string' ? parseInt(val, 10) : val;
    // If it's 0, return '0'
    if (num === 0) return '0';
    // If it's a single digit (1-9), add leading zero
    if (num >= 1 && num < 10) return `0${num}`;
    // Otherwise return as is
    return String(num);
  };

  return (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          {isLoading ? (
            <>
              <View style={styles.skeletonValue} />
              <View style={styles.skeletonLabel} />
            </>
          ) : (
            <>
              <SatoshiText style={styles.valueText}>{formatValue(value)}</SatoshiText>
              <SansText style={styles.labelText}>{label}</SansText>
            </>
          )}
        </View>
      </View>
      <View style={styles.actionRow}>
        {isLoading ? (
          <View style={styles.skeletonAction} />
        ) : (
          <>
            <SansText style={styles.actionText}>{buttonText}</SansText>
            <RightIcon width={20} height={20} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const QuickActions = ({ stats, isLoading }: any) => {
  const navigation = useNavigation<any>();
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SatoshiText style={styles.headerTitle}>Quick Actions</SatoshiText>
      </View>

      <View style={styles.gridContainer}>
        <QuickActionItem
          bgColor="#F8F4EC"
          label="Today's Bookings"
          value={stats?.todayBookings || 0}
          buttonText="View All"
          onPress={() => {
            navigation.navigate('SessionsScreen');
          }}
          isLoading={isLoading}
        />

        <QuickActionItem
          bgColor="#F5F0E8"
          label="Kundli Requests"
          value={stats?.kundliRequests || 0}
          buttonText="View All"
          onPress={() => {
            navigation.navigate('KundliScreen');
          }}
          isLoading={isLoading}
        />

        <QuickActionItem
          bgColor="#F8F4EC"
          label="Total Bookings"
          value={stats?.totalBookings || 0}
          buttonText="View All"
          onPress={() => {
            navigation.navigate('SessionsScreen');
          }}
          isLoading={isLoading}
        />

        <QuickActionItem
          bgColor="#F5F0E8"
          label="Published Blogs"
          value={stats?.publishedBlogs || 0}
          buttonText="View All"
          onPress={() => {
            navigation.navigate('CreateScreen');
          }}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerContainer: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionCard: {
    width: cardWidth,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.08)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  valueText: {
    fontSize: 22,
    fontFamily:"Satoshi-Bold",
    color: '#1a1a2e',
    letterSpacing: -0.3,
  },
  labelText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 1,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.10)',
  },
  actionText: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: '500',
  },
  // Skeleton Loader Styles
  skeletonValue: {
    width: 60,
    height: 24,
    backgroundColor: '#E8E0D0',
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonLabel: {
    width: 80,
    height: 14,
    backgroundColor: '#E8E0D0',
    borderRadius: 4,
    marginTop: 4,
  },
  skeletonAction: {
    width: 50,
    height: 16,
    backgroundColor: '#E8E0D0',
    borderRadius: 4,
  },
});

export default QuickActions;