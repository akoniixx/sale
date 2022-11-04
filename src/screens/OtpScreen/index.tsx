import { Image, Dimensions, View } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import images from '../../assets/images';
import Content from '../../components/Content/Content';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function OtpScreen({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  return (
    <Container>
      <Image
        source={images.BGOtpScreen}
        style={{
          width: '100%',
          height: Dimensions.get('screen').height * 0.6,
          position: 'absolute',
        }}
      />

      <Content
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingHorizontal: 16,
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-start',
            marginTop: Dimensions.get('screen').height * 0.3,
          }}>
          <Text color="text1" bold left fontSize={24} fontFamily="NotoSans">
            {t('screens.OtpScreen.otpInput.label')}
          </Text>
          <Text color="text1" bold left fontSize={24} fontFamily="Sarabun">
            {t('screens.OtpScreen.otpInput.label')}
          </Text>
          <Text color="text2" left>
            {t('screens.OtpScreen.otpInput.subLabel')}
          </Text>
        </View>
      </Content>
    </Container>
  );
}
