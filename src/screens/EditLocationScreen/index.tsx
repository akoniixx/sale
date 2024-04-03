import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import FormLocation, { AssetType } from '../../components/Form/FormLocation';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import {
  OtherAddressType,
  otherAddressServices,
} from '../../services/OtherAddressServices/OtherAddressServices';
import Text from '../../components/Text/Text';
import ModalWarning from '../../components/Modal/ModalWarning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';

type EditLocationScreenProps = StackScreenProps<
  MainStackParamList,
  'EditLocationScreen'
>;

export default function EditLocationScreen({
  navigation,
  route,
}: EditLocationScreenProps) {
  const { customerOtherId } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [onConfirmDel, setOnConfirmDel] = React.useState(false);
  const {
    state: { user },
  } = useAuth();
  const onSubmitEdit = async (
    data: any,
    file: AssetType[],
    deleteFile?: AssetType[],
  ) => {
    try {
      const newFiles = (file || []).filter(el => {
        return el.isInitial === false;
      });
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const customerId = await AsyncStorage.getItem('customerId');
      const updateBy = `${user?.firstname} ${user?.lastname}`;
      setLoading(true);
      const payload: OtherAddressType = {
        address: data.address,
        provinceId: data.province.id,
        province: data.province.title,
        districtId: data.district.id,
        district: data.district.title,
        subdistrictId: data.subDistrict.id,
        customerCompanyId: customerCompanyId ? parseInt(customerCompanyId) : 0,
        customerId: customerId ? parseInt(customerId) : 0,
        subdistrict: data.subDistrict.title,
        postcode: data.postcode,
        receiver: data.receiver,
        telephone: data.telephone,
        updateBy: updateBy,
      };
      const result = await otherAddressServices.updateOtherAddress(
        payload,
        customerOtherId,
      );
      if (result && result?.success) {
        const uploadFile = (newFiles || []).map(async el => {
          return await otherAddressServices.uploadFile({
            file: el,
            updateBy: updateBy,
            customerOtherAddressId: customerOtherId,
          });
        });
        const newDelFile = (deleteFile || []).map(async el => {
          return await otherAddressServices.deleteFile(el.id || '');
        });
        await Promise.all([...uploadFile]);
        await Promise.all([...newDelFile]);

        setLoading(false);
        setTimeout(() => {
          navigation.goBack();
        }, 800);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await otherAddressServices.deleteOtherAddressById(customerOtherId);
      setLoading(false);
      setOnConfirmDel(false);
      setTimeout(() => {
        navigation.goBack();
      }, 800);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <Header
        title="แก้ไขที่อยู่"
        componentRight={
          <TouchableOpacity
            onPress={() => {
              setOnConfirmDel(true);
            }}>
            <Text color="error">ลบที่อยู่</Text>
          </TouchableOpacity>
        }
      />
      <FormLocation onSubmit={onSubmitEdit} addressId={customerOtherId} />
      <LoadingSpinner visible={loading} />
      <ModalWarning
        title="ยืนยันการลบที่อยู่"
        desc="ต้องการยืนยันการลบที่อยู่นี้ใช่หรือไม่?"
        visible={onConfirmDel}
        onRequestClose={() => setOnConfirmDel(false)}
        onConfirm={onDelete}
        colorPrimaryButton="error"
        contentAlign="flex-start"
      />
    </Container>
  );
}
