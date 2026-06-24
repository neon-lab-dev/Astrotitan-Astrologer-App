import { createSlice } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  user: any | null;
  loading: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;

      state.user = action.payload.user;

      state.loading = false;
    },

    clearAuth: state => {
      state.token = null;
      state.user = null;
      state.loading = false;
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
        profile: {
          ...state.user?.profile,
          ...action.payload?.profile,
        },
        account: {
          ...state.user?.account,
          ...action.payload?.account,
        },
      };
    },

    setLoading: state => {
      state.loading = true;
    },
  },
});

export const { setAuth, clearAuth, setLoading, updateUser } = authSlice.actions;

/* SELECTORS */

export const selectToken = (state: any) => state.auth.token;

export const selectUser = (state: any) => state.auth.user;

export default authSlice.reducer;
