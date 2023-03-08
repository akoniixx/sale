import React from 'react';
import FastImage, { ImageStyle } from 'react-native-fast-image';

export default function ImageCache({
  uri,
  style,
  resizeMode,
}: {
  uri: string;
  style?: ImageStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}) {
  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.normal,
      }}
      style={style}
      resizeMode={resizeMode ? resizeMode : FastImage.resizeMode.contain}
    />
  );
}
