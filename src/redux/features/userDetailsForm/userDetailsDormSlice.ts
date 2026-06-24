// store/formSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDetailsFormState {
  step: number;
  answers: {
    [key: string]: any;
  };
}

const initialState: UserDetailsFormState = {
  step: 0,
  answers: {},
};

const userDetailsFormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setAnswer: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.answers[action.payload.key] = action.payload.value;
    },
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 0) state.step -= 1;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { setAnswer, nextStep, prevStep, setStep, resetForm } =
  userDetailsFormSlice.actions;
export default userDetailsFormSlice.reducer;
