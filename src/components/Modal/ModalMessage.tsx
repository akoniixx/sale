import { View, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import Text from '../Text/Text';

interface Props {
  visible?: boolean;
  message?: string;
  onRequestClose?: () => void;
  duration?: number;
}
export default function ModalMessage({
  visible,
  onRequestClose,
  message = 'ใส่ข้อความ',
  duration = 200,
}: Props): JSX.Element {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    };

    const fadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    };
    if (visible) {
      fadeIn();
      setTimeout(() => {
        onRequestClose && onRequestClose();
        fadeOut();
      }, 2000);
    }
  }, [visible, onRequestClose, fadeAnim, duration]);
  return (
    <Animated.View
      style={[
        styles.modalView,
        {
          opacity: fadeAnim,
          display: visible ? 'flex' : 'none',
        },
      ]}>
      <Text semiBold fontFamily="NotoSans" color="white">
        {message}
      </Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'space-between',
    backgroundColor: '#0E0E0E99',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    top: '45%',
    left: '25%',
  },
});
