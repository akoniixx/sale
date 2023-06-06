import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Pressable,
  Dimensions,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';

interface Props {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  style?: ViewStyle;
  onSearch: (value: string | undefined) => void;
}
export default function SearchInput({
  value,
  onChange,
  placeholder,
  style,
  onSearch,
}: Props): JSX.Element {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const ref = React.useRef<TextInput>(null);

  return (
    <Pressable
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: isFocused ? colors.text1 : colors.border1,

        borderRadius: 6,

        paddingHorizontal: 16,
        ...style,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={icons.search}
          style={{
            width: 24,
            height: 24,
          }}
        />
        <TextInput
          ref={ref}
          style={{
            paddingLeft: 16,
            fontFamily: 'NotoSansThai-Regular',
            fontSize: 16,
            paddingTop: 10,
            paddingBottom: 8,
            overflow: 'hidden',
            width: Dimensions.get('screen').width - 120,
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            onSearch(value);
          }}
          returnKeyType="search"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            onSearch(value);
          }}
          onChangeText={value => onChange(value)}
          value={value}
          placeholder={placeholder}
          allowFontScaling={false}
          placeholderTextColor={colors.text3}
        />
      </View>
      {value && value?.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChange(undefined);
            onSearch(undefined);
          }}>
          <Image
            source={icons.close}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableOpacity>
      )}
    </Pressable>
  );
}
