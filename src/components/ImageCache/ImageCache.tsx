import React from 'react';
import FastImage from 'react-native-fast-image';

export default function ImageCache({
  uri,
  style,
  resizeMode,
}: {
  uri: string;
  style?: any;
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
