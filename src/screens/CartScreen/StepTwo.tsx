import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text/Text';
import InputText from '../../components/InputText/InputText';
import Button from '../../components/Button/Button';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Summary from './Summary';
import { TypeDataStepTwo } from '.';
import { SheetManager } from 'react-native-actions-sheet';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';
import ImageCache from '../../components/ImageCache/ImageCache';
import images from '../../assets/images';
import { getNewPath } from '../../utils/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useOrderLoads } from '../../contexts/OrdersLoadContext';
import { navigationRef } from '../../navigations/RootNavigator';

interface Props {
  loading: boolean;
  isShowError: boolean;
  setIsShowError: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDataStepTwo: React.Dispatch<React.SetStateAction<TypeDataStepTwo>>;
  dataStepTwo: TypeDataStepTwo;
  setAddressDelivery: React.Dispatch<
    React.SetStateAction<{
      address: string;
      name: string;
    }>
  >;
  addressDelivery: {
    address: string;
    name: string;
    id?: string;
  };
  navigation: StackNavigationProp<MainStackParamList, 'CartScreen'>;
  refInput: React.MutableRefObject<any>;
}
export default function StepTwo({
  setDataStepTwo,
  dataStepTwo,
  navigation,
  addressDelivery,
  setAddressDelivery,
  setLoading,
  loading,
  refInput,
  setIsShowError,
  isShowError,
}: Props) {
  const { cartDetail } = useCart();
  const {
    state: { user },
  } = useAuth();

  const {
    currentList,
    dataForLoad,
    setCurrentList,
    headData,
    setHeadData,
    dollyData,
    setDollyData,
    setDataForLoad,
    dataReadyLoad,
    setDataReadyLoad,
  } = useOrderLoads();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [file, setFile] = useState([]);
  const getFile = async () => {
    const storedUrisJson = await AsyncStorage.getItem('imageUris');
    let storedUris = storedUrisJson ? JSON.parse(storedUrisJson) : [];
    setFile(storedUris);
  };
  const [selectPlate, setSelectPlate] = useState<boolean>(true);

  useFocusEffect(
    React.useCallback(() => {
      getFile();
    }, []),
  );

  return (
    <>
      <View style={styles.container}>
        <View
          style={[
            {
              marginTop: 8,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.border1,
              paddingBottom: 14,
            }}>
            <Text bold fontSize={18} fontFamily="NotoSans">
              สถานที่รับสินค้า / สถานที่จัดส่ง
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text fontFamily="NotoSans" semiBold fontSize={16}>
                ข้อมูลทะเบียนรถ
              </Text>
              <Text color="error" fontFamily="NotoSans" fontSize={16}>
                * (จำเป็นต้องระบุ)
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setDataStepTwo(prev => ({ ...prev, numberPlate: '' }));
                    setSelectPlate(true);
                  }}
                  style={[
                    styles.radio,
                    {
                      borderColor: selectPlate
                        ? colors.primary
                        : colors.border1,
                      backgroundColor: selectPlate
                        ? colors.white
                        : colors.border1,
                    },
                  ]}
                />
                <Text>ระบุทะเบียนรถ</Text>
              </View>
            </View>
            {selectPlate && (
              <>
                <InputText
                  ref={refInput}
                  value={dataStepTwo?.numberPlate || ''}
                  multiline
                  returnKeyType="done"
                  blurOnSubmit
                  isError={isShowError}
                  scrollEnabled={false}
                  style={{
                    paddingTop: 16,
                    marginTop: 10,
                  }}
                  onChangeText={(text: string) => {
                    setIsShowError(false);
                    setDataStepTwo(prev => ({ ...prev, numberPlate: text }));
                  }}
                  placeholder="ระบุทะเบียนรถ"
                />
                <Text color="text3" fontSize={14} lineHeight={26}>
                  {`หากมีรถมากกว่า 1 คัน กรุณาใส่ลูกน้ำคั่น (,) `}
                </Text>
              </>
            )}

            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setDataStepTwo(prev => ({ ...prev, numberPlate: '-' }));
                    setSelectPlate(false);
                  }}
                  style={[
                    styles.radio,
                    {
                      borderColor: selectPlate
                        ? colors.border1
                        : colors.primary,
                      backgroundColor: selectPlate
                        ? colors.border1
                        : colors.white,
                    },
                  ]}
                />
                <Text>ไม่ระบุทะเบียนรถ</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 16,
              padding: 8,
              backgroundColor: colors.background1,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.location}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <View
                style={{
                  marginLeft: 8,
                }}>
                <Text semiBold lineHeight={26}>
                  {dataStepTwo.deliveryDest === 'SHOP'
                    ? 'จัดส่งที่ร้าน'
                    : dataStepTwo.deliveryDest === 'OTHER'
                    ? 'จัดส่งที่อื่นๆ'
                    : 'รับที่โรงงาน'}
                </Text>
                <Text color="text3" fontSize={14} lineHeight={26}>
                  {addressDelivery.name}
                </Text>
                <Text
                  lineHeight={20}
                  color="text3"
                  fontSize={14}
                  style={{
                    width: 280,
                  }}>
                  {addressDelivery.address}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text semiBold color="text2" fontFamily="NotoSans">
            หมายเหตุ (สำหรับ Sale Co)
          </Text>
          <InputText
            ref={refInput}
            multiline
            value={dataStepTwo?.saleCoRemark || ''}
            placeholder="ใส่หมายเหตุ..."
            numberOfLines={5}
            onChangeText={text =>
              setDataStepTwo(prev => ({ ...prev, saleCoRemark: text }))
            }
            style={{
              minHeight: Platform.OS === 'ios' ? 100 : 100,
              textAlignVertical: 'top',
              paddingTop: 10,
            }}
          />
        </View>
      </View>
      <View
        style={[
          styles.container,
          {
            marginTop: 8,
            paddingBottom: 30,
          },
        ]}>
        <Text fontSize={18} fontFamily="NotoSans" bold>
          Special Request
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SpecialRequestScreen', {
              specialRequestRemark: dataStepTwo?.specialRequestRemark || '',
            });
          }}
          style={{
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderRadius: 8,
            marginTop: 10,
            borderColor: colors.primary,
          }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Image
              source={icons.specialRequest}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
              }}
            />
            <Text fontSize={18} fontFamily="NotoSans" bold color="primary">
              ขอส่วนลดพิเศษ
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {cartDetail?.specialRequestFreebies?.length > 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              paddingBottom: 20,
            }}>
            <TouchableOpacity
              onPress={() => setIsCollapsed(!isCollapsed)}
              style={{ flexDirection: 'row' }}>
              <Text fontFamily="Sarabun" fontSize={16}>
                ของแถม (Special Req.)
              </Text>
              <Image
                source={icons.iconCollapse}
                style={stylesIcon({ isCollapsed: isCollapsed }).icon}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20 }}>
            {isCollapsed &&
              cartDetail.specialRequestFreebies.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    {item?.productFreebiesImage || item?.productImage ? (
                      <ImageCache
                        uri={getNewPath(
                          item?.productFreebiesImage || item?.productImage,
                        )}
                        style={{
                          width: 44,
                          height: 44,
                        }}
                      />
                    ) : (
                      <Image
                        source={images.emptyProduct}
                        style={{
                          width: 44,
                          height: 44,
                        }}
                      />
                    )}
                    <Text
                      fontSize={14}
                      color="text3"
                      style={{ marginLeft: 10 }}>
                      {item?.productName}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      fontSize={14}
                      color="text3"
                      style={{ marginRight: 10 }}>
                      {item?.quantity}
                    </Text>
                    <Text fontSize={14} color="text3">
                      {item?.saleUOMTH || item?.baseUnitOfMeaTh}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      ) : null}

      {user?.company === 'ICPF' && <View
        style={{
          marginTop: 8,
          backgroundColor: 'white',
          padding: 16,
        }}>
        <Text fontSize={18} bold fontFamily="NotoSans">
          ลำดับการจัดเรียงสินค้า
        </Text>
        <TouchableOpacity
          onPress={() => navigationRef.navigate('OrderLoadsScreen')}
          style={{
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderWidth: 0.5,
            borderRadius: 8,
            marginTop: 10,
            borderColor: '#E1E7F6',
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={icons.car}
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
              <View>
                <Text fontFamily="NotoSans" lineHeight={21}>
                  รายการจัดเรียงสินค้าขึ้นรถ
                </Text>
                {!currentList.every(Item => Item.quantity === 0) &&
                  dataForLoad.length > 0 && (
                    <Text fontSize={14} lineHeight={18} color="secondary">
                      กรุณาตรวจสอบลำดับสินค้าอีกครั้ง
                    </Text>
                  )}
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {currentList.every(Item => Item.quantity === 0) &&
                dataForLoad.length > 0 && (
                  <Image
                    source={icons.uploadSucsess}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                )}
              {!currentList.every(Item => Item.quantity === 0) &&
                dataForLoad.length > 0 && (
                  <Image
                    source={icons.warning}
                    style={{ width: 25, height: 25, marginRight: 10 }}
                  />
                )}
              <Image
                source={icons.iconNext}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>}

      <View
        style={[
          {
            marginTop: 8,
          },
        ]}>
        <View style={{ padding: 16, backgroundColor: 'white' }}>
          <Text bold fontSize={18} fontFamily="NotoSans">
            เพิ่มเอกสาร
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: colors.border1,
              padding: 15,
              borderRadius: 8,
              marginTop: 10,
            }}
            onPress={() =>
              navigation.navigate('UploadFileScreen', {
                orderId: cartDetail.orderId,
              })
            }>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ width: 24, height: 24, marginRight: 10 }}
                  source={icons.doc}
                />
                <Text fontFamily="NotoSans">{`เพิ่มเอกสารที่เกี่ยวข้อง(${file.length} ภาพ)`}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {file.length > 0 && (
                  <Image
                    source={icons.uploadSucsess}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                )}

                <Image
                  style={{ width: 24, height: 24 }}
                  source={icons.iconNext}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.container,
          {
            marginTop: 8,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: colors.border1,
            paddingBottom: 14,
          }}>
          <Text bold fontSize={18} fontFamily="NotoSans">
            สถานที่รับสินค้า / สถานที่จัดส่ง
          </Text>
          {user?.company !== 'ICPF' && (
            <TouchableOpacity
              onPress={async () => {
                const result: {
                  name?: string;
                  address: string;
                  comment?: string;
                  selected: string;
                } = await SheetManager.show('select-location', {
                  payload: {
                    address: addressDelivery.address,
                    name: addressDelivery.name,
                    comment: dataStepTwo?.deliveryRemark || '',
                    selected: dataStepTwo.deliveryDest,
                  },
                });
                if (result) {
                  setAddressDelivery(prev => ({
                    ...prev,
                    address: result.address,
                    name: result.name || '',
                  }));
                  setDataStepTwo(prev => ({
                    ...prev,
                    deliveryAddress: `${result.name || ''} ${
                      result.address || ''
                    }`,
                    deliveryRemark: result.comment || '',
                    deliveryDest: result.selected || '',
                  }));
                }
              }}
              // onPress={() => {
              //   navigation.navigate('SelectLocationScreen', {
              //     address: addressDelivery.address,
              //     name: addressDelivery.name,
              //     comment: dataStepTwo?.deliveryRemark || '',
              //     selected: dataStepTwo.deliveryDest,
              //     id: addressDelivery?.id,
              //   });
              // }}
            >
              <Text fontSize={14} color="primary">
                เปลี่ยน
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputContainer}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text fontFamily="NotoSans" semiBold fontSize={16}>
              {/*  {user?.company === 'ICPF' && <Text color="error">{`*  `}</Text>} */}
              ข้อมูลทะเบียนรถ
            </Text>
            <Text>{dataStepTwo.numberPlate?.length || 0}/50</Text>
          </View>

          <InputText
            maxLength={50}
            value={dataStepTwo?.numberPlate || ''}
            multiline
            blurOnSubmit
            returnKeyType="done"
            style={{
              paddingTop: 12,
            }}
            scrollEnabled={false}
            onChangeText={(text: string) => {
              setIsShowError(false);
              setDataStepTwo(prev => ({ ...prev, numberPlate: text }));
            }}
            placeholder="ระบุทะเบียนรถ"
          />
          <Text color="text3" fontSize={14} lineHeight={26}>
            กรุณาระบุทะเบียนรถ 1 คำสั่งซื้อต่อ 1 คัน
          </Text>
          {/* {isShowError && (
            <Text color="error" fontFamily="NotoSans">
              กรุณากรอกทะเบียนรถ
            </Text>
          )} */}
        </View>
        <View
          style={{
            marginTop: 16,
            padding: 8,
            backgroundColor: colors.background1,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={icons.location}
              style={{
                width: 24,
                height: 24,
              }}
            />
            <View
              style={{
                marginLeft: 8,
              }}>
              <Text semiBold lineHeight={26}>
                {dataStepTwo.deliveryDest === 'SHOP'
                  ? 'จัดส่งที่ร้าน'
                  : dataStepTwo.deliveryDest === 'OTHER'
                  ? 'จัดส่งที่อื่นๆ'
                  : 'รับที่โรงงาน'}
              </Text>
              <Text color="text3" fontSize={14} lineHeight={26}>
                {addressDelivery.name}
              </Text>
              <Text
                lineHeight={20}
                color="text3"
                fontSize={14}
                style={{
                  width: 280,
                }}>
                {addressDelivery.address}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Summary setLoading={setLoading} />
      <LoadingSpinner visible={loading} />
    </>
  );
}

const stylesIcon = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
      marginLeft: 10,
      transform: [{ rotate: isCollapsed ? '180deg' : '0deg' }],
    },
  });
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginTop: 16,
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  radio: {
    borderWidth: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
});
