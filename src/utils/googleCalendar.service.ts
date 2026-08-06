// src/services/googleCalendar.service.ts

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '291765875122-otcru377uk9emjuepu6qcf6ocus4gl3h.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

class GoogleCalendarService {
  async signIn() {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const user = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();

    return {
      user,
      accessToken: tokens.accessToken,
    };
  }

  async signOut() {
    await GoogleSignin.signOut();
  }

  async isSignedIn() {
    return GoogleSignin.hasPreviousSignIn();
  }

  async getCurrentUser() {
    return GoogleSignin.getCurrentUser();
  }
}

export default new GoogleCalendarService();