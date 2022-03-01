/* eslint-disable react/jsx-key */
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';

/**
 * Options doc:
 * - https://docs.expo.io/versions/latest/sdk/imagepicker/#imagepickerlaunchimagelibraryasyncoptions
 * - https://docs.expo.io/versions/latest/sdk/imagepicker/#imagepickerlaunchcameraasyncoptions
 */
const defaultOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  base64: false,
  allowsEditing: false,
  quality: 1,
};

const useCamera = (options = {}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  /**
   * @param {boolean} [isImageLibrary=false]
   * @returns {Promise<boolean>}
   */
  const askPermissionsAsync = async (isImageLibrary = false) => {
    if (isImageLibrary) {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        return (
          (await ImagePicker.requestMediaLibraryPermissionsAsync()).status ===
          'granted'
        );
      }
    } else {
      const { status } = await ImagePicker.getCameraPermissionsAsync();

      if (status !== 'granted') {
        return (
          (await ImagePicker.requestCameraPermissionsAsync()).status ===
          'granted'
        );
      }
    }

    return true;
  };

  /**
   * First ask permission to use device camera or gallery.
   * If it succeeds route user to camera/gallery
   * otherwise or any other failure it returns null
   *
   * @param {0|1} isImageLibrary - Open camera: 0 or gallery: 1
   */
  const pickImage = async (isImageLibrary) => {
    const granted = await askPermissionsAsync();
    /* Return null if user denies access to camera or gallery */
    if (!granted) return null;

    // eslint-disable-next-line no-unused-vars
    const { disableGallery, ...rest } = options;
    const customOptions = { ...defaultOptions, ...rest };

    let result;

    try {
      if (isImageLibrary) {
        result = await ImagePicker.launchImageLibraryAsync(customOptions);
      } else {
        result = await ImagePicker.launchCameraAsync(customOptions);
      }
    } catch (ex) {
      console.log('useCamera ERROR:', ex);
      return null;
    }

    if (result.cancelled) return null;

    return result;
  };

  /**
   * @returns {Promise<import('expo-image-picker/build/ImagePicker.types').ImageInfo | null>} image object or null on fail
   */
  const onOpenActionSheet = () =>
    new Promise((res) => {
      let sheetOptions = ['Câmera', 'Cancelar'];
      let icons = [<Ionicons name="md-camera" size={28} />];
      const cancelButtonIndex = 2;

      if (!options.disableGallery) {
        sheetOptions = ['Câmera', 'Galeria', 'Cancelar'];
        icons = [
          <Ionicons name="md-camera-outline" size={24} />,
          <Ionicons name="images-outline" size={24} />,
        ];
      }

      showActionSheetWithOptions(
        { options: sheetOptions, icons, cancelButtonIndex },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0: // CAMERA
              return res(pickImage(0));
            case 1: // GALLERY
              if (!options.disableGallery) return res(pickImage(1));
              return res(null);
            default:
              return res(null);
          }
        },
      );
    });

  return onOpenActionSheet;
};

export default useCamera;
