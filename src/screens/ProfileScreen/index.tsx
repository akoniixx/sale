import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import Container from '../../components/Container/Container';
import LinearGradient from 'react-native-linear-gradient';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import icons from '../../assets/icons';
import Avatar from '../../components/Avatar/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import ModalWarning from '../../components/Modal/ModalWarning';
import Body from './Body';

import { userServices } from '../../services/UserServices';
import { navigate } from '../../navigations/RootNavigator';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FastImage from 'react-native-fast-image';

interface Props {
  navigation?: any;
}
export default function ProfileScreen({ navigation }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const {
    state: { user },
    authContext: { logout, getUser },
    dispatch,
  } = useAuth();
  useEffect(() => {
    getUser();
  }, [getUser]);
  console.log('user :>> ', user?.userStaffId);
  const onLogout = async () => {
    await logout();
    setModalVisible(false);
    navigate('initPage');
  };

  const onEditProfile = async (value: any) => {
    try {
      setLoading(true);
      const { uri, type, fileName } = value;

      const localFilePath = uri.replace('file://', '');

      const data = new FormData();
      data.append('profileImage', {
        uri: localFilePath,
        type,
        name: fileName,
      });
      data.append('userStaffId', user?.userStaffId);

      const res = await userServices.postUserProfile(data);
      await FastImage.clearMemoryCache();
      await FastImage.clearDiskCache();

      if (res && res.success) {
        dispatch({
          type: 'SET_PROFILE_IMAGE',
          user: {
            ...res.responseData,
            profileImage: uri,
          },
        });
      }
    } catch (e) {
      console.log('e :>> ', e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container edges={['right', 'left']}>
      <LinearGradient
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 1 }}
        colors={['#0064FB', 'rgba(76, 149, 255, 0) 27.84%)']}
        style={{
          height: 160,
          position: 'absolute',
          width: '100%',
        }}
      />
      <Content noPadding>
        <View style={styles.cardRadius}>
          <View>
            <View
              style={{
                width: '100%',
                position: 'relative',
                bottom: 52,
                alignItems: 'center',
              }}>
              <Avatar
                name={user?.firstname}
                source={
                  user?.profileImage ? { uri: user?.profileImage } : undefined
                }
                onPressEdit={onEditProfile}
              />
            </View>
            <Body navigation={navigation} />
          </View>

          <View>
            <Button
              onPress={() => setModalVisible(true)}
              iconFont={
                <Image
                  source={icons.logout}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 8,
                  }}
                />
              }
              title="ออกจากระบบ"
              secondary
            />
          </View>
        </View>
        <LoadingSpinner visible={loading} />
      </Content>
      <ModalWarning
        title="ต้องการออกจากระบบ"
        visible={modalVisible}
        minHeight={75}
        onConfirm={onLogout}
        onRequestClose={() => setModalVisible(false)}
      />
    </Container>
  );
}
const styles = StyleSheet.create({
  cardRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    backgroundColor: colors.white,
    marginTop: '24%',
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
});
