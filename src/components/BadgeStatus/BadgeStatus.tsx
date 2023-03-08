import { View } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import {
  statusHistory,
  statusHistoryBGColor,
  statusHistoryColor,
} from '../../utils/mappingObj';
interface Props {
  status: string;
}

export default function BadgeStatus({ status }: Props) {
  const color: any =
    statusHistoryColor[status as keyof typeof statusHistoryColor];
  const title = statusHistory[status as keyof typeof statusHistory];

  return (
    <View
      style={{
        backgroundColor:
          statusHistoryBGColor[status as keyof typeof statusHistoryBGColor],
        borderRadius: 12,
        height: 30,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
      }}>
      <Text color={color} fontSize={14} semiBold fontFamily="NotoSans">
        {title}
      </Text>
    </View>
  );
}