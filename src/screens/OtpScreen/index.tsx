import { Image, Dimensions, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import images from '../../assets/images';
import Content from '../../components/Content/Content';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OtpInput from '../../components/OtpInput/OtpInput';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function OtpScreen({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  // const [otpCalling, setOtpCalling] = useState(false);
  const [otpTimeOut, setOtpTimeOut] = useState(120);
  const [time, setTime] = useState('02:00');
  const [isError, setIsError] = useState(false);

  const onCodeChange = (code: string) => {
    setIsError(false);
    if (code.length === 6) {
      if (code === '123456') {
        navigation.navigate('WelcomeScreen');
      } else {
        setIsError(true);
      }
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (otpTimeOut === 0) {
        return null;
      } else {
        const second = otpTimeOut - 1;
        setOtpTimeOut(second);
        setTime(
          `0${parseInt((second / 60).toString())}:${
            second % 60 < 10 ? '0' + (second % 60) : second % 60
          }`,
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  });
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

          <Text color="text2" left>
            {t('screens.OtpScreen.otpInput.subLabel')}
          </Text>
        </View>
        <View
          style={{
            marginTop: 24,
          }}>
          <OtpInput isError={isError} onCodeChange={onCodeChange} />
        </View>
        <View
          style={{
            marginTop: 56,
            width: '100%',
            alignItems: 'center',
          }}>
          {isError ? (
            <Text color="error">รหัส OTP ไม่ถูกต้อง ลองใหม่อีกครั้ง</Text>
          ) : (
            <View
              style={{
                height: 24,
              }}
            />
          )}
          {otpTimeOut === 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text color="text3">
                {t('screens.OtpScreen.timer.otpNotSend')}
              </Text>
              <TouchableOpacity>
                <Text
                  color="primary"
                  fontFamily="NotoSans"
                  fontSize={14}
                  semiBold
                  style={{
                    marginLeft: 4,
                    textDecorationLine: 'underline',
                  }}>
                  {t('screens.OtpScreen.timer.resend')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text color="text3">
              {t('screens.OtpScreen.timer.label', {
                time,
              })}
            </Text>
          )}
        </View>
      </Content>
      <LoadingSpinner />
    </Container>
  );
}
