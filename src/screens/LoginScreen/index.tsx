import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import React from 'react';
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
import Button from '../../components/Button/Button';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function LoginScreen({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
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
      const { data } = await AuthServices.requestOtp(v.tel);
      navigation.navigate('OtpScreen', {
        token: data.result.token,
        refCode: data.result.refCode,
        tel: v.tel,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
            <InputTel name="tel" />
          </Content>

          <SubmitButton
            onSubmit={onSubmit}
            radius={0}
            style={{
              height: Platform.OS === 'ios' ? 52 : 56,
              paddingVertical: 16,
            }}
            title="ขอรหัส OTP"
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
