import { View } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import { numberWithCommas } from '../../utils/functions';

interface Props {
  data: { label: string; valueLabel: string; value: string }[];
}
export default function ListCollapse({ data }: Props): JSX.Element {
  return (
    <View>
      {data.map((el, index) => {
        return (
          <View
            key={index}
            style={{
              minHeight: 50,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.background1,
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}>
            <Text
              color="text3"
              style={{
                flex: 0.8,
              }}
              numberOfLines={1}>{`${el.label} ${el.valueLabel}`}</Text>
            <Text
              right
              color="text3"
              style={{
                flex: 0.2,
              }}>
              {`-${numberWithCommas(el.value, true)}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
