import React, { useCallback, useEffect, useState } from 'react';

import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import DashedLine from 'react-native-dashed-line';

import { SheetManager } from 'react-native-actions-sheet';

import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';

import Text from '../../components/Text/Text';
import icons from '../../assets/icons';
import images from '../../assets/images';

import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';
import Button from '../../components/Button/Button';
import ModalWarning from '../../components/Modal/ModalWarning';
import { ModalDataunloadList } from '../../components/Modal/ModalDataUnloadList';
import { ModalOnBack } from '../../components/Modal/ModalOnBack';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../contexts/CartContext';
import { useNavigation } from '@react-navigation/native';
import {
  DataForOrderLoad,
  DataForReadyLoad,
} from '../../entities/orderLoadTypes';
import { cartServices } from '../../services/CartServices';
import { getNewPath } from '../../utils/functions';

export default function EditOrderLoadsScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'EditOrderLoadsScreen'>): JSX.Element {
  const {
    cartList,

    cartApi: { getCartList },
  } = useCart();

  const {
    state: { user },
  } = useAuth();
  const params = route.params;
  const dataOrder = params.orderProducts;
  const navigationReft = useNavigation();
  const [dataReadyLoad, setDataReadyLoad] = useState<DataForReadyLoad[]>([]);
  const [headData, setHeadData] = useState<DataForOrderLoad[]>([]);
  const [dollyData, setDollyData] = useState<DataForOrderLoad[]>([]);
  const [dataForLoad, setDataForLoad] = useState<DataForOrderLoad[]>([]);
  const [currentList, setCurrentList] = useState<DataForOrderLoad[]>([]);

  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [delId, setDelId] = useState<{ key: string; type: string }>({
    key: '',
    type: '',
  });
  const [modalReset, setModalReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalUnloadList, setModalUnloadList] = useState<boolean>(false);
  const [modalOnBack, setModalOnBack] = useState<boolean>(false);
  const [cartOrderLoad, setCartOrderLoad] = useState<DataForOrderLoad[]>([]);

  useEffect(() => {
    if (params.orderLoads) {
      const { head, dolly } = splitCombinedArray(params.orderLoads);
      setHeadData(head);
      setDollyData(dolly);
      setDataForLoad([...head, ...dolly]);
    }
  }, []);

  useEffect(() => {
    const processedData: DataForOrderLoad[] = dataForLoad?.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      productName: item.productName,
      saleUOMTH: item.saleUOMTH,
      productImage: item.productImage,
      baseUnitOfMeaTh: item.baseUnitOfMeaTh,
      productFreebiesId: item.productFreebiesId,
      isFreebie: item.isFreebie,
    }));

    const mergedProducts = processedData.reduce(
      (acc: { [key: string]: DataForOrderLoad }, processedData) => {
        const key = processedData.productId ?? 'undefined';
        if (acc[key]) {
          acc[key] = {
            ...acc[key],
            quantity: acc[key].quantity + processedData.quantity,
          };
        } else {
          acc[key] = { ...processedData };
        }
        return acc;
      },
      {},
    );
    const mergedProductsArray = Object.values(mergedProducts);

    const updatedData = dataForLoad.map(item1 => {
      const item2 = mergedProductsArray.find(
        item => item.productId === item1.productId,
      );
      if (item2) {
        return {
          ...item1,
          quantity: item1.quantity - item2.quantity,
          isSelected: false,
          maxQuantity: item1.quantity - item2.quantity,
        };
      }
      return {
        ...item1,
        quantity: item1.quantity,
        isSelected: false,
        maxQuantity: item1.quantity,
      };
    });

    setCartOrderLoad(updatedData);
    setCurrentList(updatedData);
  }, [dataForLoad]);

  const onSelectHead = async () => {
    const list = await SheetManager.show('editSelectItemsSheet', {
      payload: {
        id: 'รถแม่',
        data: currentList,
      },
    });
    if (list) {
      setHeadData(list);
    }
  };
  const onSelectDolly = async () => {
    const list = await SheetManager.show('editSelectItemsSheet', {
      payload: {
        id: 'รถลูก',
        data: currentList,
      },
    });
    if (list) {
      setDollyData(list);
    }
  };

  const reset = useCallback(() => {
    setHeadData([]);
    setDollyData([]);
    setDataForLoad([]);
    setCurrentList([]);
    setModalReset(false);
  }, [setHeadData, setDollyData, setDataForLoad, setCurrentList]);

  const onDelete = (keyId: string, type: string) => {
    if (type === 'head') {
      setHeadData(() => headData?.filter(item => item?.key !== keyId));
      setDataForLoad(() => dataForLoad?.filter(item => item?.key !== keyId));
    } else {
      setDollyData(() => dollyData?.filter(item => item?.key !== keyId));
      setDataForLoad(() => dataForLoad?.filter(item => item?.key !== keyId));
    }
    setModalDelete(false);
  };

  const onBack = () => {
    setModalOnBack(false);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const combineArrays = (
    head: DataForOrderLoad[],
    dolly: DataForOrderLoad[],
  ): DataForReadyLoad[] => {
    const combined: DataForReadyLoad[] = [];

    const processArray = (array: DataForOrderLoad[], truckType: string) => {
      array.forEach((item, index) => {
        const newItem: DataForReadyLoad = {
          key: item.key,
          productName: item.productName,
          truckType: truckType,
          deliveryNo: index + 1,
          quantity: item.quantity,
          unit: item.saleUOMTH || item.baseUnitOfMeaTh,
          productImage: item.productImage,
          freebieQuantity: item.freebieQuantity,
        };
        if (item.productId) newItem.productId = item.productId;
        if (item.productFreebiesId) {
          newItem.productFreebiesId = item.productFreebiesId;
        }

        combined.push(newItem);
      });
    };

    processArray(head, 'FRONT_TRUCK');
    processArray(dolly, 'REAR_TRUCK');

    return combined;
  };

  const splitCombinedArray = (
    combinedArray: DataForReadyLoad[],
  ): { head: DataForOrderLoad[]; dolly: DataForOrderLoad[] } => {
    const head: DataForOrderLoad[] = [];
    const dolly: DataForOrderLoad[] = [];

    combinedArray.forEach(item => {
      const originalItem: DataForOrderLoad = {
        key: item.key,
        productName: item.productName,
        quantity: item.quantity,
        productId: item.productId,
        productImage: item.productImage,
        baseUnitOfMeaTh: item.unit,
        saleUOMTH: item.unit,
        freebieQuantity: item.freebieQuantity,
        maxQuantity: item.quantity,
        amount: item.amount,
        amountFreebie: item.amountFreebie,
      };

      // Assign productId and productFreebiesId if they exist
      if (item.productId) originalItem.productId = item.productId;
      if (item.productFreebiesId) {
        originalItem.productFreebiesId = item.productFreebiesId;
      }
      if (item.productFreebiesId) {
        originalItem.isFreebie = true;
      } else {
        originalItem.isFreebie = false;
      }
      if (item.truckType === 'FRONT_TRUCK') {
        originalItem.type = 'head';
      } else {
        originalItem.type = 'dolly';
      }
      // Determine the unit type and assign it to either baseUnitOfMeaTh or saleUOMTH

      // Add the item to the appropriate array based on its truckType
      if (item.truckType === 'FRONT_TRUCK') {
        head.push(originalItem);
      } else if (item.truckType === 'REAR_TRUCK') {
        dolly.push(originalItem);
      }
    });

    return { head, dolly };
  };

  const onSubmit = async () => {
    const combinedArray = combineArrays(headData, dollyData);
    setModalOnBack(false);

    try {
      setLoading(true);
      const company = await AsyncStorage.getItem('company');

      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');

      const orderProducts = cartList.map(el => {
        return {
          ...el,
          specialRequest: 0,
        };
      });
      const payload = {
        company: company ? company : 'ICPI',
        orderProducts,
        userShopId: user?.userShopId || '',
        isUseCod: false,
        paymentMethod: 'CREDIT',
        customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
        orderLoads: combinedArray,
      };

      const res = await cartServices.postCart(payload);
      setDataReadyLoad(res.orderLoads);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItemListUnsort = () => {
    if (
      currentList.some(item => item.quantity !== 0 && dataForLoad.length !== 0)
    ) {
      const remainingItems = currentList.filter(
        item => item.quantity > 0,
      ).length;
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={icons.box}
                style={{ width: 16, height: 16, marginRight: 10 }}
              />
              <Text fontSize={14} style={{ color: '#FF8824' }}>
                เหลือสินค้ายังไม่ได้ขึ้นรถอีก {remainingItems}/
                {currentList.length} รายการ
              </Text>
            </View>

            <TouchableOpacity onPress={() => setModalUnloadList(true)}>
              <Text
                fontSize={14}
                style={{ color: '#FF8824', textDecorationLine: 'underline' }}>
                ดูสินค้า
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.tooltip}
              style={{ width: 16, height: 16, marginRight: 10 }}
            />
            <Text fontSize={14} color="text3">
              เรียงลำดับสินค้าในรถ: กดไอคอน
            </Text>
            <Image
              source={icons.drag}
              style={{ width: 16, height: 16 }}
              resizeMode="contain"
            />
            <Text fontSize={14} color="text3">
              ค้างและลาก
            </Text>
          </View>
        </View>
      );
    } else if (dataForLoad.length > 0) {
      return (
        <View>
          <Text fontSize={14} style={{ color: '#3BA133' }}>
            เพิ่มสินค้าครบเรียบร้อย
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.tooltip}
              style={{ width: 16, height: 16, marginRight: 10 }}
            />
            <Text fontSize={14} color="text3">
              เรียงลำดับสินค้าในรถ: กดไอคอน
            </Text>
            <Image
              source={icons.drag}
              style={{ width: 16, height: 16 }}
              resizeMode="contain"
            />
            <Text fontSize={14} color="text3">
              ค้างและลาก
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Text fontFamily="NotoSans" fontSize={14} color="text3">
        สินค้าที่ต้องเพิ่มขึ้นรถทั้งหมด {cartOrderLoad.length} รายการ
      </Text>
    );
  };

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<DataForOrderLoad>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          /* onLongPress={drag} */
          style={[styles.rowItem, isActive ? styles.shadow : {}]}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View>
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 3,
                  paddingHorizontal: 9,
                  borderRadius: 8,
                }}>
                <Text color="white">{getIndex() + 1}</Text>
              </View>
              {/*  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background3, borderBottomLeftRadius: 8 }}>
                <Image source={icons.drag} style={{ width: 6, height: 14 }} />
              </View> */}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
              {item?.productImage ? (
                <Image
                  source={{ uri: getNewPath(item?.productImage) }}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  style={{
                    width: 64,
                    height: 64,
                  }}
                  source={images.emptyProduct}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text
                  fontSize={16}
                  lineHeight={24}
                  ellipsizeMode="tail"
                  numberOfLines={1}>
                  {item?.productName?.length > 45
                    ? item?.productName.substring(0, 45 - 3) + '...'
                    : item.productName}
                </Text>
                <Text fontSize={14} color="text2">
                {item.isFreebie ? `${parseFloat(item?.amountFreebie).toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh} (ของแถม)`: item.amountFreebie>0? `${parseFloat(item.amount).toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh} + ${parseFloat(item.amountFreebie).toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh}  (ของแถม)`:`${parseFloat(item.amount).toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh}`}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>{`${parseFloat(item?.quantity).toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh}`}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDelId({ key: item?.key, type: item?.type });
                      setModalDelete(true);
                    }}>
                    {/*  <View style={{ borderWidth: 0.5, borderRadius: 20, alignItems: 'center', paddingRight: 5, padding: 4, paddingBottom: 5, justifyContent: 'center', borderColor: colors.border2 }}>
                      <Image source={icons.bin} style={{ width: 20, height: 20 }} />
                    </View> */}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <Container>
      <Header
        title={
          'ลำดับการขนสินค้า'
        } /* componentLeft={<TouchableOpacity onPress={()=>setModalOnBack(true)} >
        <Image
            source={icons.BackIcon}
            style={{
              width: 24,
              height: 24,
            }}
          />
      </TouchableOpacity>}
       componentRight={<TouchableOpacity onPress={() => setModalReset(true)} >
        <Text fontSize={16} fontFamily='NotoSans' color='text3' >รีเซ็ท</Text>
      </TouchableOpacity>} */
      />
      <Content
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 10,
        }}>
        <NestableScrollContainer showsVerticalScrollIndicator={false}>
          <View>
            <Text semiBold fontFamily="NotoSans" fontSize={18}>
              รายการการขนสินค้าขึ้นรถ
            </Text>

            {/*   {renderItemListUnsort()} */}
          </View>
          <View style={{ marginVertical: 20 }}>
            <View style={styles.trailerIcon}>
              <Image
                source={icons.trailer_head}
                style={{ width: 28, height: 28, marginRight: 10 }}
              />
              <Text>รถแม่</Text>
            </View>
            <DashedLine
              dashThickness={1}
              dashGap={0}
              dashColor={colors.border1}
            />
          </View>

          <NestableDraggableFlatList
            data={headData}
            renderItem={renderItem}
            keyExtractor={(i, idx) => i.key}
            onDragEnd={({ data }) => setHeadData([...data])}
            d
          />
          {/* {!currentList.every(Item => Item.quantity === 0) &&
            <TouchableOpacity style={styles.addButton} onPress={onSelectHead}>
              <Image source={icons.iconAddWhite} style={{ width: 20, height: 20 }} />
              <Text fontFamily='NotoSans' fontSize={14} color="white">เพิ่มสินค้ารถแม่</Text>
            </TouchableOpacity>
          } */}
          {dollyData.length > 0 && headData.length <= 0 && (
            <View
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                alignItems: 'center',
              }}>
              <Image
                source={images.emptyProduct}
                style={{ width: 80, height: 80 }}
              />
              <Text fontFamily="NotoSans" fontSize={16} color="text3">
                ไม่มีสินค้าขึ้นรถแม่
              </Text>
            </View>
          )}

          <View style={{ marginVertical: 20 }}>
            <View style={styles.trailerIcon}>
              <Image
                source={icons.trailer_dolly}
                style={{ width: 28, height: 28, marginRight: 10 }}
              />
              <Text>รถลูก</Text>
            </View>
            <DashedLine
              dashThickness={1}
              dashGap={0}
              dashColor={colors.border1}
            />
          </View>

          <NestableDraggableFlatList
            data={dollyData}
            renderItem={renderItem}
            keyExtractor={(i, idx) => i.key}
            onDragEnd={({ data }) => setDollyData([...data])}
          />
          {/*  {!currentList.every(Item => Item.quantity === 0) &&
            <TouchableOpacity style={styles.addButton} onPress={onSelectDolly}>
              <Image source={icons.iconAddWhite} style={{ width: 20, height: 20 }} />
              <Text fontFamily='NotoSans' fontSize={14} color="white">เพิ่มสินค้ารถลูก</Text>
            </TouchableOpacity>} */}
          {headData.length > 0 && dollyData.length <= 0 && (
            <View
              style={{
                alignSelf: 'center',
                marginVertical: 20,
                alignItems: 'center',
              }}>
              <Image
                source={images.emptyProduct}
                style={{ width: 80, height: 80 }}
              />
              <Text fontFamily="NotoSans" fontSize={16} color="text3">
                ไม่มีสินค้าขึ้นรถลูก
              </Text>
            </View>
          )}
        </NestableScrollContainer>
      </Content>
      {/* <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
        <Button title="บันทึก"
          onPress={onSubmit}
          disabled={!currentList.every(Item => Item.quantity === 0)}
        />
      </View> */}
      <ModalWarning
        visible={modalDelete}
        width={'60%'}
        title="ยืนยันการลบสินค้า"
        desc="ต้องการยืนยันการลบสินค้าใช่หรือไม่ ?"
        onConfirm={() => onDelete(delId.key, delId.type)}
        minHeight={60}
        onRequestClose={() => setModalDelete(false)}
        titleCenter
      />
      <ModalWarning
        visible={modalReset}
        width={'60%'}
        title="ยืนยันคืนค่าเริ่มต้น"
        desc={`ต้องการยืนยันคืนค่าเริ่มต้นลำดับการขน\nสินค้าใช่หรือไม่ ?`}
        onConfirm={() => reset()}
        minHeight={60}
        onRequestClose={() => setModalReset(false)}
        titleCenter
      />

      <ModalDataunloadList
        currentList={currentList}
        setModalUnloadList={setModalUnloadList}
        modalUnloadList={modalUnloadList}
      />
      <ModalOnBack
        setModalOnBack={setModalOnBack}
        modalOnback={modalOnBack}
        onSubmit={onSubmit}
        onBack={onBack}
      />
      <LoadingSpinner visible={loading} />
    </Container>
  );
}

const styles = StyleSheet.create({
  trailerIcon: {
    flexDirection: 'row',
    backgroundColor: 'rgba(76, 149, 255, 0.16)',
    width: 90,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border2,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderBottomWidth: 0,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    marginVertical: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  rowItem: {
    /*  borderWidth: 0.5,
    borderColor: colors.border2,
    borderRadius: 8, */
    marginVertical: 6,
    height: 100,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 5.22,

    elevation: 3,
  },
});
