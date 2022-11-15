import React from 'react';
import { View, Image } from 'react-native';
import Text from '../components/Text/Text';

const toastStyle = {
  backgroundColor: '#3EBD93',
  borderRadius: 16,
  width: '90%',
  height: 90,
};

export const toastConfig = {
  addCart: ({ text1, text2, props }: any) => (
    <View
      style={{
        ...toastStyle,
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: '90%',
          paddingLeft: 6,
          justifyContent: 'center',
        }}>
        <Text>{text1}</Text>
      </View>
    </View>
  ),
};
