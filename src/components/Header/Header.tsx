import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { useNavigation } from '@react-navigation/native';
import images from '../../assets/images';
import icons from '../../assets/icons';

interface Props {
  title?: string;
  componentLeft?: React.ReactNode;
  componentRight?: React.ReactNode;
  style?: ViewStyle;
  titleColor?:
    | 'primary'
    | 'secondary'
    | 'white'
    | 'text1'
    | 'text2'
    | 'text3'
    | 'current'
    | 'error'
    | 'specialRequest'
    | 'waiting'
    | 'border2';
}
export default function Header({
  title,
  componentLeft,
  componentRight,
  titleColor = 'text1',
  style,
}: Props) {
  const navigation = useNavigation();
  return (
    <View style={[styled.container, style]}>
      {componentLeft ? (
        componentLeft
      ) : (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.backIcon}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableOpacity>
      )}
      <Text fontFamily="NotoSans" bold fontSize={20} color={titleColor}>
        {title}
      </Text>
      {componentRight ? (
        componentRight
      ) : (
        <View
          style={{
            width: 24,
          }}
        />
      )}
    </View>
  );
}
const styled = StyleSheet.create({
  container: {
    minHeight: 60,
    padding: 16,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
