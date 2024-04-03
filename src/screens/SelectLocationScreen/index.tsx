import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import icons from '../../assets/icons';
import { Form } from '../../components/Form/Form';
import Text from '../../components/Text/Text';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import { SubmitButton } from '../../components/Form/SubmitButton';
import * as Yup from 'yup';
import { colors } from '../../assets/colors/colors';
import InputText from '../../components/InputText/InputText';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { factoryServices } from '../../services/FactorySevices';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import ListOtherLocation from './ListOtherLocation';
const shipmentList = [
  {
    id: 'SHOP',
    title: 'จัดส่งที่ร้าน',
    icon: icons.store,
    iconActive: icons.storeActive,
  },
  {
    id: 'FACTORY',
    title: 'รับที่โรงงาน',
    icon: icons.factory,
    iconActive: icons.factoryActive,
  },
  {
    id: 'OTHER',
    title: 'ส่ง/รับ ที่อื่นๆ',
    icon: icons.other,
    iconActive: icons.otherActive,
  },
];
const schema = Yup.object().shape({
  comment: Yup.string(),
});
const schemaWithAddress = Yup.object().shape({
  comment: Yup.string(),
  // address: Yup.string().required('กรุณากรอกที่อยู่'),
});

const maxLength = 150;
const md = [0, 0, 4];
type Props = StackScreenProps<MainStackParamList, 'SelectLocationScreen'>;

export default function SelectLocationScreen({ navigation, route }: Props) {
  const { comment } = route.params;
  const {
    state: { user },
  } = useAuth();
  const underlineWidth = 60; // Set this to your desired underline width
  const underlinePosition = useRef(new Animated.Value(60)).current;

  const [selected, setSelected] = React.useState('SHOP');
  const [remark, setRemark] = React.useState('');
  const [storeAddress, setStoreAddress] = React.useState({
    name: '',
    addressText: '',
  });
  const [factoryAddress, setFactoryAddress] = React.useState({
    name: '',
    addressText: '',
  });

  const [otherAddress, setOtherAddress] = React.useState({
    name: '',
    addressText: '',
    id: '',
  });

  useEffect(() => {
    const getFactory = async () => {
      setRemark(comment || '');
      const factoryData = await factoryServices.getFactory(user?.company || '');
      setFactoryAddress({
        name: factoryData.factoryName,
        addressText: `${factoryData.address} ${factoryData.subDistrict} ${factoryData.district} ${factoryData.province} ${factoryData.postcode}`,
      });
    };
    const getAddressBySelect = async () => {
      const address = await AsyncStorage.getItem('address');
      const addressObj = JSON.parse(address || '');
      setStoreAddress(addressObj);
    };
    getAddressBySelect();
    getFactory();

    setSelected(() => {
      const index = shipmentList.findIndex(
        item => item.id === (route.params.selected || 'SHOP'),
      );
      const screenWidth = Dimensions.get('window').width;
      const numTabs = shipmentList.length;
      const tabWidthIncludingPadding = screenWidth / numTabs + md[index];

      Animated.spring(underlinePosition, {
        toValue: index * tabWidthIncludingPadding,
        useNativeDriver: false,
      }).start();

      if (route.params.selected) {
        return route.params.selected;
      }
      return 'SHOP';
    });
  }, [
    comment,
    user?.company,
    route.params.selected,
    route.params.name,
    route.params.address,
    underlinePosition,
  ]);

  const onSubmitLocation = async (data: any) => {
    const payload =
      selected === 'OTHER'
        ? {
            name: otherAddress.name,
            comment: remark,
            address: otherAddress.addressText,
          }
        : selected === 'SHOP'
        ? {
            name: storeAddress.name,
            address: storeAddress.addressText,
            comment: remark,
          }
        : {
            name: factoryAddress.name,
            address: factoryAddress.addressText,
            comment: remark,
          };
    navigation.navigate('CartScreen', {
      step: 1,
      locationData: {
        selected,
        ...payload,
      },
    });
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container>
        <Header
          onBackCustom={() => {
            navigation.navigate('CartScreen', {
              step: 1,
              locationData: {
                selected: route.params.selected,
                name: route.params.name,
                address: route.params.address,
                comment: route.params.comment,
              },
            });
          }}
          title="เลือกการจัดส่ง"
          iconLeft={icons.closeBlack}
        />
        <Form
          schema={selected === 'OTHER' ? schemaWithAddress : schema}
          defaultValues={{}}>
          <ScrollView
            style={{
              flex: 1,
              width: '100%',
            }}>
            <Content noPadding>
              <View style={styles.containerRow}>
                <View style={styles.row}>
                  {shipmentList.map((item, idx) => {
                    return (
                      <View key={idx}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelected(item.id);
                            const screenWidth = Dimensions.get('window').width;
                            const numTabs = shipmentList.length;
                            const tabWidthIncludingPadding =
                              screenWidth / numTabs + md[idx];

                            Animated.spring(underlinePosition, {
                              toValue: idx * tabWidthIncludingPadding,

                              useNativeDriver: false,
                            }).start();
                          }}
                          style={{
                            alignItems: 'center',
                          }}
                          key={item.id}>
                          <Image
                            style={{
                              width: 32,
                              height: 32,
                            }}
                            resizeMode="contain"
                            source={
                              selected === item.id ? item.iconActive : item.icon
                            }
                          />
                          <Text
                            fontSize={14}
                            semiBold={selected === item.id ? true : false}
                            fontFamily="NotoSans"
                            color={selected === item.id ? 'primary' : 'text3'}
                            style={{
                              marginTop: 6,
                            }}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                <View
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingHorizontal: 16,
                    top: 8,
                  }}>
                  <Animated.View
                    style={{
                      height: 4,
                      width: underlineWidth,
                      backgroundColor: colors.primary,
                      position: 'absolute',
                      bottom: 0,
                      left: underlinePosition,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: 16,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.locationIcon}
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 4,
                    }}
                  />
                  <Text fontFamily="NotoSans" bold fontSize={18}>
                    ที่อยู่จัดส่ง
                  </Text>
                </View>
                {selected === 'OTHER' ? (
                  <View
                    style={{
                      marginTop: 8,
                      width: '100%',
                    }}>
                    {/* <InputTextForm
                      name="address"
                      multiline
                      defaultValue={name || ''}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      style={{
                        minHeight: Platform.OS === 'ios' ? 140 : 80,
                      }}
                      numberOfLines={4}
                      placeholder="ใส่ที่อยู่จัดส่ง..."
                      scrollEnabled={false}
                    /> */}
                    <ListOtherLocation
                      navigation={navigation}
                      setOtherAddress={setOtherAddress}
                      otherAddress={otherAddress}
                    />
                  </View>
                ) : (
                  <View style={styles.backgroundAddress}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 5,
                        marginTop: 4,
                        borderColor: colors.primary,
                      }}
                    />
                    {selected === 'SHOP' ? (
                      <View
                        style={{
                          marginLeft: 12,
                        }}>
                        <Text
                          fontSize={18}
                          semiBold
                          lineHeight={28}
                          fontFamily="NotoSans">
                          {storeAddress.name}
                        </Text>
                        <Text
                          fontSize={16}
                          lineHeight={24}
                          style={{
                            width: '60%',
                            marginTop: 8,
                          }}>
                          {storeAddress.addressText}
                        </Text>
                      </View>
                    ) : selected === 'FACTORY' ? (
                      <View
                        style={{
                          marginLeft: 12,
                        }}>
                        <Text
                          fontSize={18}
                          semiBold
                          lineHeight={28}
                          fontFamily="NotoSans">
                          {factoryAddress.name}
                        </Text>
                        <Text
                          fontSize={16}
                          lineHeight={24}
                          style={{
                            width: '60%',
                            alignSelf: 'flex-start',
                            marginTop: 8,
                          }}>
                          {factoryAddress.addressText}
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                )}

                <View
                  style={{
                    borderTopWidth: 1,
                    borderColor: colors.border1,
                    marginVertical: 32,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.remarkIcon}
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 4,
                    }}
                  />
                  <Text fontFamily="NotoSans" bold fontSize={18}>
                    หมายเหตุการจัดส่ง
                  </Text>
                </View>
                <View
                  style={{
                    marginVertical: 8,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      fontSize={16}
                      fontFamily="NotoSans"
                      style={{ marginBottom: 8 }}>
                      หมายเหตุ (ลูกค้า)
                    </Text>
                    <Text
                      fontSize={16}
                      fontFamily="NotoSans"
                      style={{ marginBottom: 8 }}>
                      {remark.length || 0}/{maxLength}
                    </Text>
                  </View>

                  <InputText
                    onChangeText={text => {
                      setRemark(text);
                    }}
                    defaultValue={comment || ''}
                    multiline={true}
                    maxLength={maxLength}
                    scrollEnabled={false}
                    style={{
                      minHeight: Platform.OS === 'ios' ? 140 : 80,
                    }}
                    numberOfLines={4}
                    placeholder="ใส่หมายเหตุ..."
                  />
                </View>
              </View>
            </Content>
          </ScrollView>
          <FooterShadow style={{}}>
            <SubmitButton title="ยืนยัน" onSubmit={onSubmitLocation} />
          </FooterShadow>
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerRow: {
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 32,
    borderBottomColor: colors.border1,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  backgroundAddress: {
    backgroundColor: colors.background1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
