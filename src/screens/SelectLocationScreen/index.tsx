import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect } from 'react';
import icons from '../../assets/icons';
import { Form } from '../../components/Form/Form';
import Text from '../../components/Text/Text';
import InputTextForm from '../../components/Form/InputTextForm';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import { SubmitButton } from '../../components/Form/SubmitButton';
import * as Yup from 'yup';
import { colors } from '../../assets/colors/colors';
import InputText from '../../components/InputText/InputText';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { factoryServices } from '../../services/FactorySevices';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
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
  address: Yup.string().required('กรุณากรอกที่อยู่'),
});

const maxLength = 150;
type Props = StackScreenProps<MainStackParamList, 'SelectLocationScreen'>;

export default function SelectLocationScreen({ navigation, route }: Props) {
  const { comment, name } = route.params;
  const {
    state: { user },
  } = useAuth();
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

    setSelected(route.params.selected || 'SHOP');
  }, [
    comment,
    user?.company,
    route.params.selected,
    route.params.name,
    route.params.address,
  ]);

  const onSubmitLocation = async (data: any) => {
    const payload =
      selected === 'OTHER'
        ? {
            name: data.address,
            comment: remark,
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
    console.log('payload', JSON.stringify(payload, null, 2));
    navigation.navigate('CartScreen', {
      step: 1,
      locationData: payload,
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
            <Content>
              <View style={styles.row}>
                {shipmentList.map(item => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(item.id);
                      }}
                      style={{
                        alignItems: 'center',
                        marginRight: 32,
                      }}
                      key={item.id}>
                      <Image
                        style={{
                          width: 40,
                          height: 40,
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
                          marginTop: 8,
                        }}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View>
                <Text fontFamily="NotoSans" bold fontSize={18}>
                  ที่อยู่จัดส่ง
                </Text>
                {selected === 'OTHER' ? (
                  <View
                    style={{
                      marginTop: 8,
                    }}>
                    <InputTextForm
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
                          marginLeft: 8,
                        }}>
                        <Text
                          fontSize={18}
                          bold
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
                          marginLeft: 8,
                        }}>
                        <Text
                          fontSize={18}
                          bold
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
                <Text fontFamily="NotoSans" bold fontSize={18}>
                  หมายเหตุการจัดส่ง
                </Text>
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
                    onChangeText={text => setRemark(text)}
                    defaultValue={comment || ''}
                    multiline={true}
                    maxLength={150}
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
    marginTop: 32,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backgroundAddress: {
    backgroundColor: colors.background1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    marginTop: 4,
    borderRadius: 8,
  },
});
