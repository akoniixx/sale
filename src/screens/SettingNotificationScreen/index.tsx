import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';
import Switch from '../../components/Switch/Switch';
import Text from '../../components/Text/Text';
import { userServices } from '../../services/UserServices';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingNotificationScreen() {
  const {
    state: { user },
    authContext: { getUser },
  } = useAuth();
  const [isEnabled, setIsEnabled] = React.useState(user?.notiStatus);
  const [loading, setLoading] = React.useState(false);

  const toggleSwitch = async () => {
    setLoading(true);
    try {
      const res = await userServices.updateProfileNotification({
        notiStatus: !isEnabled,
        userStaffId: user?.userStaffId || '',
      });
      if (res && res.success) {
        await getUser();
        setIsEnabled(!isEnabled);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <Header title="การแจ้งเตือน" />
      <Content
        noPadding
        style={{
          flex: 1,
          backgroundColor: colors.background1,
        }}>
        <View
          style={{
            flex: 1,
            padding: 16,
            marginTop: 16,

            backgroundColor: colors.white,
          }}>
          <View style={styles.list}>
            <Text fontFamily="NotoSans" semiBold>
              การแจ้งเตือนทั้งหมด
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginRight: 16,
                }}>
                เปิด
              </Text>
              <Switch onValueChange={toggleSwitch} value={!!isEnabled} />
            </View>
          </View>
        </View>
      </Content>
      <LoadingSpinner visible={loading} />
    </Container>
  );
}
const styles = StyleSheet.create({
  list: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
  },
});
