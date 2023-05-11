import {
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
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
  isShowError,
  refInput,
  setIsShowError,
}: Props) {
  const {
    state: { user },
  } = useAuth();

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text semiBold color="text2" fontFamily="NotoSans">
            หมายเหตุ (สำหรับ Sale Co)
          </Text>
          <InputText
            ref={refInput}
            multiline
            returnKeyType="done"
            value={dataStepTwo?.saleCoRemark || ''}
            placeholder="ใส่หมายเหตุ..."
            numberOfLines={5}
            blurOnSubmit
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
          },
        ]}>
        <Button
          onPress={() => {
            navigation.navigate('SpecialRequestScreen', {
              specialRequestRemark: dataStepTwo?.specialRequestRemark || '',
            });
          }}
          secondary
          style={{
            height: 50,
          }}
          iconFont={
            <Image
              source={icons.specialRequest}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
              }}
            />
          }
          title="Special Request"
        />
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
                    deliveryAddress: `${result.name || ''} ${result.address}`,
                    deliveryRemark: result.comment || '',
                    deliveryDest: result.selected || '',
                  }));
                }
              }}>
              <Text fontSize={14} color="primary">
                เปลี่ยน
              </Text>
            </TouchableOpacity>
          )}
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
                  : 'จัดส่งที่โรงงาน'}
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
        <View style={styles.inputContainer}>
          <Text fontFamily="NotoSans" semiBold fontSize={16}>
            {user?.company === 'ICPF' && <Text color="error">{`*  `}</Text>}
            ข้อมูลทะเบียนรถ
          </Text>
          <InputText
            value={dataStepTwo?.numberPlate || ''}
            multiline
            blurOnSubmit
            returnKeyType="done"
            isError={isShowError}
            scrollEnabled={false}
            style={{
              paddingTop: 16,
            }}
            onChangeText={(text: string) => {
              setIsShowError(false);
              setDataStepTwo(prev => ({ ...prev, numberPlate: text }));
            }}
            placeholder="ระบุทะเบียนรถ"
          />
          <Text color="text3" fontSize={14} lineHeight={26}>
            หากมีรถมากกว่า 1 คัน กรุณาใส่ลูกน้ำคั่น (,)
          </Text>
          {isShowError && (
            <Text color="error" fontFamily="NotoSans">
              กรุณากรอกทะเบียนรถ
            </Text>
          )}
        </View>
      </View>
      <Summary setLoading={setLoading} />
      <LoadingSpinner visible={loading} />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginTop: 8,
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
