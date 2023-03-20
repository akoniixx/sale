import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Animated, Pressable } from 'react-native';
import { colors } from '../../assets/colors/colors';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeThumbColor?: string;
  activeTrackColor?: string;
  inActiveThumbColor?: string;
  inActiveTrackColor?: string;
  thumbSize?: number;
  trackSize?: number;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  activeThumbColor = '#fff',
  activeTrackColor = colors.current,
  inActiveThumbColor = '#fff',
  inActiveTrackColor = '#dcdcdc',
  thumbSize = 30,
  trackSize = 34,
}) => {
  const [thumbTranslate] = useState(new Animated.Value(value ? thumbSize : 0));
  const [trackBackgroundColor, setTrackBackgroundColor] = useState(
    value ? activeTrackColor : inActiveTrackColor,
  );
  const [thumbBackgroundColor, setThumbBackgroundColor] = useState(
    value ? activeThumbColor : inActiveThumbColor,
  );

  const handleOnSwitchPress = useCallback(() => {
    const toValue = value ? 0 : thumbSize;
    const newThumbBackgroundColor = value
      ? inActiveThumbColor
      : activeThumbColor;
    const newTrackBackgroundColor = value
      ? inActiveTrackColor
      : activeTrackColor;

    Animated.spring(thumbTranslate, {
      toValue,
      useNativeDriver: false,
    }).start();
    setThumbBackgroundColor(newThumbBackgroundColor);
    setTrackBackgroundColor(newTrackBackgroundColor);
    onValueChange(!value);
  }, [
    value,
    onValueChange,
    thumbTranslate,
    thumbSize,
    activeThumbColor,
    inActiveThumbColor,
    activeTrackColor,
    inActiveTrackColor,
  ]);

  return (
    <Pressable
      onPress={handleOnSwitchPress}
      style={{
        width: 2 * trackSize,
      }}>
      <View
        style={[
          styles.track,
          { backgroundColor: trackBackgroundColor, height: trackSize },
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbBackgroundColor,
              height: thumbSize,
              width: thumbSize,
              transform: [{ translateX: thumbTranslate }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 8,
  },
  thumb: {
    borderRadius: 20,
    borderColor: colors.border1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default Switch;
