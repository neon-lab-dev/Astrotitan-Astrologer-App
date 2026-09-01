import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ZoomView } from '@zoom/react-native-videosdk';

import useZoomCall from '../../../hooks/useZoomCall';

import { useRoute } from '@react-navigation/native';
import {
  // useEndConsultationSessionMutation,
  useLazyJoinConsultationQuery,
  useStartConsultationMutation,
} from '../../../redux/features/consultation/consultationApi';
import WaitingForParticipant from '../../../components/SessionScreenPage/WaitingForParticipant/WaitingForParticipant';
import CallControls from '../../../components/SessionScreenPage/CallControls/CallControls';
import LinearGradient from 'react-native-linear-gradient';
import useCallTimer from '../../../hooks/useCallTimer';
import useCallPermissions from '../../../hooks/useCallPermissions';

interface ConsultationCallRouteParams {
  consultationId: string;
  otherParticipantName: string;
  otherParticipantProfilePicture?: any;
  userRole: 'user' | 'astrologer';
}

const ConsultationCallScreen = ({ navigation }: any) => {
  const route = useRoute<any>();

  const {
    consultationId,
    otherParticipantName,
    otherParticipantProfilePicture,
    userRole = 'astrologer',
  } = route.params as ConsultationCallRouteParams;

  const [getJoinConsultation, { isLoading: isJoinLoading }] =
    useLazyJoinConsultationQuery();

  const [startConsultation, { isLoading: isStarting }] =
    useStartConsultationMutation();

  const [hasStarted, setHasStarted] = useState(false);

  const [joinError, setJoinError] = useState<string | null>(null);

  const { requestPermissions } = useCallPermissions();

  const {
    users,
    mySelf,
    isInSession,
    isMuted,
    isVideoOn,
    remoteVideoStates,
    error,
    joinSession,
    // leaveSession,
    endSession,
    toggleMute,
    toggleVideo,
    switchCamera,
  } = useZoomCall();

  const { formattedTime } = useCallTimer(isInSession);

  const remoteUser = useMemo(() => {
    if (!mySelf) {
      return users[0];
    }

    return users.find(user => user.userId !== mySelf.userId);
  }, [mySelf, users]);

  const isRemoteVideoOn = remoteUser
    ? Boolean(remoteVideoStates[remoteUser.userId])
    : false;

  useEffect(() => {
    let mounted = true;

    const connectToConsultation = async () => {
      console.log('[Consultation] Starting connection...');

      console.log('[Consultation] consultationId:', consultationId);

      try {
        setJoinError(null);

        const permissionsGranted = await requestPermissions();

        console.log('[Consultation] Permissions granted:', permissionsGranted);

        if (!permissionsGranted) {
          throw new Error('Camera and microphone permissions are required.');
        }

        console.log('[Consultation] Requesting Zoom credentials...');

        const result = await getJoinConsultation(consultationId).unwrap();

        console.log('[Consultation] ✅ Join API response:', {
          provider: result?.provider,
          sessionName: result?.sessionName,
          hasToken: Boolean(result?.token),
          userName: result?.userName,
          role: result?.role,
        });

        if (!mounted) {
          return;
        }

        if (!result) {
          throw new Error('Join API returned empty response.');
        }

        if (!result.sessionName) {
          throw new Error('sessionName is missing from join API response.');
        }

        if (!result.token) {
          throw new Error('Zoom token is missing from join API response.');
        }

        if (!result.userName) {
          throw new Error('userName is missing from join API response.');
        }

        console.log('[Consultation] Calling joinSession()...');

        await joinSession({
          sessionName: result.sessionName,
          token: result.token,
          userName: result.userName,
        });

        console.log('[Consultation] joinSession() completed.');
      } catch (err) {
        console.error('[Consultation] ❌ Connection error:', err);

        console.error('[Consultation] Error details:', {
          message: err instanceof Error ? err.message : String(err),

          stack: err instanceof Error ? err.stack : undefined,

          rawError: err,
        });

        if (mounted) {
          setJoinError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    connectToConsultation();

    return () => {
      mounted = false;
    };
  }, [consultationId, getJoinConsultation, joinSession, requestPermissions]);

  useEffect(() => {
    if (!isInSession || userRole !== 'astrologer' || hasStarted) {
      return;
    }

    const start = async () => {
      try {
        await startConsultation(consultationId).unwrap();

        setHasStarted(true);
      } catch (err) {
        console.error('Failed to start consultation:', err);

        Alert.alert(
          'Error',
          err instanceof Error ? err.message : 'Unable to start consultation.',
        );
      }
    };

    start();
  }, [consultationId, hasStarted, isInSession, startConsultation, userRole]);

  useEffect(() => {
    if (error) {
      Alert.alert('Call Error', error);
    }
  }, [error]);

  const handleLeave = async () => {
    try {
      await endSession();
      navigation.goBack();
    } catch (err) {
      console.error('Leave call error:', err);
    }
  };

  const isLoading = isJoinLoading || isStarting;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111111" />

        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Connecting to consultation...</Text>
      </SafeAreaView>
    );
  }

  if (joinError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>Unable to Join</Text>

        <Text style={styles.errorText}>{joinError}</Text>

        <Text style={styles.backText} onPress={() => navigation.goBack()}>
          Go Back
        </Text>
      </SafeAreaView>
    );
  }

  if (!isInSession) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Joining consultation...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <LinearGradient
        colors={['rgba(212, 175, 55, 0.15)', 'transparent']}
        start={{
          x: 0.5,
          y: 0.5,
        }}
        end={{
          x: 0.5,
          y: 1,
        }}
        style={styles.glowEffect}
      />

      <View style={styles.videoContainer}>
        {!remoteUser ? (
          <WaitingForParticipant participantName={otherParticipantName} />
        ) : isRemoteVideoOn ? (
          <ZoomView
            userId={remoteUser.userId}
            fullScreen
            style={styles.remoteVideo}
          />
        ) : (
          <View style={styles.profileContainer}>
            <View style={styles.profileCircleWrapper}>
              {otherParticipantProfilePicture ? (
                <Image
                  source={{
                    uri: otherParticipantProfilePicture,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholderCircle}>
                  <Text style={styles.placeholderText}>
                    {otherParticipantName?.charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.profileName}>{otherParticipantName}</Text>
          </View>
        )}
      </View>

      {mySelf && isVideoOn && (
        <View style={styles.selfVideo}>
          <ZoomView userId={mySelf.userId} style={styles.selfVideoView} />
        </View>
      )}

      <View style={styles.topBar}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{formattedTime}</Text>
        </View>

        <View style={styles.statusBadge}>
          <View style={styles.liveDot} />

          <Text style={styles.statusText}>
            {remoteUser ? 'Live' : 'Waiting'}
          </Text>
        </View>
      </View>

      <CallControls
        isMuted={isMuted}
        isVideoOn={isVideoOn}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onSwitchCamera={switchCamera}
        onLeave={handleLeave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  glowEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
  },

  videoContainer: {
    flex: 1,
    backgroundColor: '#111111',
  },

  remoteVideo: {
    flex: 1,
  },

  selfVideo: {
    position: 'absolute',
    top: 80,
    right: 16,
    width: 110,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#222222',
  },

  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCircleWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  placeholderCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 70,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },

  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  selfVideoView: {
    width: '100%',
    height: '100%',
  },

  topBar: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 18,
    textAlign: 'center',
  },

  errorTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },

  errorText: {
    color: '#AAAAAA',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
  },

  backText: {
    color: '#FFFFFF',
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConsultationCallScreen;
