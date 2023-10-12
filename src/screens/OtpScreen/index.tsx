import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import images from '../../assets/images';
import Content from '../../components/Content/Content';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import OtpInput from '../../components/OtpInput/OtpInput';
import { AuthServices } from '../../services/AuthServices';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigations/AuthNavigator';
import { navigate } from '../../navigations/RootNavigator';
import crashlytics from '@react-native-firebase/crashlytics';

export default function OtpScreen({
  route,
}: StackScreenProps<AuthStackParamList, 'OtpScreen'>): JSX.Element {
  const { t } = useLocalization();
  const params = route.params;
  const [otpTimeOut, setOtpTimeOut] = useState(120);
  const [time, setTime] = useState('02:00');
  const [isError, setIsError] = useState(false);
  const [paramsData, setParamsData] = useState({
    token: '',
    refCode: '',
    tel: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const {
    authContext: { login },
  } = useAuth();
  useEffect(() => {
    if (params) {
      setParamsData(params);
    }
  }, [params]);
  const onResendOtp = async () => {
    try {
      const { data } = await AuthServices.requestOtp(params.tel);
      setOtpTimeOut(120);
      setTime('02:00');
      setParamsData(prev => ({
        ...prev,
        token: data.result.token,
        refCode: data.result.refCode,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const onCodeChange = async (code: string) => {
    setIsError(false);
    if (code.length === 6) {
      setIsLoading(true);
      const payload = {
        token: paramsData.token,
        otpCode: code,
        refCode: paramsData.refCode,
        telephoneNo: paramsData.tel,
      };

      try {
        const res = await login(payload);

        if (res.accessToken) {
          navigate('Main');
        }
      } catch (e:any) {
       crashlytics().setAttribute('tel',paramsData.tel)
      crashlytics().recordError(e)
        setIsError(true);
      } finally {
        setIsLoading(false);
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
  const censorTelSixLength = (tel: string) => {
    return tel.replace(/.(?=.{4})/g, 'X');
  };
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
            {t('screens.OtpScreen.otpInput.subLabel', {
              tel: censorTelSixLength(paramsData.tel),
            })}
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
            marginTop: Platform.OS === 'ios' ? 24 : 56,
            width: '100%',
            alignItems: 'center',
          }}>
          {isError ? (
            <Text
              color="error"
              center>{`รหัส OTP ไม่ถูกต้อง ลองใหม่อีกครั้ง`}</Text>
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
                marginTop: 8,
              }}>
              <Text color="text3">
                {t('screens.OtpScreen.timer.otpNotSend')}
              </Text>
              <TouchableOpacity onPress={onResendOtp}>
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
      <LoadingSpinner visible={isLoading} />
    </Container>
  );
}
