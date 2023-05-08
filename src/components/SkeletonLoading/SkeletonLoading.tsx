import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const SkeletonLoading = ({ style }: { style?: ViewStyle }) => {
  const animation = useSharedValue(0);

  React.useEffect(() => {
    animation.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.gradient, animatedStyle]}>
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.2)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6E6E6',
    borderRadius: 4,
    overflow: 'hidden',
    minHeight: 16,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default SkeletonLoading;
