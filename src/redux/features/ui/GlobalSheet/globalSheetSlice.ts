import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

type GlobalSheetState = {
  visible: boolean;
  content: ReactNode | null;
  height?: number | string;
  redirectTo?: string | null;
  hasGradient?: boolean;
  translate?:number
};

const initialState: GlobalSheetState = {
  visible: false,
  content: null,
  height: undefined,
  redirectTo: null,
  hasGradient: true,
  translate:undefined
};

const globalSheetSlice = createSlice({
  name: "globalSheet",
  initialState,
  reducers: {
    showGlobalSheet: (
      state,
      action: PayloadAction<{
        content: ReactNode;
        height?: number | string;
        redirectTo?: string;
        hasGradient?: boolean;
        translate?:number;
      }>,
    ) => {
      state.visible = true;
      state.content = action.payload.content;
      state.height = action.payload.height;
      state.redirectTo = action.payload.redirectTo ?? null;
      state.hasGradient = action.payload.hasGradient ?? true;
      state.translate= action.payload.translate
    },

    hideGlobalSheet: (state) => {
      state.visible = false;
      state.content = null;
      state.redirectTo = null;
      state.hasGradient = true;
    },
  },
});

export const { showGlobalSheet, hideGlobalSheet } = globalSheetSlice.actions;

export default globalSheetSlice.reducer;
