import { View, StyleSheet, Image, Platform } from 'react-native';
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
import FastImage from 'react-native-fast-image';
import Text from '../../components/Text/Text';
import VersionCheck from 'react-native-version-check';

interface Props {
  navigation?: any;
}
export default function ProfileScreen({ navigation }: Props) {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [version, setVersion] = React.useState<string>('');
  const {
    state: { user },
    authContext: { logout, getUser },
    dispatch,
  } = useAuth();
  useEffect(() => {
    const getCurrentVersion = async () => {
      const currentVersion = await VersionCheck.getCurrentVersion();
      setVersion(currentVersion);
    };
    getUser();
    getCurrentVersion();
  }, [getUser]);
  const onLogout = async () => {
    await logout();
    setModalVisible(false);
    navigate('initPage');
  };

  const onEditProfile = async (value: any) => {
    try {
      const { uri, type, fileName } = value;
      const isIOS = Platform.OS === 'ios';
      const localFilePath = isIOS ? uri : uri.replace('file://', '');
      const data = new FormData();
      data.append('profileImage', {
        uri: localFilePath,
        type,
        name: fileName,
      });
      data.append('userStaffId', user?.userStaffId);

      const res = await userServices.postUserProfile(data);
      FastImage.preload([{ uri }]);
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

          <View
            style={{
              alignItems: 'center',
            }}>
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
            <Text
              fontSize={14}
              color="text3"
              style={{
                marginTop: 8,
              }}>
              เวอร์ชั่น {version}
            </Text>
          </View>
        </View>
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
