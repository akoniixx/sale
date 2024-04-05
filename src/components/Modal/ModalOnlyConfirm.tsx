import React from 'react';
import {
  View,
  Modal as ModalRN,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';

type Props = {
  onRequestClose?: () => void;
  onConfirm?: () => void;
  visible: boolean;
  width?: string | number;
  title: string;
  titleCenter?: boolean;
  desc?: string;
  minHeight?: number;
  textCancel?: string;
  textConfirm?: string;
  onlyCancel?: boolean;
};

export default function ModalOnlyConfirm({
  visible,
  onRequestClose,
  onConfirm,
  width,
  title,
  desc,
  titleCenter,
  textCancel = 'ยกเลิก',
  textConfirm = 'ยืนยัน',

  minHeight = 100,
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
        <View style={[styles.modalView, { width }]}>
          <View
            style={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              minHeight,
            }}>
            <Text semiBold lineHeight={30} center={!titleCenter}>
              {title}
            </Text>
            {desc && (
              <Text
                fontSize={14}
                fontFamily="Sarabun"
                color="text3"
                lineHeight={26}
                style={{
                  width: 250,
                }}>
                {desc}
              </Text>
            )}
          </View>
          <View
            style={{
              height: 40,
              flexDirection: 'row',
              width: '100%',
              borderTopWidth: 1,
              borderTopColor: colors.border1,
            }}>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                justifyContent: 'center',

                borderLeftColor: colors.border1,
              }}>
              <Text
                semiBold
                center
                fontSize={14}
                fontFamily="NotoSans"
                color="primary">
                {textConfirm}
              </Text>
            </TouchableOpacity>
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
