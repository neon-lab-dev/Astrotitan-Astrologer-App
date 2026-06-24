import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  setAccessToken: async (token: string) => {
    await AsyncStorage.setItem('ACCESS_TOKEN', token);
  },

  getAccessToken: async () => {
    return await AsyncStorage.getItem('ACCESS_TOKEN');
  },

  removeAccessToken: async () => {
    await AsyncStorage.removeItem('ACCESS_TOKEN');
  },

  setRefreshToken: async (token: string) => {
    await AsyncStorage.setItem('REFRESH_TOKEN', token);
  },

  getRefreshToken: async () => {
    return await AsyncStorage.getItem('REFRESH_TOKEN');
  },

  removeRefreshToken: async () => {
    await AsyncStorage.removeItem('REFRESH_TOKEN');
  },

  setUser: async (user: any) => {
    await AsyncStorage.setItem('USER', JSON.stringify(user));
  },

  getUser: async () => {
    const user = await AsyncStorage.getItem('USER');
    return user ? JSON.parse(user) : null;
  },

  removeUser: async () => {
    await AsyncStorage.removeItem('USER');
  },

  setOnboardingDone: async () => {
    await AsyncStorage.setItem('ONBOARDING_DONE', 'true');
  },

  getOnboardingDone: async () => {
    return (await AsyncStorage.getItem('ONBOARDING_DONE')) === 'true';
  },

  removeOnboardingDone: async () => {
    await AsyncStorage.removeItem('ONBOARDING_DONE');
  },

  setProfileCompleted: async (isCompleted: boolean) => {
    await AsyncStorage.setItem('PROFILE_COMPLETED', isCompleted ? 'true' : 'false');
  },

  getProfileCompleted: async () => {
    return (await AsyncStorage.getItem('PROFILE_COMPLETED')) === 'true';
  },

  removeProfileCompleted: async () => {
    await AsyncStorage.removeItem('PROFILE_COMPLETED');
  },

  clearAll: async () => {
    await AsyncStorage.clear();
  },
};
