import { launchImageLibrary, Asset } from "react-native-image-picker";

export const pickMultipleImages = async (): Promise<Asset[]> => {
  try {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 5, // max images
      quality: 1,
    });

    if (result.didCancel) {
      return [];
    }

    if (result.errorCode) {
      console.log("IMAGE PICK ERROR:", result.errorMessage);
      return [];
    }

    return result.assets || [];
  } catch (error) {
    console.log("IMAGE PICK ERROR:", error);
    return [];
  }
};