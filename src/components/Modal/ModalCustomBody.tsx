import React from 'react';
import {
  View,
  Modal as ModalRN,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';

type Props = {
  onRequestClose?: () => void;
  onConfirm?: () => void;
  visible: boolean;
  width?: string | number;
  desc?: string;
  textCancel?: string;
  textConfirm?: string;
  onlyCancel?: boolean;
  children?: React.ReactNode;
  disableConfirm?: boolean;
};

export default function ModalCustomBody({
  visible,
  onRequestClose,
  onConfirm,
  width,
  textCancel = 'ยกเลิก',
  textConfirm = 'ยืนยัน',
  onlyCancel = false,
  children,
  disableConfirm,
}: Props): JSX.Element {
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
        <View
          style={[
            styles.modalView,
            { width: width ? width : Dimensions.get('window').width - 64 },
          ]}>
          {children}
          <View
            style={{
              height: 40,
              flexDirection: 'row',
              width: '100%',
              borderTopWidth: 1,
              borderTopColor: colors.border1,
            }}>
            <TouchableOpacity
              onPress={onRequestClose}
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <Text semiBold fontSize={14} fontFamily="NotoSans" center>
                {textCancel}
              </Text>
            </TouchableOpacity>
            {!onlyCancel && (
              <TouchableOpacity
                disabled={disableConfirm}
                onPress={onConfirm}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderLeftWidth: 1,
                  borderLeftColor: colors.border1,
                }}>
                <Text
                  semiBold
                  center
                  fontSize={14}
                  fontFamily="NotoSans"
                  color={disableConfirm ? 'border2' : 'primary'}>
                  {textConfirm}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
