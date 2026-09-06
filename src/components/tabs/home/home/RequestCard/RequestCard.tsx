import React from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SatoshiText } from "../../../../reusable/Text/SatoshiText";
import { SansText } from "../../../../reusable/Text/SansText";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../navigation/types";

type Props = {
  item: any;
  isVerified?: boolean;
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const RequestCard = ({ item }: Props) => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const getStatusColor = () => {
    if (item?.status === 'ended') return '#10b404';
    if (item?.status === 'accepted') return '#2196F3';
    if (item?.status === 'rejected') return '#FF0000';
    if (item?.status === 'pending') return '#D4AF37';
    return '#E0E0E0';
  };

  const getStatusText = () => {
    if (item?.status === 'ended') return 'Completed';
    if (item?.status === 'accepted') return 'Accepted';
    if (item?.status === 'pending') return 'Pending';
    if (item?.status === 'rejected') return 'Rejected';
    return 'Unknown';
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "call": return "📞 Call";
      case "chat": return "💬 Chat";
      default: return method || "Unknown";
    }
  };

  const handlePress = () => {
    navigation.navigate('SessionHistoryDetailsScreen', {
      consultationId: item._id,
    });
  };

  return (
    <TouchableOpacity 
      style={styles.requestCard} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item?.user?.profilePicture }}
        style={styles.avatar}
      />
      
      <View style={styles.content}>
        <View style={styles.topRow}>
          <SatoshiText style={styles.name} numberOfLines={1}>
            {item?.user?.fullName}
          </SatoshiText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <SansText style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </SansText>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <SansText style={styles.detailLabel}>📅 Date</SansText>
            <SansText style={styles.detailValue}>{formatDate(item.createdAt)}</SansText>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <SansText style={styles.detailValue}>{getMethodLabel(item.method)}</SansText>
          </View>
        </View>

        {item.consultationFor && (
          <View style={styles.purposeContainer}>
            <SansText style={styles.purposeLabel}>Purpose</SansText>
            <SansText style={styles.purpose} numberOfLines={1}>
              {item.consultationFor}
            </SansText>
          </View>
        )}
      </View>

      <SansText style={styles.arrow}>›</SansText>
    </TouchableOpacity>
  );
};

export default RequestCard;

const styles = StyleSheet.create({
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    minHeight: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.08)",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F0E8",
  },
  content: {
    flex: 1,
    marginLeft: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    color: "#1a1a2e",
    fontWeight: "500",
  },
  detailDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 8,
  },
  purposeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  purposeLabel: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "500",
  },
  purpose: {
    fontSize: 12,
    color: "#6B6B70",
    flex: 1,
    textTransform: "capitalize",
  },
  arrow: {
    fontSize: 22,
    color: "#D4AF37",
    marginLeft: 8,
    fontWeight: "300",
  },
});