import { StyleSheet, View } from 'react-native';
import ReusableButton from '../ReusableButton/ReusableButton';
import { SatoshiText } from '../Text/SatoshiText';
import { SansText } from '../Text/SansText';
import { useGoogleCalendar } from '../../../hooks/useGoogleCalendar';
import BottomSheetService from '../../../redux/features/ui/GlobalSheet/BottomSheetService';
import ScheduleMeeting from './ScheduleMeetingSection';

type Props = {
  consultationId: string;
  userName: string;
  userImage?: string;
  date: string;
  time: string;
  onCancel: () => void;
};

const ConnectGoogleSection = ({
  userName,
  consultationId,
  userImage,
  date,
  time,
  onCancel,
}: Props) => {
  const { isConnected, isLoading, connectCalendar } = useGoogleCalendar();

  if (isConnected) {
    return BottomSheetService.open(
      <ScheduleMeeting
        consultationId={consultationId}
        userName={userName}
        userImage={userImage}
        date={date}
        time={time}
        onNotNow={BottomSheetService.close}
      />,
      {
        height: 500,
        hasGradient: true,
      },
    );
  }

  
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Icon/Illustration placeholder - Optional */}
        <View style={styles.iconContainer}>
          <View style={styles.googleIconWrapper}>
            <SansText style={styles.googleIconText}>G</SansText>
          </View>
        </View>

        <View style={styles.textContainer}>
          <SatoshiText style={styles.title}>
            Connect your Google Account
          </SatoshiText>

          <SansText style={styles.description}>
            Connect your Google account to schedule calls seamlessly. This will
            allow us to access your calendar and manage your appointments
            efficiently.
          </SansText>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={{ flex: 1 }}>
          <ReusableButton
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            borderColor="#D4AF37"
            textColor="#D4AF37"
            width="100%"
          />
        </View>

        <View style={{ flex: 1 }}>
          <ReusableButton
            title="Connect Google"
            onPress={connectCalendar}
            disabled={isLoading}
            variant="solid"
            width="100%"
            loading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default ConnectGoogleSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },

  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    marginBottom: 32,
  },

  googleIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F3F4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADCE0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },

  googleIconText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#4285F4',
    fontFamily: 'GeneralSans-Bold',
  },

  textContainer: {
    gap: 12,
    alignItems: 'center',
  },

  title: {
    fontSize: 21,
    fontFamily: 'Satoshi-Bold',
    color: '#0D0D0D',
    textAlign: 'center',
    lineHeight: 28,
  },

  description: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'GeneralSans-Regular',
    paddingHorizontal: 8,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 32,
    paddingBottom: 8,
  },
});
