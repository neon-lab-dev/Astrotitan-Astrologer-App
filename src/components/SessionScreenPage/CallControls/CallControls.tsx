import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICONS } from '../../../assets/svg';

interface CallControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onSwitchCamera: () => void;
  onLeave: () => void;
  onEnd: () => void;
  isAstrologer: boolean;
}

const CallControls = ({
  isMuted,
  isVideoOn,
  onToggleMute,
  onToggleVideo,
  onSwitchCamera,
  onLeave,
  onEnd,
  isAstrologer,
}: CallControlsProps) => {
  const PhoneDownIcon = ICONS.PhoneDown;
  const MuteWhite = ICONS.MuteWhite;
  const MuteRed = ICONS.MuteRed;
  const VideoCallRed = ICONS.VideoCallRed;
  const VideoCallWhite = ICONS.VideoCallWhite;

  return (
    <View style={styles.container}>
      {/* Mute Button - White bg + red icon when muted */}
      <TouchableOpacity
        style={[styles.control, isMuted && styles.activeButton]}
        onPress={onToggleMute}
      >
        {isMuted ? (
          <MuteRed width={24} height={24} />
        ) : (
          <MuteWhite width={24} height={24} />
        )}
      </TouchableOpacity>
      {/* End/Leave Button */}
      <TouchableOpacity
        style={[styles.control, styles.endButton]}
        onPress={isAstrologer ? onEnd : onLeave}
      >
        <PhoneDownIcon width={30} height={30} />
      </TouchableOpacity>
      {/* Video Button - White bg + red icon when video is off */}
      <TouchableOpacity
        style={[styles.control, !isVideoOn && styles.activeButton]}
        onPress={onToggleVideo}
      >
        {isVideoOn ? (
          <VideoCallWhite width={24} height={24} />
        ) : (
          <VideoCallRed width={24} height={24} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  control: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(30, 30, 40, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  endButton: {
    backgroundColor: '#D92D20',
  },
});

export default CallControls;
