import React, {useState} from 'react';
import {StyleSheet, View, ImageProps, Animated, ImageStyle} from 'react-native';
import FastImage from 'react-native-fast-image';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '../../assets/colors/colors';
import images from '../../assets/images';
import { useNetwork } from '../../contexts/NetworkContext';


interface ProgressiveImageProps extends ImageProps {
  source: ImageProps['source'];
  style?: ImageStyle;
  resizeMode?: ImageProps['resizeMode'];
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  source,
  style = {},
  resizeMode,
  ...props
}) => {
  const [highResImageLoaded, setHighResImageLoaded] = useState(false);
  const {isConnected} = useNetwork();
  const [opacity] = useState(new Animated.Value(0));

  // Skeleton animation setup
  const [skeletonAnimation] = useState(new Animated.Value(0));
  Animated.loop(
    Animated.sequence([
      Animated.timing(skeletonAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(skeletonAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]),
  ).start();

  const onLoadHighResImage = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setHighResImageLoaded(true);
    });
  };

  return (
    <View style={style}>
      {!highResImageLoaded && (
        <SkeletonPlaceholder
          borderRadius={style.borderRadius}
          speed={2000}
          backgroundColor={colors.skeleton}>
          <SkeletonPlaceholder.Item style={style}>
            <View style={{width: '100%', height: '100%'}} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      )}
      <Animated.Image
        source={isConnected ? source : images.News}
        style={[
          styles.imageOverlay,
          {
            ...style,
            opacity,
          },
        ]}
        resizeMode={resizeMode || FastImage.resizeMode.cover}
        onLoad={onLoadHighResImage}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default ProgressiveImage;
