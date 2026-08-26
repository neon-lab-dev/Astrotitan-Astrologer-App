/* eslint-disable react-native/no-inline-styles */
import ArrowRoundedIcon from '@/assets/icons/actions/arrow-down-round.svg';
import React, { useCallback, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IconName, ICONS } from '../../../assets/svg';
import { SansText } from '../../../components/reusable/Text/SansText';
import {
  useLazyGetMeQuery,
} from '../../../redux/features/auth/authApi';
import { Storage } from '../../../services/storage/storage';
import {
  clearAuth,
  selectUser,
  updateUser,
} from '../../../redux/features/auth/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BottomSheetService from '../../../redux/features/ui/GlobalSheet/BottomSheetService';
import LogoutSection from '../../../components/reusable/BottomSheet/LogoutSection';
import DeleteAccountSection from '../../../components/reusable/BottomSheet/DeleteAccountSection';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import SectionTitle from '../../../components/reusable/SectionTitle/SectionTitle';
import AppBar from '../../../components/reusable/AppBar/AppBar';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const [getMe] = useLazyGetMeQuery();
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  
  const user = useSelector(selectUser);
  const [refreshing, setRefreshing] = useState(false);
  const resetAuth = async () => {
    await Storage.removeProfileCompleted();
    await Storage.removeAccessToken();
    await Storage.removeUser();

    dispatch(clearAuth());
    navigation.replace('LoginWithPhone');
  };
  const onPressLogout = () => {
    BottomSheetService.open(
      <LogoutSection
        onCancel={BottomSheetService.close}
        onLogout={() => {
          resetAuth();
          BottomSheetService.close();
        }}
      />,
      {
        height: 400,
        hasGradient: true,
      },
    );
  };
  const onPressDelete = () => {
    BottomSheetService.open(
      <DeleteAccountSection
        onCancel={BottomSheetService.close}
      />,
      {
        height: 400,
        hasGradient: true,
      },
    );
  };

  const fetchLatestUser = useCallback(async () => {
    try {
      const meRes = await getMe({}).unwrap();
      const finalUser = meRes.data;
      await Storage.setUser(finalUser);
      dispatch(updateUser(finalUser));
    } catch (error) {
      console.log('GET ME ERROR:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);
      await fetchLatestUser();
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, fetchLatestUser]);

  useFocusEffect(
    useCallback(() => {
      fetchLatestUser();
    }, []),
  );
  return (
    // <AnimatedScreen>
    <ScreenWrapper>

      <AppBar title="My Profile" />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#816B22"
            colors={['#816B22']}
            progressBackgroundColor="#FBF7EB"
          />
        }
        style={{ flex: 1, paddingBottom: 0 }}
      >
        <View style={{ paddingHorizontal: 16, gap: 24, paddingVertical: 24 }}>
          <View style={styles.profileCard}>
            {/* PROFILE IMAGE */}
            <Image
              source={
                user?.profile?.profilePicture
                  ? {
                      uri: user.profile.profilePicture,
                    }
                  : require('@/assets/images/user-profile-placeholder.png')
              }
              style={styles.avatar}
            />

            {/* PROFILE INFO */}
            <View style={styles.profileLeft}>
              <View
                style={{
                  gap: 8,
                  width: '70%',
                }}
              >
                <SatoshiText style={styles.name} numberOfLines={1}>
                  {user?.profile?.displayName || 'User'}
                </SatoshiText>

                <SansText style={styles.desc} numberOfLines={2}>
                  {user?.account?.email || ''}
                  {/* content info, user details */}
                </SansText>
              </View>

              {/* ARROW */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PersonalInformation');
                }}
                style={{
                  backgroundColor: '#F5F5F5',

                  padding: 12,

                  borderRadius: 40,

                  transform: [
                    {
                      rotate: '-90deg',
                    },
                  ],
                }}
              >
                <ArrowRoundedIcon color="#0D0D0D" />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <SectionTitle titleFontSize={18} title="General" />
            <View style={styles.card}>
              <ProfileItem
                title="Raise a query"
                icon="HelpIcon"
                onPress={() => {
                  navigation.navigate('Queries');
                }}
              />
              <ProfileItem
                title="Privacy"
                icon="SecurityIcon"
                onPress={() => {
                  navigation.navigate('PrivacyPolicy');
                }}
              />
              <ProfileItem
                title="Logout"
                icon="LogoutIcon"
                onPress={onPressLogout}
              />
              <ProfileItem
                title="Delete Account"
                icon="DeleteIcon"
                onPress={onPressDelete}
              />
            </View>
          </View>
        </View>

        {/* DELETE */}
      </ScrollView>
    </ScreenWrapper>
    // </AnimatedScreen>
  );
};
export default ProfileScreen;

const ProfileItem = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: IconName;
  onPress?: () => void;
}) => {
  const IconComponent = ICONS[icon];

  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        <IconComponent width={24} height={24} />
        <SansText style={styles.rowText}>{title}</SansText>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8DFC9',
    padding: 16,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },

  profileCard: {
    backgroundColor: '#0D0D0D',
    borderRadius: 24,
    padding: 24,
    gap: 24,
  },

  profileLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderColor: '#FBF7EB',
    borderWidth: 1,
  },

  name: {
    color: '#F5F5F5',
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    lineHeight: 26,
  },

  desc: {
    color: '#F5F5F5',
    fontSize: 16,
    lineHeight: 26,
  },

  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    marginTop: 12,
    paddingVertical: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  rowText: {
    fontSize: 16,
    color: '#0D0D0D',
  },

  deleteBtn: {
    backgroundColor: '#C0392B',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
  },

  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
