import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { otherAddressServices } from '../../services/OtherAddressServices/OtherAddressServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: StackNavigationProp<
    MainStackParamList,
    'SelectLocationScreen',
    undefined
  >;
  route: RouteProp<MainStackParamList, 'SelectLocationScreen'>;
  setOtherAddress: React.Dispatch<
    React.SetStateAction<{
      name: string;
      addressText: string;
      id: string;
      deliveryFiles: string[];
    }>
  >;
  otherAddress: {
    name: string;
    addressText: string;
    id: string;
    deliveryFiles: string[];
  };
}
interface CustomerOtherAddressFile {
  id: string;
  customerOtherAddressId: string;
  pathFile: string;
  createdAt: string;
  updatedAt: string;
  updateBy: string;
}

interface CustomerAddress {
  id: string;
  customerId: string;
  customerCompanyId: string;
  address: string;
  provinceId: number;
  province: string;
  districtId: number;
  district: string;
  subdistrictId: number;
  subdistrict: string;
  postcode: string;
  lat: null | number;
  long: null | number;
  receiver: string;
  telephone: string;
  createdAt: string;
  updatedAt: string;
  updateBy: string;
  fileOtherAddress: CustomerOtherAddressFile[];
}

export default function ListOtherLocation({
  navigation,
  setOtherAddress,
  otherAddress,
  route,
}: Props) {
  const [listOtherAddress, setListOtherAddress] = React.useState<
    CustomerAddress[]
  >([]);

  const onPressEdit = (id: string) => {
    navigation.navigate('EditLocationScreen', { customerOtherId: id });
  };
  const onPressAdd = () => {
    navigation.navigate('AddLocationScreen');
  };

  const onSelected = (item: CustomerAddress) => {
    setOtherAddress({
      name: item.receiver,
      addressText: `${item.address} ${item.subdistrict} ${item.district} ${item.province} ${item.postcode}`,
      id: item.id,
      deliveryFiles: item.fileOtherAddress.map(el => el.pathFile),
    });
  };

  useFocusEffect(
    useCallback(() => {
      const getOtherAddressList = async () => {
        const customerId = await AsyncStorage.getItem('customerId');
        const customerCompanyId = await AsyncStorage.getItem(
          'customerCompanyId',
        );
        if (customerId && customerCompanyId) {
          const result = await otherAddressServices.getOtherAddressList({
            customerId: parseInt(customerId),
            customerCompanyId: parseInt(customerCompanyId),
          });
          if (result && result.success) {
            setListOtherAddress(result.responseData);

            if (route?.params?.id) {
              setOtherAddress(prev => {
                return {
                  ...prev,
                  name: route.params.name || '',
                  addressText: route.params.address || '',
                  id: route.params.id || '',
                };
              });
            } else {
              setOtherAddress({
                name: result.responseData[0].receiver,
                addressText: `${result.responseData[0].address} ${result.responseData[0].subdistrict} ${result.responseData[0].district} ${result.responseData[0].province} ${result.responseData[0].postcode}`,
                id: result.responseData[0].id,
                deliveryFiles: result.responseData[0].fileOtherAddress.map(
                  (el: any) => el.pathFile,
                ),
              });
            }
          }
        }
      };
      getOtherAddressList();
    }, [
      setOtherAddress,
      route?.params?.id,
      route?.params?.name,
      route?.params?.address,
    ]),
  );

  return (
    <View
      style={{
        width: '100%',
      }}>
      {listOtherAddress.map((el, idx) => {
        const address = `${el.address} ${el.subdistrict} ${el.district} ${el.province} ${el.postcode}`;
        const isSelected = otherAddress.id === el.id;
        return (
          <TouchableOpacity
            key={idx}
            style={[
              styles.backgroundAddress,
              {
                borderWidth: isSelected ? 1 : 0,
              },
            ]}
            onPress={() => {
              onSelected(el);
            }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: isSelected ? 4 : 1,
                marginTop: 4,
                borderColor: isSelected ? colors.primary : colors.border2,
                backgroundColor: isSelected ? colors.white : colors.white,
              }}
            />

            <View
              style={{
                paddingLeft: 12,
                width: Dimensions.get('window').width - 74,
              }}>
              <Text
                fontSize={18}
                semiBold
                lineHeight={28}
                fontFamily="NotoSans">
                {el.receiver} {` `}
                <Text>{el.telephone}</Text>
              </Text>
              <Text
                fontSize={16}
                lineHeight={24}
                style={{
                  width: '70%',
                  alignSelf: 'flex-start',
                  marginTop: 4,
                }}>
                {address}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4,
                  }}>
                  <Image
                    source={icons.remarkIcon}
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 8,
                    }}
                    resizeMode="contain"
                  />
                  <Text>เอกสาร {el.fileOtherAddress.length} รายการ</Text>
                </View>

                <TouchableOpacity onPress={() => onPressEdit(el.id)}>
                  <Image
                    source={icons.editPrimary}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity onPress={onPressAdd}>
        <View style={styles.addLocation}>
          <Text
            fontFamily="NotoSans"
            fontSize={30}
            color="primary"
            style={{
              marginRight: 8,
            }}>
            +
          </Text>
          <Text
            lineHeight={30}
            fontFamily="NotoSans"
            bold
            color="primary"
            fontSize={18}>
            เพิ่มที่อยู่
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  backgroundAddress: {
    backgroundColor: colors.background1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    marginTop: 4,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    width: '100%',
  },
});
