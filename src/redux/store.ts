import { configureStore } from '@reduxjs/toolkit';
import appReducer from './features/app/appSlice';
import { authApi } from './features/auth/authApi';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import checkoutReducer from './features/checkout/checkoutSlice';
import globalModalReducer from './features/ui/GlobalModal/globalModalSlice';
import globalSheetReducer from './features/ui/GlobalSheet/globalSheetSlice';
import useDetailsFormReducer from './features/userDetailsForm/userDetailsDormSlice';
import UserVerificationFormReducer from './features/UserVerificationForm/UserVerificationFormSlice';
import consultationChatReducer from "./features/consultation/consultationChatSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    userDetailForm: useDetailsFormReducer,
    UserVerificationForm: UserVerificationFormReducer,
    globalSheet: globalSheetReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    globalModal: globalModalReducer,
    consultationChat: consultationChatReducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['globalSheet.content'],
      },
    }).concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
