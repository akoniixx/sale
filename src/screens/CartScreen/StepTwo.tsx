import { View, StyleSheet, Platform, Image, TextInput } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import InputText from '../../components/InputText/InputText';
import Button from '../../components/Button/Button';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Summary from './Summary';
import { TypeDataStepTwo } from '.';

interface Props {
  setDataStepTwo: React.Dispatch<React.SetStateAction<TypeDataStepTwo>>;
  dataStepTwo: TypeDataStepTwo;
}
export default function StepTwo({ setDataStepTwo, dataStepTwo }: Props) {
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text semiBold color="text2" fontFamily="NotoSans">
            หมายเหตุ (สำหรับ Sale Co)
          </Text>
          <InputText
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
          },
        ]}>
        <Button
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
          <Text fontSize={14} color="primary">
            เปลี่ยน
          </Text>
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
              <Text semiBold>จัดส่งที่ร้าน</Text>
              <Text color="text3" fontSize={14}>
                บริษัท เอี่ยวฮั่วล้ง จำกัด
              </Text>
              <Text
                lineHeight={18}
                color="text3"
                fontSize={14}
                style={{
                  width: 280,
                }}>
                116/21 หมู่4 ตำบลเขาบางแกรก อำเภอหนองฉาง อุทัยธานี 61170
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Summary dataStepTwo={dataStepTwo} setDataStepTwo={setDataStepTwo} />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});
