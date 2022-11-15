import { View } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Button from '../../components/Button/Button';
import Text from '../../components/Text/Text';
import { useAuth } from '../../contexts/AuthContext';
import { navigate } from '../../navigations/RootNavigator';

const ProfileScreen = () => {
  const {
    authContext: { logout },
  } = useAuth();
  const onLogout = async () => {
    try {
      await logout();
      navigate('Auth');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container>
      <Content>
        <View>
          <Text fontFamily="NotoSans" bold center>
            Logout for DevMode
          </Text>
          <Button onPress={() => onLogout()} secondary title="Logout" />
        </View>
      </Content>
    </Container>
  );
};

export default ProfileScreen;
