import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Text from '../../components/Text/Text';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import images from '../../assets/images';
import { Form } from '../../components/Form/Form';
import * as yup from 'yup';
import InputTel from '../../components/Form/InputTel';
import { SubmitButton } from '../../components/Form/SubmitButton';
import { useLocalization } from '../../contexts/LocalizationContext';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { AuthServices } from '../../services/AuthServices';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function LoginScreen({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const [errorCode, setErrorCode] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const errorConvert = (code: number | undefined) => {
    switch (code) {
      case 400:
        return t('screens.LoginScreen.telInput.notFound');
      case 404:
        return t('screens.LoginScreen.telInput.notFound');
      case 500:
        return t('screens.LoginScreen.telInput.somethingWrong');
    }
  };
  const schema = yup.object().shape({
    tel: yup
      .string()
      .required(t('screens.LoginScreen.telInput.required'))
      .matches(/^[0-9]+$/, t('screens.LoginScreen.telInput.invalid'))
      .min(10, t('screens.LoginScreen.telInput.invalid'))
      .max(10, t('screens.LoginScreen.telInput.invalid')),
  });

  const onSubmit = async (v: { tel: string }) => {
    try {
      setLoading(true)
      const { data } = await AuthServices.requestOtp(v.tel);

      navigation.navigate('OtpScreen', {
        token: data.result.token,
        refCode: data.result.refCode,
        tel: v.tel,
      });
    } catch (e: any) {
      if (e?.response?.data?.statusCode) {
        setErrorCode(e.response.data.statusCode);
      }
    }
    finally{
      setLoading(false)
    }
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
      <Form
        schema={schema}
        style={{}}
        defaultValues={{
          tel: '',
        }}>
        <KeyboardAvoidingView
          style={{ flex: 1, width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                marginBottom: 24,
              }}>
              <Text color="text2" left>
                {t('screens.LoginScreen.telInput.label')}
              </Text>
            </View>
            <InputTel name="tel" errorManual={errorConvert(errorCode)} />
          </Content>

          <SubmitButton
            onSubmit={onSubmit}
            radius={0}
            style={{
              width: '100%',
              height: Platform.OS === 'ios' ? 52 : 56,
              paddingVertical: 16,
            }}
            title="ขอรหัส OTP"
          />
        </KeyboardAvoidingView>
      </Form>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}
