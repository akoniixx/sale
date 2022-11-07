import React, { useEffect } from 'react';
import Text from '../../components/Text/Text';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import images from '../../assets/images';
import { useLocalization } from '../../contexts/LocalizationContext';
import { navigate } from '../../navigations/RootNavigator';

const LoginSuccessScreen = (): JSX.Element => {
  const { t } = useLocalization();
  useEffect(() => {
    setTimeout(() => {
      navigate('Main');
    }, 2000);
  }, []);

  return (
    <Container>
      <Content>
        <TouchableOpacity
          onPress={() => {
            navigate('Main');
          }}
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: Dimensions.get('window').width - 16,
            marginTop: 60,
          }}>
          <View
            style={{
              marginTop: 16,
            }}>
            <Text fontFamily="NotoSans" bold fontSize={24} center>
              {t('screens.LoginSuccessScreen.title')}
            </Text>
          </View>
          <Image
            style={styled.image}
            source={images.LoginSuccess}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </Content>
    </Container>
  );
};

const styled = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  },
});
export default LoginSuccessScreen;
