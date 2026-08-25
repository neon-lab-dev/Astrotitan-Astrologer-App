/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import SessionCardSkeleton from '../../tabs/session/SessionCard/SessionCardSkeleton';
import SessionCard from '../../tabs/session/SessionCard/SessionCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useDispatch } from 'react-redux';
import { setSelectedConsultation } from '../../../redux/features/consultation/consultationChatSlice';
import { TConsultation } from '../../../types/consultation.type';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const Consultations = ({
  isLoading,
  bookings,
}: {
  isLoading: boolean;
  bookings: TConsultation[];
}) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

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
      consultationFor: booking?.consultationFor,
    });
  };
  return (
    <View>
      {/* TODAY */}
      <View style={styles.section}>
        <ContentSection
          title="All Consultations"
          sectionStyle={{ marginBottom: 12 }}
        />

        <View>
          {isLoading ? (
            <SessionCardSkeleton />
          ) : (
            bookings?.map((item: any) => (
              <SessionCard
                key={item?._id}
                item={item}
                onPress={() =>
                  navigation.navigate('SessionHistoryDetailsScreen', {
                    consultationId: item?._id,
                  })
                }
                onChat={handleChatNow}
              />
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default Consultations;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
});
