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

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface QuickActionItemProps {
  bgColor?: string;
  label: string;
  value: string | number;
  buttonText: string;
  onPress: () => void;
  iconColor?: string;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({
  bgColor = '#F8F4EC',
  label,
  value,
  buttonText,
  onPress,
}) => {
  const RightIcon = ICONS.RightArrow;
  return (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.valueText}>{value}</Text>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <Text style={styles.actionText}>{buttonText}</Text>
        <RightIcon width={20} height={20} />
      </View>
    </TouchableOpacity>
  );
};

const QuickActions: React.FC = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Quick Actions</Text>
      </View>

      <View style={styles.gridContainer}>
        <QuickActionItem
          bgColor="#F8F4EC"
          label="Today's Bookings"
          value="12"
          buttonText="View All"
          onPress={() => {
            navigation.navigate('SessionsScreen');
          }}
        />

        <QuickActionItem
          bgColor="#F5F0E8"
          label="Kundli Requests"
          value="03"
          buttonText="View All"
          onPress={() => {
            navigation.navigate('KundliScreen');
          }}
        />

        <QuickActionItem
          bgColor="#F8F4EC"
          label="Total Bookings"
          value="03"
          buttonText="View All"
          onPress={() => {
            navigation.navigate('SessionsScreen');
          }}
        />

        <QuickActionItem
          bgColor="#F5F0E8"
          label="Published Blogs"
          value="08"
          buttonText="View All"
          onPress={() => {
            navigation.navigate('CreateScreen');
          }}
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
    fontWeight: '700',
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
});

export default QuickActions;
