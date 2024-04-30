import React, { useCallback, useEffect, useState } from 'react';
import { MainStackParamList } from '../../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import Header from '../../../components/Header/Header';
import Container from '../../../components/Container/Container';
import Content from '../../../components/Content/Content';
import { colors } from '../../../assets/colors/colors';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../../../components/Text/Text';
import icons from '../../../assets/icons';
import DashedLine from 'react-native-dashed-line';

import Button from '../../../components/Button/Button';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { useCart } from '../../../contexts/CartContext';
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import images from '../../../assets/images';
import {
  DataForOrderLoad,
  DataForReadyLoad,
} from '../../../entities/orderLoadTypes';

import ModalWarning from '../../../components/Modal/ModalWarning';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItemType, cartServices } from '../../../services/CartServices';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { ScrollView } from 'react-native-gesture-handler';
import { ModalDataunloadList } from '../../../components/Modal/ModalDataUnloadList';
import { ModalOnBack } from '../../../components/Modal/ModalOnBack';
import { getNewPath } from '../../../utils/functions';
import { useOrderLoads } from '../../../contexts/OrdersLoadContext';

export default function OrderLoadsScreen({
  route,
  navigation,
}: StackScreenProps<MainStackParamList, 'OrderLoadsScreen'>): JSX.Element {
  const {
    cartList,
    cartOrderLoad,
    cartDetail,
    cartApi: { getCartList },
  } = useCart();

  const {
    state: { user },
  } = useAuth();

  const {
    headData,
    setHeadData,
    dollyData,
    setDollyData,
    dataForLoad,
    setDataForLoad,
    currentList,
    setCurrentList,
    dataReadyLoad,
    setDataReadyLoad,
  } = useOrderLoads();

  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [delId, setDelId] = useState<{ key: string; type: string }>({
    key: '',
    type: '',
  });
  const [modalReset, setModalReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalUnloadList, setModalUnloadList] = useState<boolean>(false);
  const [modalOnBack, setModalOnBack] = useState<boolean>(false);

  useEffect(() => {
    if (dataReadyLoad?.length > 0) {
      const arr2AggregatedQuantities: Record<string, number> =
        dataReadyLoad.reduce((acc, item) => {
          const key = item.productId || item.productFreebiesId;
          if (key) {
            if (!acc[key]) {
              acc[key] = 0;
            }
            // เพิ่มเงื่อนไขเพื่อไม่รวมปริมาณในกรณีเป็น freebie
            if (!item.productFreebiesId) {
              acc[key] += item.quantity;
            }
          }
          return acc;
        }, {});

      // Filter arr2 based on the comparison
      const filteredArr2 = dataReadyLoad.filter(item => {
        const key = item.productId || item.productFreebiesId;
        if (!key) return false; // Skip items without an identifying key

        const arr1Item = cartOrderLoad.find(
          arr1Item =>
            arr1Item.productId === key || arr1Item.productFreebiesId === key,
        );

        if (!arr1Item) return false; // Remove items not found in arr1

        // เพิ่มเงื่อนไขเพื่อไม่รวมปริมาณในกรณีเป็น freebie
        const isFreebie = item.productFreebiesId !== undefined;
        // Check if the aggregated quantity in arr2 exceeds or equals the quantity in arr1
        return isFreebie
          ? true
          : arr2AggregatedQuantities[key] <= arr1Item.quantity;
      });

      const newDataReadyLoad: DataForReadyLoad[] = filteredArr2.map(i => {
        const matchingItem = cartOrderLoad.find(item => {
          if (item.isFreebie) {
            return item.productFreebiesId === i.productFreebiesId;
          } else {
            return item.productId === i.productId;
          }
        });
        if (matchingItem) {
          return {
            ...i,

            amount: matchingItem.quantity - matchingItem.freebieQuantity,
            amountFreebie: matchingItem.freebieQuantity,
          };
        }
        return i;
      });
      /*   console.log(JSON.stringify(newDataReadyLoad)) */
      const { head, dolly } = splitCombinedArray(newDataReadyLoad);
      setHeadData(head);
      setDollyData(dolly);
      setDataForLoad([...head, ...dolly]);
    }
  }, []);

  useEffect(() => {
    const mergedProducts = dataForLoad.reduce(
      (acc: { [key: string]: DataForOrderLoad }, item) => {
        const key =
          item.productId || `freebie_${item.productFreebiesId}` || 'undefined';
        if (acc[key]) {
          acc[key].quantity += item.quantity;
          if (item.isFreebie) {
            acc[key].freebieQuantity =
              (acc[key].freebieQuantity || 0) + item.quantity;
          }
        } else {
          acc[key] = { ...item };
          acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
        }
        return acc;
      },
      {},
    );

    const mergedProductsArray = Object.values(mergedProducts);

    const updatedData = cartOrderLoad.map(item1 => {
      const item2 = mergedProductsArray.find(item => {
        if (item.productFreebiesId) {
          return item.productFreebiesId === item1.productFreebiesId;
        } else {
          return item.productId === item1.productId;
        }
      });
      if (item2) {
        return {
          ...item1,
          quantity: item1.quantity - item2.quantity,
          isSelected: false,
          maxQuantity: item1.quantity - item2.quantity,
          freebieQuantity: item1.freebieQuantity - item2.freebieQuantity,
          amount: item1.quantity - item1.freebieQuantity,
          amountFreebie: item1.freebieQuantity,
        };
      }
      return {
        ...item1,
        quantity: item1.quantity,
        isSelected: false,
        maxQuantity: item1.quantity,
        freebieQuantity: item1.freebieQuantity,
        amount: item1.quantity - item1.freebieQuantity,
        amountFreebie: item1.freebieQuantity,
      };
    });
    console.log(updatedData)
    setCurrentList(updatedData);
  }, [cartOrderLoad, dataForLoad]);

  const onSelectHead = async () => {
    SheetManager.show('selectItemsSheet', {
      payload: {
        id: 'รถแม่',
      },
    });
  };
  const onSelectDolly = async () => {
    const list = await SheetManager.show('selectItemsSheet', {
      payload: {
        id: 'รถลูก',
      },
    });
  };

  const onBack = () => {
    setModalOnBack(false);
    if (dataReadyLoad?.length > 0) {
      navigation.goBack();
    } else {
      setHeadData([]);
      setDollyData([]);
      setDataForLoad([]);
      navigation.goBack();
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
          amount: item.amount,
          amountFreebie: item.amountFreebie,
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

      const orderProducts = (cartList || []).map(item => {
        return {
          specialRequest: item.specialRequest,
          productId: +item.productId,
          quantity: item.amount,
          shipmentOrder: item.order,
        };
      });
      const payload: any = {
        company: company ? company : 'ICPI',
        orderProducts,

        isUseCod: false,
        paymentMethod: 'CREDIT',
        customerCompanyId: customerCompanyId ? +customerCompanyId : 0,
        orderLoads: combinedArray,
        userStaffId: cartDetail.userStaffId,
        specialRequestFreebies: cartDetail?.specialRequestFreebies || [],
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
      currentList.some(item => item.quantity !>= 0 && dataForLoad.length !== 0)
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
          onLongPress={drag}
          style={[styles.rowItem, isActive ? styles.shadow : {}]}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View>
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 3,
                  paddingHorizontal: 9,
                  borderTopLeftRadius: 8,
                }}>
                <Text color="white">{getIndex() + 1}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.background3,
                  borderBottomLeftRadius: 8,
                }}>
                <Image source={icons.drag} style={{ width: 6, height: 14 }} />
              </View>
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
                  {item.isFreebie
                    ? `${item.amountFreebie?.toFixed(2)} ${
                        item?.saleUOMTH || item?.baseUnitOfMeaTh
                      } (ของแถม)`
                    : item.amountFreebie > 0
                    ? `${item.amount?.toFixed(2)} ${
                        item?.saleUOMTH || item?.baseUnitOfMeaTh
                      } + ${item?.amountFreebie?.toFixed(2)} ${
                        item?.saleUOMTH || item?.baseUnitOfMeaTh
                      } (ของแถม)`
                    : `${item.amount?.toFixed(2)} ${
                        item?.saleUOMTH || item?.baseUnitOfMeaTh
                      }`}

                  {/*  {!item?.isFreebie ?( `${item?.maxQuantity - item.freebieQuantity}  ${item?.saleUOMTH || item?.baseUnitOfMeaTh} ${item.freebieQuantity!==0?(`+ ${item?.freebieQuantity} ${item?.saleUOMTH || item?.baseUnitOfMeaTh} (ของแถม)`):(``) }` ): `${item?.maxQuantity} ${item?.saleUOMTH || item?.baseUnitOfMeaTh} ${item?.isFreebie ? '(ของแถม)' : ''}`} */}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>{`${item?.quantity?.toFixed(2)} ${
                    item?.saleUOMTH || item?.baseUnitOfMeaTh
                  }`}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDelId({ key: item?.key, type: item?.type });
                      setModalDelete(true);
                    }}>
                    <View
                      style={{
                        borderWidth: 0.5,
                        borderRadius: 20,
                        alignItems: 'center',
                        paddingRight: 5,
                        padding: 4,
                        paddingBottom: 5,
                        justifyContent: 'center',
                        borderColor: colors.border2,
                      }}>
                      <Image
                        source={icons.bin}
                        style={{ width: 20, height: 20 }}
                      />
                    </View>
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
        title={'ลำดับการขนสินค้า'}
        componentLeft={
          <TouchableOpacity onPress={() => setModalOnBack(true)}>
            <Image
              source={icons.backIcon}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        }
        componentRight={
          <TouchableOpacity onPress={() => setModalReset(true)}>
            <Text fontSize={16} fontFamily="NotoSans" color="primary">
              ล้าง
            </Text>
          </TouchableOpacity>
        }
      />
      <Content
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 10,
        }}>
        <NestableScrollContainer showsVerticalScrollIndicator={false}>
          <View>
            <Text semiBold fontFamily="NotoSans" fontSize={18}>
              รายการจัดเรียงสินค้าขึ้นรถ
            </Text>

            {renderItemListUnsort()}
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
          />
          {!currentList.every(Item => Item.quantity === 0) && (
            <TouchableOpacity style={styles.addButton} onPress={onSelectHead}>
              <Image
                source={icons.iconAddWhite}
                style={{ width: 20, height: 20 }}
              />
              <Text fontFamily="NotoSans" fontSize={14} color="white">
                เพิ่มสินค้ารถแม่
              </Text>
            </TouchableOpacity>
          )}
          {currentList.every(Item => Item.quantity === 0) &&
            dollyData.length > 0 &&
            headData.length <= 0 && (
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
          {!currentList.every(Item => Item.quantity === 0) && (
            <TouchableOpacity style={styles.addButton} onPress={onSelectDolly}>
              <Image
                source={icons.iconAddWhite}
                style={{ width: 20, height: 20 }}
              />
              <Text fontFamily="NotoSans" fontSize={14} color="white">
                เพิ่มสินค้ารถลูก
              </Text>
            </TouchableOpacity>
          )}
          {currentList.every(Item => Item.quantity === 0) &&
            headData.length > 0 &&
            dollyData.length <= 0 && (
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
      <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
        <Button
          title="บันทึก"
          onPress={onSubmit}
          disabled={!currentList.every(Item => Item.quantity === 0)}
        />
      </View>
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
    borderWidth: 0.5,
    borderColor: colors.border2,
    borderRadius: 8,
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
