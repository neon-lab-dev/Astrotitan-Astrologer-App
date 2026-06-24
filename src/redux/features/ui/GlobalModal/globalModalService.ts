// redux/features/ui/GlobalModal/ModalService.ts

import { ReactNode } from "react";
import { hideGlobalModal, showGlobalModal } from "./globalModalSlice";
import { store } from "../../../store";

class ModalService {
  open(
    content: ReactNode,
    options?: {
      redirectTo?: string;
      dismissible?: boolean;
      animation?: "fade" | "scale" | "slide";
    },
  ) {
    store.dispatch(
      showGlobalModal({
        content,
        redirectTo: options?.redirectTo,
        dismissible: options?.dismissible,
        animation: options?.animation,
      }),
    );
  }

  close() {
    store.dispatch(hideGlobalModal());
  }
}

export default new ModalService();
