import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
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
  useEndConsultationSessionMutation,
  useLazyJoinConsultationQuery,
  useStartConsultationMutation,
} from '../../../redux/features/consultation/consultationApi';
import WaitingForParticipant from '../../../components/SessionScreenPage/WaitingForParticipant/WaitingForParticipant';
import CallControls from '../../../components/SessionScreenPage/CallControls/CallControls';

interface ConsultationCallRouteParams {
  consultationId: string;
  otherParticipantName: string;
  userRole: 'user' | 'astrologer';
}

const ConsultationCallScreen = ({ navigation }: any) => {
  const route = useRoute<any>();

  const {
    consultationId,
    otherParticipantName,
    userRole = 'user',
  } = route.params as ConsultationCallRouteParams;

  const [getJoinConsultation, { isLoading: isJoinLoading }] =
    useLazyJoinConsultationQuery();

  const [startConsultation, { isLoading: isStarting }] =
    useStartConsultationMutation();

  const [endConsultation, { isLoading: isEnding }] =
    useEndConsultationSessionMutation();

  const [hasStarted, setHasStarted] = useState(false);

  const [joinError, setJoinError] = useState<string | null>(null);

  const {
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
  } = useZoomCall();

  const remoteUser = useMemo(() => {
    if (!mySelf) {
      return users[0];
    }

    return users.find(user => user.userId !== mySelf.userId);
  }, [mySelf, users]);

  useEffect(() => {
    let mounted = true;

    const connectToConsultation = async () => {
      console.log('[Consultation] Starting connection...');

      console.log('[Consultation] consultationId:', consultationId);

      try {
        setJoinError(null);

        console.log('[Consultation] Requesting Zoom credentials...');

        const result = await getJoinConsultation(consultationId).unwrap();

        console.log('[Consultation] ✅ Join API response:', result);

        if (!mounted) {
          console.log('[Consultation] Component unmounted after API response');

          return;
        }

        if (!result) {
          throw new Error('Join API returned empty response');
        }

        if (!result.sessionName) {
          throw new Error('sessionName is missing from join API response');
        }

        if (!result.token) {
          throw new Error('Zoom token is missing from join API response');
        }

        if (!result.userName) {
          throw new Error('userName is missing from join API response');
        }

        console.log('[Consultation] Zoom data:', {
          sessionName: result.sessionName,
          hasToken: Boolean(result.token),
          hasPassword: Boolean(result.sessionPassword),
          userName: result.userName,
          role: result.role,
        });

        console.log('[Consultation] Calling joinSession()...');

        await joinSession({
          sessionName: result.sessionName,
          token: result.token,
          userName: result.userName,
        });

        console.log('[Consultation] joinSession() completed');
      } catch (err) {
        console.error('[Consultation] ❌ Connection errorss:', err);

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
  }, [consultationId, getJoinConsultation, joinSession]);

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
      await leaveSession();
      navigation.goBack();
    } catch (err) {
      console.error('Leave call error:', err);
    }
  };

  const handleEnd = () => {
    Alert.alert(
      'End Consultation',
      'Are you sure you want to end this consultation?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End',
          style: 'destructive',
          onPress: async () => {
            try {
              await endConsultation(consultationId).unwrap();

              await endSession();

              navigation.goBack();
            } catch (err) {
              console.error('End consultation error:', err);

              Alert.alert(
                'Error',
                err instanceof Error
                  ? err.message
                  : 'Unable to end consultation.',
              );
            }
          },
        },
      ],
    );
  };

  const isLoading = isJoinLoading || isStarting || isEnding;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111111" />

        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          {isEnding
            ? 'Ending consultation...'
            : 'Connecting to consultation...'}
        </Text>
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

      <View style={styles.videoContainer}>
        {remoteUser ? (
          <ZoomView
            userId={remoteUser.userId}
            fullScreen
            style={styles.remoteVideo}
          />
        ) : (
          <WaitingForParticipant participantName={otherParticipantName} />
        )}
      </View>

      {mySelf && (
        <View style={styles.selfVideo}>
          <ZoomView userId={mySelf.userId} style={styles.selfVideoView} />
        </View>
      )}

      <View style={styles.topBar}>
        <Text style={styles.title}>Astrology Consultation</Text>

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
        onEnd={handleEnd}
        isAstrologer={userRole === 'astrologer'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
