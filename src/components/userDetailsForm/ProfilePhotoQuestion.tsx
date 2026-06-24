import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SansText } from "../reusable/Text/SansText";

const ProfilePhotoQuestion = ({ value, setValue }: any) => {
  const [image, setImage] = useState(value || null);

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.7,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          "Error",
          result.errorMessage || "Failed to pick image"
        );
        return;
      }

      const uri = result.assets?.[0]?.uri;

      if (uri) {
        setImage(uri);
        setValue(uri);
      }
    } catch (error) {
      console.log("IMAGE PICK ERROR:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={pickImage}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <SansText style={styles.placeholder}>
            Tap to add photo
          </SansText>
        )}
      </TouchableOpacity>

      {image && (
        <TouchableOpacity onPress={pickImage}>
          <SansText style={styles.changeText}>
            Change photo
          </SansText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfilePhotoQuestion;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: "center",
    gap: 20,
  },

  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    color: "#777",
  },

  changeText: {
    textDecorationLine: "underline",
  },
});