import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetMyKundliRequestsQuery } from '../../../redux/features/kundliRequest/kundliRequestApi';
import KundliRequestCard from './KundliRequestCard';

const AllKundliRequests = () => {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useGetMyKundliRequestsQuery({});

  const requests = data?.data?.data || [];

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        Loading...
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {requests.map((item: any) => (
          <KundliRequestCard
            key={item._id}
            item={item}
            onPress={() => {
              navigation.navigate('KundliRequestDetails', { id: item._id });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  newRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.10)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newRequestText: {
    fontSize: 13,
    color: '#D4AF37',
    fontFamily: 'Satoshi-Medium',
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 2,
  },
});

export default AllKundliRequests;