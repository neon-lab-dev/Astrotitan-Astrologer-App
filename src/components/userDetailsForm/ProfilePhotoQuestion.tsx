import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

import UserIcon from '@/assets/icons/visual/user-circle.svg';
import {SansText} from '../reusable/Text/SansText';

type ProfilePhotoQuestionProps = {
  value: any;
  setValue: (value: any) => void;
};

const ProfilePhotoQuestion = ({
  value,
  setValue,
}: ProfilePhotoQuestionProps) => {
  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
        selectionLimit: 1,
      });

      if (
        result.assets &&
        result.assets.length > 0
      ) {
        const selectedImage = result.assets[0];

        // Keep the COMPLETE asset object.
        // Do not store only selectedImage.uri.
        setValue(selectedImage);
      }
    } catch (error) {
      console.log(
        'PROFILE IMAGE PICK ERROR:',
        error,
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* PROFILE IMAGE */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={pickImage}
        style={styles.imageWrapper}
      >
        <Image
          source={
            value?.uri
              ? {
                  uri: value.uri,
                }
              : require(
                  '@/assets/images/dummy/experts/expert1.png',
                )
          }
          style={styles.image}
        />

        {/* SMALL ACTION ICON */}

        <View style={styles.cameraButton}>
          <UserIcon
            width={18}
            height={18}
          />
        </View>
      </TouchableOpacity>

      {/* UPLOAD */}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={pickImage}
      >
        <SansText style={styles.uploadText}>
          {value?.uri
            ? 'Change photo'
            : 'Upload photo'}
        </SansText>
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePhotoQuestion;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 14,
    marginTop: 24,
  },

  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#E9E9E9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  cameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FBF7EB',
    padding: 8,
    borderRadius: 999,
  },

  uploadText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});