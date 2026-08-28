/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import {
    EventType,
    ZoomVideoSdkUser,
    useZoom,
} from "@zoom/react-native-videosdk";
import { EmitterSubscription } from "react-native";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

interface JoinSessionData {
    sessionName: string;
    token: string;
    userName: string;
    sessionPassword?: string;
}

const useZoomCall = () => {
    const zoom = useZoom();

    const listeners =
        useRef<EmitterSubscription[]>([]);

    const [users, setUsers] = useState<
        ZoomVideoSdkUser[]
    >([]);

    const [mySelf, setMySelf] =
        useState<ZoomVideoSdkUser | null>(
            null,
        );

    const [isInSession, setIsInSession] =
        useState(false);

    const [isMuted, setIsMuted] =
        useState(false);

    const [isVideoOn, setIsVideoOn] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const refreshUsers =
        useCallback(async () => {
            try {
                console.log(
                    "[Zoom] Refreshing users...",
                );

                const currentUser =
                    await zoom.session.getMySelf();

                console.log(
                    "[Zoom] Current user:",
                    currentUser,
                );

                if (!currentUser) {
                    console.log(
                        "[Zoom] Current user not found",
                    );

                    setMySelf(null);
                    setUsers([]);

                    return;
                }

                const currentUserObject =
                    new ZoomVideoSdkUser(
                        currentUser,
                    );

                const remoteUsers =
                    await zoom.session.getRemoteUsers();

                console.log(
                    "[Zoom] Remote users:",
                    remoteUsers,
                );

                const remoteUserObjects =
                    remoteUsers.map(
                        (user) =>
                            new ZoomVideoSdkUser(
                                user,
                            ),
                    );

                setMySelf(
                    currentUserObject,
                );

                setUsers([
                    currentUserObject,
                    ...remoteUserObjects,
                ]);

                console.log(
                    "[Zoom] Users updated:",
                    {
                        myUserId:
                            currentUserObject.userId,
                        remoteCount:
                            remoteUserObjects.length,
                    },
                );
            } catch (error) {
                console.error(
                    "[Zoom] Refresh users error:",
                    error,
                );
            }
        }, [zoom]);

    const setupListeners =
        useCallback(() => {
            console.log(
                "[Zoom] Setting up listeners...",
            );

            listeners.current.forEach(
                (listener) =>
                    listener.remove(),
            );

            listeners.current = [];

            const sessionJoin =
                zoom.addListener(
                    EventType.onSessionJoin,
                    async () => {
                        console.log(
                            "[Zoom] ✅ onSessionJoin fired",
                        );

                        setIsInSession(true);
                        setError(null);

                        await refreshUsers();
                    },
                );

            const sessionLeave =
                zoom.addListener(
                    EventType.onSessionLeave,
                    (event) => {
                        console.log(
                            "[Zoom] ❌ onSessionLeave:",
                            event,
                        );

                        setIsInSession(false);
                        setUsers([]);
                        setMySelf(null);
                    },
                );

            const userJoin =
                zoom.addListener(
                    EventType.onUserJoin,
                    async (event) => {
                        console.log(
                            "[Zoom] 👤 onUserJoin:",
                            event,
                        );

                        await refreshUsers();
                    },
                );

            const userLeave =
                zoom.addListener(
                    EventType.onUserLeave,
                    async (event) => {
                        console.log(
                            "[Zoom] 👋 onUserLeave:",
                            event,
                        );

                        await refreshUsers();
                    },
                );

            const errorListener =
                zoom.addListener(
                    EventType.onError,
                    (event) => {
                        console.error(
                            "[Zoom] 🚨 onError:",
                            event,
                        );

                        console.error(
                            "[Zoom] 🚨 Error JSON:",
                            JSON.stringify(
                                event,
                                null,
                                2,
                            ),
                        );

                        const errorMessage =
                            JSON.stringify(
                                event,
                            );

                        setError(
                            `Zoom error: ${errorMessage}`,
                        );
                    },
                );

            listeners.current = [
                sessionJoin,
                sessionLeave,
                userJoin,
                userLeave,
                errorListener,
            ];

            console.log(
                "[Zoom] Listeners registered:",
                listeners.current.length,
            );
        }, [refreshUsers, zoom]);

    const cleanupListeners =
        useCallback(() => {
            console.log(
                "[Zoom] Cleaning up listeners...",
            );

            listeners.current.forEach(
                (listener) =>
                    listener.remove(),
            );

            listeners.current = [];
        }, []);

    const joinSession =
        useCallback(
            async ({
                sessionName,
                token,
                userName,
                sessionPassword,
            }: JoinSessionData) => {
                try {
                    setError(null);

                    console.log(
                        "[Zoom] ============================"
                    );

                    console.log(
                        "[Zoom] JOIN SESSION START"
                    );

                    console.log(
                        "[Zoom] sessionName:",
                        sessionName
                    );

                    console.log(
                        "[Zoom] userName:",
                        userName
                    );

                    console.log(
                        "[Zoom] token exists:",
                        Boolean(token)
                    );

                    console.log(
                        "[Zoom] password exists:",
                        Boolean(sessionPassword)
                    );

                    if (!sessionName) {
                        throw new Error(
                            "Zoom session name is missing."
                        );
                    }

                    if (!token) {
                        throw new Error(
                            "Zoom token is missing."
                        );
                    }

                    if (!userName) {
                        throw new Error(
                            "Zoom userName is missing."
                        );
                    }

                    setupListeners();

                    console.log(
                        "[Zoom] Calling zoom.joinSession()..."
                    );

                    const result =
                        await zoom.joinSession({
                            sessionName,
                            token,
                            userName,
                            sessionPassword,

                            sessionIdleTimeoutMins: 15,

                            audioOptions: {
                                connect: true,
                                mute: false,
                                autoAdjustSpeakerVolume:
                                    false,
                            },

                            videoOptions: {
                                localVideoOn: false,
                            },
                        });

                    console.log(
                        "[Zoom] joinSession() returned:",
                        result
                    );

                    console.log(
                        "[Zoom] Waiting for onSessionJoin..."
                    );
                } catch (error) {
                    console.error(
                        "[Zoom] ❌ JOIN SESSION ERROR:",
                        error
                    );

                    console.error(
                        "[Zoom] Error message:",
                        error instanceof Error
                            ? error.message
                            : String(error)
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : String(error)
                    );

                    throw error;
                }
            },
            [setupListeners, zoom]
        );

    const toggleMute =
        useCallback(async () => {
            try {
                const currentUser =
                    await zoom.session.getMySelf();

                if (!currentUser) {
                    console.log(
                        "[Zoom] Cannot toggle mute: no current user",
                    );

                    return;
                }

                const muted =
                    currentUser.audioStatus.isMuted();

                console.log(
                    "[Zoom] Current mute state:",
                    muted,
                );

                if (muted) {
                    await zoom.audioHelper.unmuteAudio(
                        currentUser.userId,
                    );

                    setIsMuted(false);

                    console.log(
                        "[Zoom] Microphone unmuted",
                    );
                } else {
                    await zoom.audioHelper.muteAudio(
                        currentUser.userId,
                    );

                    setIsMuted(true);

                    console.log(
                        "[Zoom] Microphone muted",
                    );
                }
            } catch (error) {
                console.error(
                    "[Zoom] Toggle mute error:",
                    error,
                );
            }
        }, [zoom]);

    const toggleVideo =
        useCallback(async () => {
            try {
                console.log(
                    "[Zoom] Toggling video. Current:",
                    isVideoOn,
                );

                if (isVideoOn) {
                    await zoom.videoHelper.stopVideo();

                    setIsVideoOn(false);

                    console.log(
                        "[Zoom] Video stopped",
                    );
                } else {
                    await zoom.videoHelper.startVideo();

                    setIsVideoOn(true);

                    console.log(
                        "[Zoom] Video started",
                    );
                }
            } catch (error) {
                console.error(
                    "[Zoom] Toggle video error:",
                    error,
                );
            }
        }, [isVideoOn, zoom]);

    const switchCamera =
        useCallback(async () => {
            try {
                await zoom.videoHelper.switchCamera();

                console.log(
                    "[Zoom] Camera switched",
                );
            } catch (error) {
                console.error(
                    "[Zoom] Switch camera error:",
                    error,
                );
            }
        }, [zoom]);

    const leaveSession =
        useCallback(async () => {
            try {
                console.log(
                    "[Zoom] Leaving session...",
                );

                await zoom.leaveSession(
                    false,
                );
            } catch (error) {
                console.error(
                    "[Zoom] Leave session error:",
                    error,
                );
            } finally {
                setIsInSession(false);
                setUsers([]);
                setMySelf(null);
                cleanupListeners();
            }
        }, [cleanupListeners, zoom]);

    const endSession =
        useCallback(async () => {
            try {
                console.log(
                    "[Zoom] Ending session...",
                );

                await zoom.leaveSession(
                    true,
                );
            } catch (error) {
                console.error(
                    "[Zoom] End session error:",
                    error,
                );
            } finally {
                setIsInSession(false);
                setUsers([]);
                setMySelf(null);
                cleanupListeners();
            }
        }, [cleanupListeners, zoom]);

    useEffect(() => {
        return () => {
            cleanupListeners();
        };
    }, [cleanupListeners]);

    return {
        zoom,
        users,
        mySelf,
        isInSession,
        isMuted,
        isVideoOn,
        error,
        joinSession,
        leaveSession,
        endSession,
        toggleMute,
        toggleVideo,
        switchCamera,
        refreshUsers,
    };
};

export default useZoomCall;