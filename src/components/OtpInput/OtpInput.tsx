import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import React from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  RenderCellOptions,
} from 'react-native-confirmation-code-field';
import Text from '../Text/Text';
import { colors } from '../../assets/colors/colors';

interface Props {
  CELL_COUNT?: number;
  isError?: boolean;

  onCodeChange?: (code: string) => void;
}
const OtpInput = ({ CELL_COUNT = 6, isError = false, onCodeChange }: Props) => {
  const [value, setValue] = React.useState('');
  const refCode = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell: React.FC<RenderCellOptions> = ({
    index,
    symbol,
    isFocused,
  }) => {
    return (
      <View
        key={index}
        style={[
          styles({ CELL_COUNT, isError, isFocused: !!isFocused || !!symbol })
            .cell,
        ]}>
        <Text
          key={index}
          bold
          color="text1"
          fontSize={24}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor cursorSymbol="" /> : null)}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <CodeField
        ref={refCode}
        {...props}
        value={value}
        onChangeText={c => {
          onCodeChange && onCodeChange(c);
          setValue(c);
        }}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
    </View>
  );
};

export default OtpInput;

const styles = ({
  CELL_COUNT,
  isError,
  isFocused,
}: {
  CELL_COUNT: number;
  isError: boolean;
  isFocused: boolean;
}) => {
  const width = Dimensions.get('screen').width / CELL_COUNT - 16;
  const height = Platform.OS === 'ios' ? 56 : 48;
  const defaultStyle = {
    width,
    height,
    borderRadius: 8,
    borderWidth: 1,
  };
  return StyleSheet.create({
    cell: {
      ...defaultStyle,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: isError
        ? colors.error
        : isFocused
        ? colors.primary
        : colors.border1,
    },
  });
};
