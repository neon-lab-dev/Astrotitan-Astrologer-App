
import { ReactNode } from "react";
import { hideGlobalSheet, showGlobalSheet } from "./globalSheetSlice";
import { store } from "../../../store";

class BottomSheetService {
  open(
    content: ReactNode,
    options?: {
      height?: number | string;
      redirectTo?: string;
      hasGradient?: boolean; 
      translate?:number;
    },
  ) {
    store.dispatch(
      showGlobalSheet({
        content,
        height: options?.height,
        redirectTo: options?.redirectTo,
        hasGradient: options?.hasGradient, 
        translate:options?.translate
      }),
    );
  }

  close() {
    store.dispatch(hideGlobalSheet());
  }
}

export default new BottomSheetService();
