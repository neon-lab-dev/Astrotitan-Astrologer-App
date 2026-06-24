import ArrowRoundedIcon from '@/assets/icons/actions/arrow-down-round.svg';
import React, { useCallback, useState } from "react";
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IconName, ICONS } from '../../../assets/svg';
import { SansText } from '../../../components/reusable/Text/SansText';
import { useLazyGetMeQuery } from '../../../redux/features/auth/authApi';
import { RootState } from '../../../redux/store';
import { Storage } from '../../../services/storage/storage';
import { clearAuth, selectUser, updateUser } from '../../../redux/features/auth/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BottomSheetService from '../../../redux/features/ui/GlobalSheet/BottomSheetService';
import LogoutSection from '../../../components/reusable/BottomSheet/LogoutSection';
import DeleteAccountSection from '../../../components/reusable/BottomSheet/DeleteAccountSection';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppHeader from '../../../components/reusable/AppHeader/AppHeader';
import AuthTitle from '../../../components/auth/AuthTitle';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import SectionTitle from '../../../components/reusable/SectionTitle/SectionTitle';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const [getMe] =
    useLazyGetMeQuery();
  type NavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();
  const user = useSelector(selectUser);
  const [refreshing, setRefreshing] = useState(false);
  const resetAuth = async () => {
    await Storage.removeProfileCompleted();
    await Storage.removeAccessToken();
    await Storage.removeUser();

    dispatch(clearAuth());
    navigation.replace("LoginWithPhone");


  };
  const onPressLogout = () => {
    BottomSheetService.open(
      <LogoutSection onCancel={BottomSheetService.close} onLogout={() => {
        resetAuth()
        BottomSheetService.close()
      }} />,
      {
        height: 400,
        hasGradient: true,
      }
    );
  };
  const onPressDelete = () => {
    BottomSheetService.open(
      <DeleteAccountSection onCancel={BottomSheetService.close} onLogout={() => { }} />,
      {
        height: 400,
        hasGradient: true,
      }
    );
  };

  const fetchLatestUser = useCallback(async () => {
    try {
      const meRes = await getMe({}).unwrap();
      const finalUser = meRes.data;
      await Storage.setUser(finalUser);
      dispatch(updateUser(finalUser));
       console.log("Profile upated");
    } catch (error) {
      console.log("GET ME ERROR:", error);
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
    }, []) // ← don't pass fetchLatestUser here
  );
  return (
    <AnimatedScreen>
      <ScreenWrapper>

        <AppHeader showBack={false} >
          <AuthTitle title="Profile">
            <SansText style={{ fontSize: 18 }}>
              Manage your personal details & preferences.
            </SansText>
          </AuthTitle>
        </AppHeader>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#816B22"
            colors={["#816B22"]}
            progressBackgroundColor="#FBF7EB"
          />
        } style={{ flex: 1, paddingBottom: 0 }}>
          <View style={{ paddingHorizontal: 16, gap: 24, paddingVertical: 24 }}>
            <View style={styles.profileCard}>
              {/* PROFILE IMAGE */}
              <Image
                source={
                  user?.profile
                    ?.profilePicture
                    ? {
                      uri: user.profile
                        .profilePicture,
                    }
                    : require("@/assets/images/dummy/experts/expert1.png")
                }
                style={styles.avatar}
              />

              {/* PROFILE INFO */}
              <View style={styles.profileLeft}>
                <View
                  style={{
                    gap: 8,
                    width: "70%",
                  }}
                >
                  <SatoshiText
                    style={styles.name}
                    numberOfLines={1}
                  >
                    {user?.profile
                      ?.fullName ||
                      "User"}
                  </SatoshiText>

                  <SansText
                    style={styles.desc}
                    numberOfLines={2}
                  >
                    {user?.account
                      ?.email ||
                      ""}
                    {/* content info, user details */}
                  </SansText>
                </View>

                {/* ARROW */}
                <TouchableOpacity
                  onPress={() => { navigation.navigate("PersonalInformation") }}
                  style={{
                    backgroundColor:
                      "#F5F5F5",

                    padding: 12,

                    borderRadius: 40,

                    transform: [
                      {
                        rotate: "-90deg",
                      },
                    ],
                  }}
                >
                  <ArrowRoundedIcon color="#0D0D0D" />
                </TouchableOpacity>
              </View>
            </View>

            <View><SectionTitle titleFontSize={18} title="General"></SectionTitle>
              <View style={styles.card}>

                <ProfileItem title="Raise a query" icon="HelpIcon" onPress={() => { navigation.navigate("Queries") }} />
                <ProfileItem title="Privacy" icon="SecurityIcon" onPress={() => { navigation.navigate("PrivacyPolicy") }} />
                <ProfileItem title="Logout" icon="LogoutIcon" onPress={onPressLogout} />
              </View></View>
            {/* GENERAL */}
            <ReusableButton onPress={onPressDelete} variant='error' title='Delete'>

            </ReusableButton>

          </View>


          {/* DELETE */}

        </ScrollView>
      </ScreenWrapper></AnimatedScreen>
  );
};
export default ProfileScreen;

const ProfileItem = ({ title, icon, onPress }: { title: string; icon: IconName, onPress?: () => void; }) => {
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
    backgroundColor: "#E8DFC9",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },

  profileCard: {
    backgroundColor: "#0D0D0D",
    borderRadius: 24,
    padding: 24, gap: 24,
  },

  profileLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderColor: "#FBF7EB",
    borderWidth: 1
  },

  name: {
    color: "#F5F5F5",
    fontSize: 18,
    fontFamily: "Satoshi-Bold",
    lineHeight: 26,
  },

  desc: {
    color: "#F5F5F5",
    fontSize: 18,
    lineHeight: 26,
  },


  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    marginTop: 12
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    fontSize: 18,
    color: "#0D0D0D"
  },

  deleteBtn: {
    backgroundColor: "#C0392B",
    padding: 14,
    borderRadius: 24,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});