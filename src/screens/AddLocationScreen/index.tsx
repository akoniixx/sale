import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import FormLocation from '../../components/Form/FormLocation';
import {
  OtherAddressType,
  otherAddressServices,
} from '../../services/OtherAddressServices/OtherAddressServices';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

interface AddLocationPayload {
  telephone: string;
  receiver: string;
  address: string;
  postcode: string;
  subDistrict: {
    title: string;
    id: string;
    postcode: string;
  };
  district: {
    title: string;
    id: string;
  };
  province: {
    title: string;
    id: string;
  };
}
const AddLocationScreen = ({ navigation }: { navigation: any }) => {
  const {
    state: { user },
  } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const onSubmitAddLocation = async (data: AddLocationPayload, file: any[]) => {
    try {
      setLoading(true);
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const customerId = await AsyncStorage.getItem('customerId');
      const updateBy = `${user?.firstname} ${user?.lastname}`;
      const payload: OtherAddressType = {
        customerId: customerId ? parseInt(customerId) : 0,
        customerCompanyId: customerCompanyId ? parseInt(customerCompanyId) : 0,
        address: data.address,
        provinceId: data.province.id,
        province: data.province.title,
        districtId: data.district.id,
        district: data.district.title,
        subdistrictId: data.subDistrict.id,
        subdistrict: data.subDistrict.title,
        postcode: data.postcode,
        receiver: data.receiver,
        telephone: data.telephone,
        updateBy: updateBy,
      };
      const result = await otherAddressServices.createOtherAddress(payload);
      if (result && result.success) {
        const customerOtherAddressId = result.responseData.id;

        if (file.length > 0) {
          const multipleUpload = file.map(async item => {
            const uploadFile = await otherAddressServices.uploadFile({
              file: item,
              updateBy,
              customerOtherAddressId,
            });
            return uploadFile;
          });
          await Promise.all(multipleUpload).catch(err => {
            throw err;
          });
          setLoading(false);
        }
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <Header title="เพิ่มที่อยู่" />

      <FormLocation onSubmit={onSubmitAddLocation} />
      <LoadingSpinner visible={loading} />
    </Container>
  );
};

export default AddLocationScreen;
