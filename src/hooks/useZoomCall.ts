/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import {
    EventType,
    ZoomVideoSdkUser,
    useZoom,
} from "@zoom/react-native-videosdk";

import {
    EmitterSubscription,
} from "react-native";

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
                const currentUser =
                    await zoom.session.getMySelf();

                if (!currentUser) {
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

                const remoteUserObjects =
                    remoteUsers.map(
                        user =>
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
                    "[Zoom] Current user:",
                    currentUserObject.userId,
                );

                console.log(
                    "[Zoom] Remote users:",
                    remoteUserObjects.map(
                        user =>
                            user.userId,
                    ),
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
            listeners.current.forEach(
                listener =>
                    listener.remove(),
            );

            listeners.current = [];

            const sessionJoin =
                zoom.addListener(
                    EventType.onSessionJoin,
                    async () => {
                        console.log(
                            "[Zoom] ✅ Session joined",
                        );

                        setIsInSession(true);
                        setError(null);

                        await refreshUsers();

                        try {
                            console.log(
                                "[Zoom] Starting audio...",
                            );

                            await zoom.audioHelper
                                .startAudio();

                            console.log(
                                "[Zoom] ✅ Audio started",
                            );
                        } catch (error) {
                            console.error(
                                "[Zoom] ❌ Audio start error:",
                                error,
                            );
                        }

                        try {
                            console.log(
                                "[Zoom] Starting video...",
                            );

                            await zoom.videoHelper
                                .startVideo();

                            setIsVideoOn(true);

                            console.log(
                                "[Zoom] ✅ Video started",
                            );
                        } catch (error) {
                            console.error(
                                "[Zoom] ❌ Video start error:",
                                error,
                            );
                        }
                    },
                );

            const sessionLeave =
                zoom.addListener(
                    EventType.onSessionLeave,
                    event => {
                        console.log(
                            "[Zoom] ❌ Session left:",
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
                    async event => {
                        console.log(
                            "[Zoom] 👤 User joined:",
                            event,
                        );

                        await refreshUsers();
                    },
                );

            const userLeave =
                zoom.addListener(
                    EventType.onUserLeave,
                    async event => {
                        console.log(
                            "[Zoom] 👋 User left:",
                            event,
                        );

                        await refreshUsers();
                    },
                );

            const errorListener =
                zoom.addListener(
                    EventType.onError,
                    event => {
                        console.error(
                            "[Zoom] 🚨 SDK Error:",
                            event,
                        );

                        console.error(
                            "[Zoom] 🚨 SDK Error JSON:",
                            JSON.stringify(
                                event,
                                null,
                                2,
                            ),
                        );

                        setError(
                            `Zoom error: ${JSON.stringify(
                                event,
                            )}`,
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
        }, [refreshUsers, zoom]);

    const cleanupListeners =
        useCallback(() => {
            listeners.current.forEach(
                listener =>
                    listener.remove(),
            );

            listeners.current = [];
        }, []);

    const isJoiningRef = useRef(false);
    const hasJoinedRef = useRef(false);

    const joinSession = useCallback(
        async ({
            sessionName,
            token,
            userName,
            sessionPassword,
        }: JoinSessionData) => {
            if (isJoiningRef.current) {
                console.log(
                    "[Zoom] Join already in progress. Ignoring duplicate join."
                );

                return;
            }

            if (hasJoinedRef.current) {
                console.log(
                    "[Zoom] Already joined a session. Ignoring duplicate join."
                );

                return;
            }

            try {
                isJoiningRef.current = true;

                setError(null);

                console.log(
                    "[Zoom] Starting join..."
                );

                setupListeners();

                await zoom.joinSession({
                    sessionName,
                    token,
                    userName,
                    sessionPassword,

                    sessionIdleTimeoutMins: 15,

                    audioOptions: {
                        connect: true,
                        mute: false,
                        autoAdjustSpeakerVolume: false,
                    },

                    videoOptions: {
                        localVideoOn: false,
                    },
                });

                hasJoinedRef.current = true;

                console.log(
                    "[Zoom] joinSession() request completed"
                );
            } catch (error) {
                console.error(
                    "[Zoom] Join error:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : String(error)
                );

                throw error;
            } finally {
                isJoiningRef.current = false;
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
                    return;
                }

                const muted =
                    currentUser.audioStatus.isMuted();

                if (muted) {
                    await zoom.audioHelper
                        .unmuteAudio(
                            currentUser.userId,
                        );

                    setIsMuted(false);
                } else {
                    await zoom.audioHelper
                        .muteAudio(
                            currentUser.userId,
                        );

                    setIsMuted(true);
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
                if (isVideoOn) {
                    await zoom.videoHelper
                        .stopVideo();

                    setIsVideoOn(false);

                    console.log(
                        "[Zoom] Video stopped",
                    );
                } else {
                    await zoom.videoHelper
                        .startVideo();

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
                await zoom.videoHelper
                    .switchCamera();

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