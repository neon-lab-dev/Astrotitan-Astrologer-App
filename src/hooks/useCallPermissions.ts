import {
    PermissionsAndroid,
    Platform,
} from "react-native";

const useCallPermissions = () => {
    const requestPermissions =
        async (): Promise<boolean> => {
            if (Platform.OS !== "android") {
                return true;
            }

            try {
                const result =
                    await PermissionsAndroid.requestMultiple(
                        [
                            PermissionsAndroid.PERMISSIONS
                                .CAMERA,

                            PermissionsAndroid.PERMISSIONS
                                .RECORD_AUDIO,
                        ],
                    );

                const cameraGranted =
                    result[
                        PermissionsAndroid.PERMISSIONS
                            .CAMERA
                    ] ===
                    PermissionsAndroid.RESULTS
                        .GRANTED;

                const microphoneGranted =
                    result[
                        PermissionsAndroid.PERMISSIONS
                            .RECORD_AUDIO
                    ] ===
                    PermissionsAndroid.RESULTS
                        .GRANTED;

                console.log(
                    "[Permissions] Camera:",
                    cameraGranted,
                );

                console.log(
                    "[Permissions] Microphone:",
                    microphoneGranted,
                );

                return (
                    cameraGranted &&
                    microphoneGranted
                );
            } catch (error) {
                console.error(
                    "[Permissions] Permission error:",
                    error,
                );

                return false;
            }
        };

    return {
        requestPermissions,
    };
};

export default useCallPermissions;