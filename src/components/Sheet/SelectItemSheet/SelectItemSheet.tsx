import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet, {
  SheetManager,
  SheetProps,
  useScrollHandlers,
} from 'react-native-actions-sheet';
import Text from '../../Text/Text';
import Button from '../../Button/Button';
import icons from '../../../assets/icons';
import DashedLine from 'react-native-dashed-line';
import { colors } from '../../../assets/colors/colors';
import images from '../../../assets/images';

import CounterSmall from '../../../screens/CartScreen/CounterSmall';
import { DataForOrderLoad } from '../../../entities/orderLoadTypes';
import { useOrderLoads } from '../../../contexts/OrdersLoadContext';
import { useCart } from '../../../contexts/CartContext';
import uuid from 'react-native-uuid';
import CounterOrderLoads from '../../../screens/CartScreen/OrderLoadsScreen/CounterOrderLoads';
import { getNewPath } from '../../../utils/functions';


export const SelectItemsSheet = (props: SheetProps) => {
  const {
    cartOrderLoad,
  } = useCart();


  const type: 'รถแม่' | 'รถลูก' = props.payload.id
  const { dataForLoad,
    setDataForLoad,
    currentList,
    setCurrentList,
    setHeadData,
    headData,
    dollyData,
    setDollyData
  } = useOrderLoads();
  /* const [currentList, setCurrentList] = useState<SelectDataForOrderLoad[]>([]);
 */


  useEffect(() => {
    const mergedProducts = dataForLoad.reduce((acc: { [key: string]: DataForOrderLoad }, item) => {
      const key = item.productId || `freebie_${item.productFreebiesId}` || 'undefined';
      if (acc[key]) {
        acc[key].quantity += item.quantity;
        if (item.isFreebie) {
          acc[key].freebieQuantity = (acc[key].freebieQuantity || 0) + item.quantity;
        }
      } else {
        acc[key] = { ...item };
        acc[key].freebieQuantity = item.isFreebie ? item.quantity : 0;
      }
      return acc;
    }, {});

    const mergedProductsArray = Object.values(mergedProducts);


    const updatedData = cartOrderLoad.map((item1) => {

      const item2 = mergedProductsArray.find((item) => {
        if (item.productFreebiesId) {

          return item.productFreebiesId === item1.productFreebiesId
        } else {
          return item.productId === item1.productId
        }
      }
      );
      if (item2) {
        return {
          ...item1, quantity: item1.quantity - item2.quantity,
          isSelected: false,
          maxQuantity: item1.quantity - item2.quantity,
          freebieQuantity: item1.freebieQuantity - item2.freebieQuantity,
          amount: item1.quantity - item1.freebieQuantity,
          amountFreebie: item1.freebieQuantity
        };
      }
      return {
        ...item1, quantity: item1.quantity,
        isSelected: false,
        maxQuantity: item1.quantity,
        freebieQuantity: item1.freebieQuantity,
        amount: item1.quantity - item1.freebieQuantity,
        amountFreebie: item1.freebieQuantity
      }
    });
    /* console.log(updatedData) */
    setCurrentList(updatedData);

  }, [cartOrderLoad, dataForLoad])



  const onIncrease = (productId: string) => {
    setCurrentList(currentList => currentList.map(item => {
      if (item.productId === productId && item.quantity < item?.maxQuantity || item.productFreebiesId === productId ) {
        if( item.quantity+1 <= item?.maxQuantity){
          return { ...item, quantity: item.quantity + 1 };
        }
       
      }
      return item;
    }));
  };
  const onDecrease = (productId: string) => {
    setCurrentList(currentList => currentList.map(item => {
      if (item.productId === productId && item.quantity > 1 || item.productFreebiesId === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  const handleSelectItem = (item: DataForOrderLoad) => {
    setCurrentList((currentList: any[]) => currentList.map(cur => {
      if (item.isFreebie) {
        if (cur.productFreebiesId === item.productFreebiesId) {
          return {
            ...cur,
            isSelected: !cur.isSelected,
            key: uuid.v4(),
            type: type === 'รถแม่' ? 'head' : 'dolly'
          };
        }
      } else {
        if (cur.productId === item.productId) {
          return {
            ...cur,
            isSelected: !cur.isSelected,
            key: uuid.v4(),
            type: type === 'รถแม่' ? 'head' : 'dolly'
          };
        }
      }
      return cur;
    }));



  };
  const onSubmit = () => {
    const selectedItems = currentList.filter(item => item.isSelected);

    if (!selectedItems.length) {
      // Handle the case where no items are selected, if necessary
      return;
    }

    // Update dataForLoad state regardless of the type
    setDataForLoad(prevDataForLoad => [...prevDataForLoad, ...selectedItems]);

    // Conditional state update based on type
    const updateState = type === 'รถแม่' ? setHeadData : setDollyData;
    updateState(prevData => [...prevData, ...selectedItems]);

    // Hide the action sheet with selected items as payload
    SheetManager.hide('selectItemsSheet', {
      payload: { data: selectedItems },
    });
  };

  const onChangeText = async ({
    id,
    quantity,
  }: {
    quantity: string;
    id?: any;
  }) => {
   
    setCurrentList(currentList => currentList.map(item => {
      if (item.productId === id || item.productFreebiesId === id  ) {
        if(quantity <= item.maxQuantity&&+quantity>0&&quantity!==''){
          return {
            ...item,
            quantity: parseFloat(quantity),
          };
        }else{
          return{
            ...item
          }
        }
       
      }
      return item;
    }))

  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

 useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return (
    <ActionSheet containerStyle={{
      height: '90%',

    }}>
   
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
      
          <View style={{ flex:1,marginTop: 20 }}>
            <View style={{ paddingHorizontal: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={icons.trailer_head}
                  style={{ width: 28, height: 28, marginRight: 10 }}
                />
                <View >
                  <Text semiBold lineHeight={30} fontSize={18}>เพิ่มสินค้าขึ้น{props.payload.id}</Text>
                  <Text>เลือกและระบุจำนวนสินค้าอย่างน้อย 1 รายการ</Text>
                </View>
              </View>
            </View>
            <DashedLine
              dashGap={0}
              dashThickness={0.5}
              dashColor={colors.border2}
              style={{ marginVertical: 20 }}
            />
            <View style={{ paddingHorizontal: 10 }}>
              {currentList.filter(item => item.quantity > 0).map((item, idx) => {

                return (
                  <View
                    key={idx}
                    style={{
                      marginTop: 16,
                    }}>
                    <View style={styles.containerItem}>
                      <View style={styles.containerLeft}>
                        <TouchableOpacity
                          onPress={() => handleSelectItem(item)}>
                          <Image
                            source={
                              item?.isSelected ? icons.checkbox : icons.uncheckbox
                            }
                            style={{ width: 20, height: 20 }}
                          />
                        </TouchableOpacity>
                        {item?.productImage ? (
                          <Image
                            source={{ uri: getNewPath(item?.productImage) }}
                            style={{
                              width: 62,
                              height: 62,
                              marginRight: 10,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: 62,
                              height: 62,
                              marginRight: 10,
                            }}>
                            <Image
                              style={{
                                width: 56,
                                height: 56,
                              }}
                              source={images.emptyProduct}
                            />
                          </View>
                        )}
                        <View>
                          <Text
                            fontFamily="NotoSans"
                            fontSize={16}
                            bold
                            style={{
                              width: Dimensions.get('window').width - 150,
                            }}
                            numberOfLines={1}>
                            {item?.productName}
                          </Text>
                          <Text fontSize={14} color='text2'> {item.isFreebie ? `${item.amountFreebie?.toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh} (ของแถม)`: item.amountFreebie>0? `${item.amount?.toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh} + ${item?.amountFreebie?.toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh} (ของแถม)`:`${item.amount?.toFixed(2)} ${item?.saleUOMTH || item?.baseUnitOfMeaTh}`}</Text>
                          <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
                            <CounterOrderLoads
                              currentQuantity={item.quantity}
                              onChangeText={onChangeText}
                              onIncrease={() => onIncrease(item.productId || item.productFreebiesId)}
                              onDecrease={() => onDecrease(item.productId || item.productFreebiesId)}
                              id={item.productId || item.productFreebiesId}
                              disable={!item?.isSelected}
                              maxQuantity={+item.maxQuantity}
                            />
                            {item.isSelected &&
                              <Text color={item?.maxQuantity - item?.quantity > 0 ? 'secondary' : 'text3'}>คงเหลือ {(item?.maxQuantity - item?.quantity).toFixed(2)} {item?.saleUOMTH || item?.baseUnitOfMeaTh}</Text>
                            }
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
         
        </ScrollView>
       
      {!isKeyboardVisible&& <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
          <Button
            secondary
            title="ยกเลิก"
            style={{ width: '45%' }}
            onPress={() => SheetManager.hide('selectItemsSheet')}
          />
          <Button
            title="ยืนยันการเพิ่ม"
            style={{ width: '45%' }}
            onPress={onSubmit}
            disabled={!currentList.some(item => item.isSelected)}
          />
        </View>}
       
        


    </ActionSheet>
  );
};

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
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonDel: {
    width: 26,
    height: 26,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
