import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CheckoutItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CheckoutState = {
  step: number;

  answers: {
    [key: string]: any;
  };

  items: CheckoutItem[];
};

const initialState: CheckoutState = {
  step: 0,

  answers: {},

  items: [],
};

const checkoutSlice = createSlice({
  name: "checkout",

  initialState,

  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },

    prevStep: (state) => {
      state.step -= 1;
    },

    setAnswer: (
      state,
      action: PayloadAction<{
        key: string;
        value: any;
      }>,
    ) => {
      state.answers[action.payload.key] = action.payload.value;
    },

    // 🔥 IMPORTANT
    setCheckoutItems: (state, action: PayloadAction<CheckoutItem[]>) => {
      state.items = action.payload;
    },

    resetCheckout: () => initialState,
  },
});

export const {
  nextStep,
  prevStep,
  setAnswer,
  setCheckoutItems,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
