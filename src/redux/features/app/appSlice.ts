import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  onboardingDone: boolean;
  bootstrapped: boolean;
};

const initialState: AppState = {
  onboardingDone: false,
  bootstrapped: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOnboardingDone(state, action: PayloadAction<boolean>) {
      state.onboardingDone = action.payload;
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
  },
});

export const { setOnboardingDone, setBootstrapped } = appSlice.actions;
export default appSlice.reducer;
