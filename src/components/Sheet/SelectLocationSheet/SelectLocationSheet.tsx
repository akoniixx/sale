import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import Text from '../../Text/Text';
import icons from '../../../assets/icons';
import { SheetManager } from 'react-native-actions-sheet';
import { colors } from '../../../assets/colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterShadow from '../../FooterShadow/FooterShadow';
import { Form } from '../../Form/Form';
import InputTextForm from '../../Form/InputTextForm';
import * as Yup from 'yup';
import { SubmitButton } from '../../Form/SubmitButton';
import { factoryServices } from '../../../services/FactorySevices';
import { useAuth } from '../../../contexts/AuthContext';
import InputText from '../../InputText/InputText';
export default function SelectLocationSheet(props: SheetProps) {
  const {
    state: { user },
  } = useAuth();
  const [selected, setSelected] = React.useState('SHOP');
  const [remark,setRemark] = useState('')
  const [storeAddress, setStoreAddress] = React.useState({
    name: '',
    addressText: '',
  });
  const [factoryAddress, setFactoryAddress] = React.useState({
    name: '',
    addressText: '',
  });
  const [isShowKeyboard, setIsShowKeyboard] = React.useState(false);
  const schema = Yup.object().shape({
    comment: Yup.string(),
  });
  const schemaWithAddress = Yup.object().shape({
    comment: Yup.string(),
    address: Yup.string().required('กรุณากรอกที่อยู่'),
  });

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
  useEffect(() => {
    const getFactory = async () => {
      setRemark(props.payload.comment || '')
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

    setSelected(props.payload.selected || 'SHOP');
  }, []);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsShowKeyboard(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsShowKeyboard(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <ActionSheet
      containerStyle={{
        height: '100%',
      }}
      id={props.sheetId}>
        <SafeAreaView style={{flex:1}}  >
        <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          height: '100%',
        }}
        style={{
          flex: 1,
        }}>
        <Form
          schema={selected === 'OTHER' ? schemaWithAddress : schema}
          defaultValues={{}}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <KeyboardAvoidingView
              style={styles.container}
              keyboardVerticalOffset={-100}
              behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    SheetManager.hide(props.sheetId);
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                  }}>
                  <Image
                    source={icons.closeBlack}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </TouchableOpacity>
                <Text fontSize={20} bold fontFamily="NotoSans">
                  เลือกการจัดส่ง
                </Text>
              </View>
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
                      defaultValue={props.payload.name || ''}
                      blurOnSubmit={true}
                      returnKeyType="done"
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text fontSize={16} fontFamily="NotoSans" style={{marginBottom:8}}>
                    หมายเหตุ (ลูกค้า)
                  </Text>
                  <Text fontSize={16} fontFamily="NotoSans" style={{marginBottom:8}}>
                    {remark.length||0}/150
                  </Text>
                    </View>
                  
                  <InputText
                  onChangeText={(text)=>setRemark(text)}
                    blurOnSubmit={true}
                    defaultValue={props.payload.comment || ''}
                   
                    multiline
                    maxLength={150}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    style={{
                      minHeight: Platform.OS === 'ios' ? 140 : 80,
                      
                    }}
                    numberOfLines={4}
                    placeholder="ใส่หมายเหตุ..."
                    scrollEnabled={false}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
          {!isShowKeyboard ? (
            <FooterShadow
              style={{
                position: 'absolute',
                bottom: 0,
                marginBottom: 16,
              }}>
              <SubmitButton
                title="ยืนยัน"
                onSubmit={async data => {
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
                          comment:remark,
                        }
                      : {
                          name: factoryAddress.name,
                          address: factoryAddress.addressText,
                          comment: remark,
                        };
                  SheetManager.hide(props.sheetId, {
                    payload: {
                      ...payload,
                      selected,
                    },
                  });
                }}
              />
            </FooterShadow>
          ) : (
            <></>
          )}
        </Form>
      </ScrollView>
        </SafeAreaView>
     
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  row: {
    marginTop: 32,
    marginBottom: 24,
    flexDirection: 'row',
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
