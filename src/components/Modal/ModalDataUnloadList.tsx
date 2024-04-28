import { Image, Modal, ScrollView, View } from 'react-native';
import DashedLine from 'react-native-dashed-line';
import { colors } from '../../assets/colors/colors';
import Button from '../Button/Button';
import Text from '../Text/Text';
import images from '../../assets/images';

import { DataForOrderLoad } from '../../entities/orderLoadTypes';
import React from 'react';
import { getNewPath } from '../../utils/functions';

interface props {
  currentList: DataForOrderLoad[];
  setModalUnloadList: (value: boolean) => void;
  modalUnloadList: boolean;
}

export const ModalDataunloadList = ({
  currentList,
  setModalUnloadList,
  modalUnloadList,
}: props) => {
  return (
    <Modal
      animationType="fade"
      onRequestClose={() => setModalUnloadList(false)}
      visible={modalUnloadList}
      transparent>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 15,
            width: '90%',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            maxHeight: '70%',
          }}>
          <View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text fontSize={18} fontFamily="NotoSans" semiBold>
                สินค้าที่ยังไม่ได้นำขึ้นรถ
              </Text>
              <Text color="secondary">
                {currentList.filter(item => item.quantity > 0).length}/
                {currentList.length} รายการ
              </Text>
            </View>
            <DashedLine
              dashGap={0}
              dashThickness={0.5}
              dashColor={colors.border2}
              style={{ marginBottom: 20 }}
            />
            <ScrollView style={{ maxHeight: '70%' }}>
              <View style={{ paddingHorizontal: 10 }}>
                {currentList
                  .filter(item => item.quantity > 0)
                  .map(item => (
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View
                        style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
                        <View style={{ marginRight: 20 }}>
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
                        </View>
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
                              ? `${item.amountFreebie.toFixed(2)} ${
                                  item?.saleUOMTH || item?.baseUnitOfMeaTh
                                }`
                              : item.amountFreebie > 0
                              ? `${item.amount.toFixed(2)} + ${item.amountFreebie.toFixed(2)} ${
                                  item?.saleUOMTH || item?.baseUnitOfMeaTh
                                }`
                              : `${item.amount.toFixed(2)} ${
                                  item?.saleUOMTH || item?.baseUnitOfMeaTh
                                }`}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text>{`${item?.quantity.toFixed(2)} ${
                              item?.saleUOMTH || item?.baseUnitOfMeaTh
                            }`}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>
            <DashedLine
              dashGap={0}
              dashThickness={0.5}
              dashColor={colors.border2}
              style={{ marginTop: 20 }}
            />
            <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
              <Button title="ปิด" onPress={() => setModalUnloadList(false)} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
