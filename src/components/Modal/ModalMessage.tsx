import { View, Modal, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Text from '../Text/Text';

interface Props {
  visible?: boolean;
  message?: string;
  onRequestClose?: () => void;
}
export default function ModalMessage({
  visible,
  onRequestClose,
  message = 'ใส่ข้อความ',
}: Props): JSX.Element {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        onRequestClose && onRequestClose();
      }, 2000);
    }
  }, [visible, onRequestClose]);

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onRequestClose}
      animationType="fade">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}>
        <View style={styles.modalView}>
          <Text semiBold fontFamily="NotoSans" color="white">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalView: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#0E0E0E99',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
