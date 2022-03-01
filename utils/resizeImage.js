import * as ImageManipulator from 'expo-image-manipulator';

const defaultOptions = {
  maxSize: 1024,
  compress: 1,
  outputFormat: 'JPEG',
};

const resizeImage = async (image, options = defaultOptions) => {
  try {
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      console.log('resizeImage ERROR', 'Invalid image.');

      return null;
    }

    const { uri, width, height } = image;
    const { maxSize, compress, outputFormat } = {
      ...defaultOptions,
      ...options,
    };

    if (
      typeof uri !== 'string' ||
      !uri?.length ||
      typeof width !== 'number' ||
      typeof height !== 'number'
    ) {
      console.log('resizeImage ERROR', 'Invalid image.');

      return null;
    }

    if (!['JPEG', 'PNG'].includes(outputFormat)) {
      console.log('resizeImage ERROR', 'outputFormat should be JPEG or PNG.');

      return null;
    }

    const largestDimension = width > height ? 'width' : 'height';

    if (image[largestDimension] <= maxSize) return image;

    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            [largestDimension]: maxSize,
          },
        },
      ],

      {
        compress,
        format: ImageManipulator.SaveFormat[outputFormat],
      },
    );

    if (resizedImage) return { ...image, ...resizedImage };

    return null;
  } catch (error) {
    console.log('resizeImage ERROR', error);

    return null;
  }
};

export default resizeImage;
