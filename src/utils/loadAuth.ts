import { authApi } from '../redux/features/auth/authApi';
import { setAuth } from '../redux/features/auth/authSlice';
import { store } from '../redux/store';
import { Storage } from '../services/storage/storage';

export const loadAuth = async () => {
  const token = await Storage.getAccessToken();
  const userString = await Storage.getUser();
  await Storage.setProfileCompleted(userString.isProfileComplete);
  console.log(token, 'loadAuth');
  if (token) {
    store.dispatch(
      setAuth({
        token,
        user: userString,
      }),
    );

    console.log('Redux after initial load:', store.getState().auth);

    try {
      // ✅ Step 2: call getMe AFTER token is in Redux
      const result = await store.dispatch(
        authApi.endpoints.getMe.initiate({}, { forceRefetch: true }),
      );

      if ('data' in result) {
        const freshUser = result.data.data;

        console.log('✅ Fresh user from API:', freshUser);

        // ✅ Step 3: update Redux with fresh user (KEEP token)
        store.dispatch(
          setAuth({
            token,
            user: freshUser,
          }),
        );

        Storage.setUser(freshUser);
      }
    } catch (err) {
      console.log('❌ getMe failed:', err);
    }
  } else {
    console.log('No auth data found in storage');
  }
};
