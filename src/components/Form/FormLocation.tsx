import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal as ModalRN,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../Text/Text';
import icons from '../../assets/icons';
import { Form } from './Form';
import * as yup from 'yup';
import InputSheetForm from './InputSheetForm';
import { useFormContext } from 'react-hook-form';
import { distanceServices } from '../../services/DistanceServices';
import InputTextForm from './InputTextForm';
import { colors } from '../../assets/colors/colors';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import DashedLine from 'react-native-dashed-line';
import { SubmitButton } from './SubmitButton';
import ImageViewer from 'react-native-image-zoom-viewer';
import { otherAddressServices } from '../../services/OtherAddressServices/OtherAddressServices';

interface Props {
  onSubmit: (data: any, file: any[], deleteFile?: any[]) => void;
  addressId?: string;
}
interface FormDetailType {
  addressId?: string;
  onSubmit: (data: any, file: any[], deleteFile?: any[]) => void;
}
interface CustomerOtherAddressFile {
  id: string;
  customerOtherAddressId: string;
  pathFile: string;
  createdAt: string;
  updatedAt: string;
  updateBy: string;
  fileName: string; // Added field
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
export interface AssetType extends Asset {
  isInitial: boolean;
  id?: string;
}

export default function FormLocation({ addressId, onSubmit }: Props) {
  const schemaYup = yup.object().shape({
    province: yup
      .object()
      .shape({
        id: yup.string().required('กรุณาระบุจังหวัด'),
        title: yup.string().required('กรุณาระบุจังหวัด'),
      })
      .required('กรุณาระบุจังหวัด'),
    district: yup
      .object()
      .shape({
        id: yup.string().required('กรุณาระบุอำเภอ'),
        title: yup.string().required('กรุณาระบุอำเภอ'),
      })
      .required('กรุณาระบุอำเภอ'),
    subDistrict: yup
      .object()
      .shape({
        id: yup.string().required('กรุณาระบุตำบล'),
        title: yup.string().required('กรุณาระบุตำบล'),
      })
      .required('กรุณาระบุตำบล'),
    postcode: yup.string().required('กรุณาระบุรหัสไปรษณีย์'),
    address: yup.string().required('กรุณาระบุรายละเอียดที่อยู่'),
    receiver: yup.string().required('กรุณาระบุชื่อผู้รับ'),
    telephone: yup.string().min(9).max(10).required('กรุณาระบุเบอร์ติดต่อ'),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, width: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        scrollIndicatorInsets={{ right: 1 }}
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 16,
        }}>
        <View style={styles.header}>
          <Image
            source={icons.locationIcon}
            style={{
              width: 24,
              height: 24,
              marginRight: 4,
              marginBottom: 4,
            }}
            resizeMode="contain"
          />
          <Text fontFamily="NotoSans" bold fontSize={18}>
            ที่อยู่จัดส่ง
          </Text>
        </View>
        <Form schema={schemaYup} defaultValues={{}}>
          <FormDetail addressId={addressId} onSubmit={onSubmit} />
        </Form>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const FormDetail = ({ addressId, onSubmit }: FormDetailType) => {
  const {
    watch,
    setValue,
    reset,
    formState: { isValid },
    trigger,
  } = useFormContext();
  const [provinceList, setProvinceList] = useState<
    { id: string; title: string }[]
  >([]);
  const [districtList, setDistrictList] = useState<
    { id: string; title: string }[]
  >([]);
  const [subDistrictList, setSubDistrictList] = useState<
    { id: string; title: string }[]
  >([]);
  const [fileDocumentDel, setFileDocumentDel] = useState<AssetType[]>([]);
  const [fileDocument, setFileDocument] = useState<Asset[]>([]);
  const [viewUrl, setViewUrl] = useState<string>('');
  const [isInitial, setIsInitial] = useState<boolean>(true);

  const provinceWatch = watch('province');
  const districtWatch = watch('district');
  const subDistrictWatch = watch('subDistrict');

  useEffect(() => {
    const getDistrictList = async (provinceId: string) => {
      const result = await distanceServices.getDistrictList(provinceId);
      if (result) {
        const newFormat = result
          .map((item: { districtId: string; districtName: string }) => {
            return {
              id: item.districtId,
              title: item.districtName,
            };
          })
          .sort((a: any, b: any) => a.title.localeCompare(b.title));
        setDistrictList(newFormat);
      }
    };
    const getSubDistrictList = async (districtId: string) => {
      const result = await distanceServices.getSubDistrictList(districtId);
      if (result) {
        const newFormat = result
          .map(
            (item: {
              subDistrictId: string;
              subDistrictName: string;
              postcode: string;
            }) => {
              return {
                id: item.subDistrictId,
                title: item.subDistrictName,
                postcode: item.postcode,
              };
            },
          )
          .sort((a: any, b: any) => a.title.localeCompare(b.title));
        setSubDistrictList(newFormat);
      }
    };

    const getAddressById = async () => {
      try {
        const result = await otherAddressServices.getById(addressId as string);
        if (result && result?.success) {
          const data = result.responseData as CustomerAddress;
          reset({
            address: data.address,
            receiver: data.receiver,
            telephone: data.telephone,
            province: {
              title: data.province,
              id: data.provinceId.toString(),
            },
            district: {
              title: data.district,
              id: data.districtId.toString(),
            },
            subDistrict: {
              title: data.subdistrict,
              id: data.subdistrictId.toString(),
            },
            postcode: data.postcode,
          });

          if (data.provinceId) {
            getDistrictList(data.provinceId.toString());
          }
          if (data.districtId) {
            getSubDistrictList(data.districtId.toString());
          }
          const newFile: Asset[] = (data.fileOtherAddress || []).map(el => {
            const threeLast = el.pathFile.split('.').pop();

            return {
              uri: el.pathFile,
              type: 'image/' + threeLast,
              fileName: el.fileName,
              isInitial: true,
              id: el.id,
            };
          });
          setFileDocument(newFile);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (addressId) {
      getAddressById().finally(() => {
        setIsInitial(false);
      });
    } else {
      setIsInitial(false);
    }
  }, [addressId, setValue, reset]);

  useEffect(() => {
    const getProvinceList = async () => {
      try {
        const result = await distanceServices.getProvinceList();
        if (result) {
          const newFormat = result
            .map((item: { provinceId: string; provinceName: string }) => {
              return {
                id: item.provinceId,
                title: item.provinceName,
              };
            })
            .sort((a: any, b: any) => a.title.localeCompare(b.title));
          setProvinceList(newFormat);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProvinceList();
  }, []);

  useEffect(() => {
    const getDistrictList = async (provinceId: string) => {
      if (isInitial && addressId) {
        return;
      }

      const result = await distanceServices.getDistrictList(provinceId);
      if (result) {
        const newFormat = result
          .map((item: { districtId: string; districtName: string }) => {
            return {
              id: item.districtId,
              title: item.districtName,
            };
          })
          .sort((a: any, b: any) => a.title.localeCompare(b.title));
        setDistrictList(newFormat);
        setValue(
          'district',
          {
            id: '',
            title: '',
          },
          { shouldValidate: true },
        );
        setValue(
          'subDistrict',
          {
            id: '',
            title: '',
          },
          { shouldValidate: true },
        );
        setValue(
          'postcode',
          {
            id: '',
            title: '',
          },
          { shouldValidate: true },
        );
      }
    };
    if (provinceWatch?.id) {
      getDistrictList(provinceWatch.id);
      trigger('district');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceWatch, setValue]);

  useEffect(() => {
    const getSubDistrictList = async (districtId: string) => {
      if (isInitial && addressId) {
        return;
      }

      const result = await distanceServices.getSubDistrictList(districtId);
      if (result) {
        const newFormat = result
          .map(
            (item: {
              subDistrictId: string;
              subDistrictName: string;
              postcode: string;
            }) => {
              return {
                id: item.subDistrictId,
                title: item.subDistrictName,
                postcode: item.postcode,
              };
            },
          )
          .sort((a: any, b: any) => a.title.localeCompare(b.title));
        setSubDistrictList(newFormat);
        setValue(
          'subDistrict',
          {
            id: '',
            title: '',
          },
          { shouldValidate: true },
        );
        setValue('postcode', '', { shouldValidate: true });
      }
    };
    if (districtWatch?.id) {
      getSubDistrictList(districtWatch.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtWatch, setValue]);

  useEffect(() => {
    if (subDistrictWatch && subDistrictWatch.postcode) {
      if (isInitial && addressId) {
        return;
      }
      setValue('postcode', subDistrictWatch.postcode, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subDistrictWatch, setValue]);

  const onPressAddDocument = async () => {
    try {
      const option: ImageLibraryOptions = {
        selectionLimit: 5 - fileDocument.length,
        mediaType: 'photo',
        maxWidth: 1000,
        maxHeight: 1000,
      };
      const result: ImagePickerResponse = await launchImageLibrary(option);

      if (result?.didCancel) {
        return;
      }
      if (result?.assets) {
        const newResult = result.assets.map((item: Asset) => {
          return {
            ...item,
            isInitial: false,
          };
        });
        setFileDocument([...fileDocument, ...newResult]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const viewImage = (uri: string) => {
    setViewUrl(uri);
  };
  const onDeleteImage = (index: number) => {
    const fileDou = [...fileDocument] as AssetType[];
    const newFile = fileDou.filter((_: any, idx: number) => idx !== index);
    setFileDocument(newFile);
    if (fileDou[index].isInitial) {
      setFileDocumentDel([...fileDocumentDel, fileDou[index]]);
    }
  };

  return (
    <>
      <InputSheetForm
        name="province"
        required
        listData={provinceList}
        label="จังหวัด"
        placeholder="ระบุจังหวัด"
      />
      <InputSheetForm
        name="district"
        required
        listData={districtList}
        label="อำเภอ"
        placeholder="ระบุอำเภอ"
        disabled={!provinceWatch?.id}
      />
      <InputSheetForm
        name="subDistrict"
        required
        listData={subDistrictList}
        label="ตำบล"
        placeholder="ระบุตำบล"
        disabled={!districtWatch?.id}
      />
      <InputTextForm
        name="postcode"
        required
        label="รหัสไปรษณีย์"
        placeholder="รหัสไปรษณีย์"
        disabled
      />
      <InputTextForm
        name="address"
        label="รายละเอียดที่อยู่"
        placeholder="บ้านเลขที่ / หมู่ / หมู่บ้าน / ซอย / ถนน"
        required
      />
      <View style={[styles.divider]} />
      <View
        style={[
          styles.header,
          {
            marginTop: 8,
          },
        ]}>
        <Image
          source={icons.receiverIcon}
          style={{
            width: 24,
            height: 24,
            marginRight: 4,
            marginBottom: 4,
          }}
          resizeMode="contain"
        />
        <Text fontFamily="NotoSans" bold fontSize={18}>
          ข้อมูลผู้รับสินค้า
        </Text>
      </View>
      <InputTextForm
        name="receiver"
        label="ชื่อผู้รับ / ชื่อร้าน"
        placeholder="ระบุชื่อผู้รับ / ชื่อร้านค้าที่รับ"
        required
      />
      <InputTextForm
        name="telephone"
        label="เบอร์ติดต่อ"
        placeholder="ระบุเบอร์ติดต่อ"
        required
        maxLength={10}
        keyboardType="phone-pad"
      />
      <View style={[styles.divider]} />
      <View
        style={[
          styles.header,
          {
            marginTop: 8,
            alignItems: 'flex-start',
          },
        ]}>
        <Image
          source={icons.remarkIcon}
          style={{
            width: 24,
            height: 24,
            marginRight: 4,
            marginBottom: 4,
          }}
          resizeMode="contain"
        />
        <View>
          <Text fontFamily="NotoSans" bold fontSize={18}>
            เอกสาร
          </Text>
          <Text fontFamily="NotoSans" medium fontSize={16}>
            อัปโหลดไฟล์ภาพ JPG / PNG สูงสุด 5 ไฟล์
          </Text>
        </View>
      </View>
      {fileDocument.length < 5 && (
        <TouchableOpacity
          style={{
            marginBottom: 8,
          }}
          onPress={onPressAddDocument}
          disabled={fileDocument.length >= 5}>
          <View style={styles.addDocument}>
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
              เพิ่มเอกสาร
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {fileDocument?.map((item: any, idx: number) => {
        return (
          <View style={{ marginTop: 10 }} key={idx}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  maxWidth: '60%',
                  alignItems: 'center',
                }}>
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    marginRight: 20,
                  }}
                />
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {item.fileName}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => viewImage(item.uri)}>
                  <Image
                    source={icons.viewDoc}
                    style={{ width: 25, height: 25, marginRight: 20 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteImage(idx)}>
                  <Image
                    source={icons.binRed}
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <DashedLine
              dashColor={colors.border2}
              dashGap={0}
              dashLength={1}
              style={{
                marginTop: 20,
              }}
              dashThickness={1}
            />
          </View>
        );
      })}
      <View
        style={{
          height: 32,
        }}
      />
      <SubmitButton
        disabled={!isValid}
        title="บันทึก"
        onSubmit={data => {
          onSubmit(data, fileDocument, fileDocumentDel);
        }}
      />
      <View
        style={{
          height: 8,
        }}
      />

      <ModalRN
        animationType="fade"
        onRequestClose={() => {
          setViewUrl('');
        }}
        visible={!!viewUrl}
        transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => {
              setViewUrl('');
            }}>
            <Image
              source={icons.closeBlack}
              style={{ width: 24, height: 24, marginRight: 20 }}
            />
          </TouchableOpacity>
          <View style={[styles.modalView]}>
            <ImageViewer
              minScale={0.5}
              backgroundColor="rgba(0,0,0,0)"
              imageUrls={[{ url: viewUrl }]}
              style={{ width: '100%', height: '100%' }}
              renderIndicator={() => <></>}
              loadingRender={() => (
                <ActivityIndicator
                  animating={true}
                  size={'large'}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                />
              )}
              renderHeader={() => <></>}
            />
          </View>
        </View>
      </ModalRN>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border1,
    marginBottom: 16,
    marginTop: 16,
  },
  addDocument: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  modalView: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20,
    backgroundColor: 'white',

    height: '60%',

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
