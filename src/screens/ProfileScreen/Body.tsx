import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import Text from '../../components/Text/Text';
import { useAuth } from '../../contexts/AuthContext';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';

const mappingCompany = {
  ICPL: 'ICP Ladda',
  ICPI: 'ICP International',
  ICPF: 'ICP Fertilizer',
};
interface Props {
  navigation?: any;
}

export default function Body({ navigation }: Props) {
  const {
    state: { user, companyDetail },
  } = useAuth();

  const onClickTC = () => {
    navigation.navigate('TCReadOnlyScreen');
  };
  const onClickSettingNotification = () => {
    navigation.navigate('SettingNotificationScreen');
  };

  return (
    <View>
      <View style={styles.container}>
        <Text bold fontFamily="NotoSans" fontSize={20} lineHeight={32}>
          {user?.firstname} {user?.lastname}
        </Text>
        <Text color="text2">
          {user?.role} , ({companyDetail?.companyNameTh})
        </Text>
        <Text color="text2">เบอร์โทรศัพท์ : {user?.telephone}</Text>

        <View
          style={{
            marginVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border1,
            width: '100%',
            height: 1,
          }}
        />

        <TouchableOpacity
          style={styles.card}
          onPress={onClickSettingNotification}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.iconNotification}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Text
              fontFamily="NotoSans"
              style={{
                marginLeft: 8,
              }}>
              การแจ้งเตือน
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {user?.notiStatus ? (
              <Text
                color="current"
                fontSize={14}
                style={{
                  marginRight: 8,
                }}>
                เปิด
              </Text>
            ) : (
              <Text
                color="text3"
                fontSize={14}
                style={{
                  marginRight: 8,
                }}>
                ปิด
              </Text>
            )}
            <Image
              source={icons.iconNext}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={onClickTC}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.iconTC}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <Text
              fontFamily="NotoSans"
              style={{
                marginLeft: 8,
              }}>
              เงื่อนไข และข้อตกลงการใช้บริการ
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.iconNext}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: 32,
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    paddingBottom: 16,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border1,
  },
});
