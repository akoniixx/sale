import React from 'react';
import {
  View,
  Modal as ModalRN,
  StyleSheet,
  //   Image,
  TouchableOpacity,
} from 'react-native';
import Text from '../Text/Text';

type Props = {
  onRequestClose?: () => void;
  visible: boolean;
  children: React.ReactNode;
  width?: string;
  hideClose?: boolean;
};

export default function Modal({
  visible,
  onRequestClose,
  children,
  width = '90%',
  hideClose = false,
}: Props) {
  return (
    <ModalRN
      animationType="fade"
      onRequestClose={onRequestClose}
      visible={visible}
      transparent>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}>
        <View style={[styles.modalView, { width }]}>
          <>
            {!hideClose && (
              <TouchableOpacity
                style={{ position: 'absolute', right: 12, top: 8 }}
                onPress={onRequestClose}>
                <Text>Close</Text>
              </TouchableOpacity>
            )}
            {children}
          </>
        </View>
      </View>
    </ModalRN>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 24,

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  close: {
    width: 24,
    height: 24,
  },
});
