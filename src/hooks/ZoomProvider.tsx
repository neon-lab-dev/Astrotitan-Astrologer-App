import React from "react";
import {
  ZoomVideoSdkProvider,
} from "@zoom/react-native-videosdk";

interface ZoomProviderProps {
  children: React.ReactNode;
}

const ZoomProvider = ({
  children,
}: ZoomProviderProps) => {
  return (
    <ZoomVideoSdkProvider
      config={{
        domain: "zoom.us",
        enableLog: __DEV__,
      }}
    >
      {children}
    </ZoomVideoSdkProvider>
  );
};

export default ZoomProvider;