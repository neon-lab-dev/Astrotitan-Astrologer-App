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

    const isJoiningRef =
        useRef(false);

    const hasJoinedRef =
        useRef(false);

    const [users, setUsers] =
        useState<ZoomVideoSdkUser[]>([]);

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

    const [
        remoteVideoStates,
        setRemoteVideoStates,
    ] = useState<Record<string, boolean>>(
        {},
    );

    const [error, setError] =
        useState<string | null>(null);

    const updateRemoteVideoStates =
        useCallback(
            async (
                remoteUsers: ZoomVideoSdkUser[],
            ) => {
                try {
                    const states: Record<
                        string,
                        boolean
                    > = {};

                    for (
                        const user of remoteUsers
                    ) {
                        const videoOn =
                            await user.videoStatus.isOn();

                        states[user.userId] =
                            videoOn;

                        console.log(
                            "[Zoom] Remote video state:",
                            {
                                userId:
                                    user.userId,
                                userName:
                                    user.userName,
                                videoOn,
                            },
                        );
                    }

                    setRemoteVideoStates(
                        states,
                    );
                } catch (error) {
                    console.error(
                        "[Zoom] Failed to update remote video states:",
                        error,
                    );
                }
            },
            [],
        );

    const refreshUsers =
        useCallback(async () => {
            try {
                console.log(
                    "[Zoom] Refreshing users...",
                );

                const currentUser =
                    await zoom.session.getMySelf();

                if (!currentUser) {
                    console.log(
                        "[Zoom] Current user not found.",
                    );

                    setMySelf(null);
                    setUsers([]);
                    setRemoteVideoStates(
                        {},
                    );

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
                        (user:any) =>
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

                await updateRemoteVideoStates(
                    remoteUserObjects,
                );

                const myVideoOn =
                    await currentUserObject.videoStatus.isOn();

                const myMuted =
                    await currentUserObject.audioStatus.isMuted();

                setIsVideoOn(
                    myVideoOn,
                );

                setIsMuted(
                    myMuted,
                );

                console.log(
                    "[Zoom] My video:",
                    myVideoOn,
                );

                console.log(
                    "[Zoom] My muted:",
                    myMuted,
                );
            } catch (error) {
                console.error(
                    "[Zoom] Refresh users error:",
                    error,
                );
            }
        }, [
            updateRemoteVideoStates,
            zoom,
        ]);

    const setupListeners =
        useCallback(() => {
            console.log(
                "[Zoom] Setting up listeners...",
            );

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

                            await zoom.audioHelper.startAudio();

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

                            await zoom.videoHelper.startVideo();

                            setIsVideoOn(
                                true,
                            );

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

                        setRemoteVideoStates(
                            {},
                        );

                        isJoiningRef.current =
                            false;

                        hasJoinedRef.current =
                            false;
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

            const userVideoStatusChanged =
                zoom.addListener(
                    EventType.onUserVideoStatusChanged,
                    async event => {
                        console.log(
                            "[Zoom] 📹 Video status changed:",
                            event,
                        );

                        // Do not trust the event payload
                        // for the video state.
                        // Re-read all remote users.
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

                        setError(
                            JSON.stringify(
                                event,
                            ),
                        );
                    },
                );

            listeners.current = [
                sessionJoin,
                sessionLeave,
                userJoin,
                userLeave,
                userVideoStatusChanged,
                errorListener,
            ];

            console.log(
                "[Zoom] Listeners registered:",
                listeners.current.length,
            );
        }, [
            refreshUsers,
            zoom,
        ]);

    const cleanupListeners =
        useCallback(() => {
            console.log(
                "[Zoom] Cleaning listeners...",
            );

            listeners.current.forEach(
                listener =>
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
                if (
                    isJoiningRef.current
                ) {
                    console.log(
                        "[Zoom] Join already in progress.",
                    );

                    return;
                }

                if (
                    hasJoinedRef.current
                ) {
                    console.log(
                        "[Zoom] Already joined session.",
                    );

                    return;
                }

                isJoiningRef.current =
                    true;

                hasJoinedRef.current =
                    true;

                try {
                    setError(null);

                    setupListeners();

                    console.log(
                        "[Zoom] Calling joinSession...",
                    );

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
                            localVideoOn:
                                false,
                        },
                    });

                    console.log(
                        "[Zoom] joinSession request completed.",
                    );
                } catch (error) {
                    console.error(
                        "[Zoom] Join error:",
                        error,
                    );

                    hasJoinedRef.current =
                        false;

                    setError(
                        error instanceof Error
                            ? error.message
                            : String(error),
                    );

                    throw error;
                } finally {
                    isJoiningRef.current =
                        false;
                }
            },
            [
                setupListeners,
                zoom,
            ],
        );

    const toggleMute =
        useCallback(async () => {
            try {
                const currentUser =
                    await zoom.session.getMySelf();

                if (!currentUser) {
                    return;
                }

                const currentlyMuted =
                    await currentUser.audioStatus.isMuted();

                console.log(
                    "[Zoom] Current muted:",
                    currentlyMuted,
                );

                if (
                    currentlyMuted
                ) {
                    await zoom.audioHelper.unmuteAudio(
                        currentUser.userId,
                    );

                    console.log(
                        "[Zoom] ✅ Unmute requested",
                    );
                } else {
                    await zoom.audioHelper.muteAudio(
                        currentUser.userId,
                    );

                    console.log(
                        "[Zoom] ✅ Mute requested",
                    );
                }

                const updatedUser =
                    await zoom.session.getMySelf();

                if (updatedUser) {
                    const updatedMuted =
                        await updatedUser.audioStatus.isMuted();

                    setIsMuted(
                        updatedMuted,
                    );

                    console.log(
                        "[Zoom] Updated muted:",
                        updatedMuted,
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
                if (isVideoOn) {
                    await zoom.videoHelper.stopVideo();

                    setIsVideoOn(false);

                    console.log(
                        "[Zoom] ✅ Video stopped",
                    );
                } else {
                    await zoom.videoHelper.startVideo();

                    setIsVideoOn(true);

                    console.log(
                        "[Zoom] ✅ Video started",
                    );
                }
            } catch (error) {
                console.error(
                    "[Zoom] Toggle video error:",
                    error,
                );
            }
        }, [
            isVideoOn,
            zoom,
        ]);

    const switchCamera =
        useCallback(async () => {
            try {
                await zoom.videoHelper.switchCamera();

                console.log(
                    "[Zoom] ✅ Camera switched",
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
                isJoiningRef.current =
                    false;

                hasJoinedRef.current =
                    false;

                setIsInSession(false);
                setUsers([]);
                setMySelf(null);
                setRemoteVideoStates(
                    {},
                );

                cleanupListeners();
            }
        }, [
            cleanupListeners,
            zoom,
        ]);

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
                isJoiningRef.current =
                    false;

                hasJoinedRef.current =
                    false;

                setIsInSession(false);
                setUsers([]);
                setMySelf(null);
                setRemoteVideoStates(
                    {},
                );

                cleanupListeners();
            }
        }, [
            cleanupListeners,
            zoom,
        ]);

    useEffect(() => {
        return () => {
            cleanupListeners();
        };
    }, [
        cleanupListeners,
    ]);

    return {
        zoom,
        users,
        mySelf,
        isInSession,
        isMuted,
        isVideoOn,
        remoteVideoStates,
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