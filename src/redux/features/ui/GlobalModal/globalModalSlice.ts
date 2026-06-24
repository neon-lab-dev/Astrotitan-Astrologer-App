// redux/features/ui/GlobalModal/globalModalSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

type GlobalModalState = {
  visible: boolean;
  content: ReactNode | null;
  redirectTo?: string | null;
  dismissible?: boolean;
  animation?: "fade" | "scale" | "slide";
};

const initialState: GlobalModalState = {
  visible: false,
  content: null,
  redirectTo: null,
  dismissible: true,
  animation: "scale",
};

const globalModalSlice = createSlice({
  name: "globalModal",
  initialState,
  reducers: {
    showGlobalModal: (
      state,
      action: PayloadAction<{
        content: ReactNode;
        redirectTo?: string;
        dismissible?: boolean;
        animation?: "fade" | "scale" | "slide";
      }>,
    ) => {
      state.visible = true;
      state.content = action.payload.content;
      state.redirectTo = action.payload.redirectTo ?? null;
      state.dismissible = action.payload.dismissible ?? true;
      state.animation = action.payload.animation ?? "scale";
    },

    hideGlobalModal: (state) => {
      state.visible = false;
      state.content = null;
      state.redirectTo = null;
    },
  },
});

export const { showGlobalModal, hideGlobalModal } = globalModalSlice.actions;
export default globalModalSlice.reducer;
