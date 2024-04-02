import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import FormLocation from '../../components/Form/FormLocation';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { otherAddressServices } from '../../services/OtherAddressServices/OtherAddressServices';
import Text from '../../components/Text/Text';
import ModalWarning from '../../components/Modal/ModalWarning';

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

  const onDelete = async () => {
    try {
      await otherAddressServices.deleteOtherAddressById(customerOtherId);
    } catch (error) {
      console.log('error', error);
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
      <FormLocation
        onSubmit={() => {
          console.log('submit');
        }}
        addressId={customerOtherId}
      />
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

const styles = StyleSheet.create({});
