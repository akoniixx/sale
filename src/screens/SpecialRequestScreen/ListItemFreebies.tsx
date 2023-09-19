import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageCache from '../../components/ImageCache/ImageCache';
import { getNewPath } from '../../utils/functions';
import CounterSmall from '../CartScreen/CounterSmall';
import Text from '../../components/Text/Text';
import { useCart } from '../../contexts/CartContext';
import images from '../../assets/images';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';

   const ListItemFreebies = () => {
    const { cartList, cartDetail, promotionListValue } = useCart();
    const [loading, setLoading] = useState(false);
    const onIncrease = async (id: string | number) => {
       /*  try {
          setLoading(true);
          const findIndex = cartList?.findIndex(
            item => item?.productId.toString() === id.toString(),
          );
          if (findIndex !== -1) {
            const newCartList = [...cartList];
    
            newCartList[findIndex].amount += 5;
    
            const { cartList: cl, cartDetail: cD } = await postCartItem(
              newCartList,
            );
            await getSelectPromotion(cD.allPromotions);
            setCartList(cl);
          }
        } catch (e) {
          console.log('error', e);
        } finally {
          setLoading(false);
        } */
      };
      const onDecrease = async (id: string | number) => {
       /*  try {
          setLoading(true);
          const findIndex = cartList?.findIndex(
            item => item?.productId.toString() === id.toString(),
          );
          if (findIndex !== -1) {
            const newCartList = [...cartList];
            const amount = newCartList[findIndex].amount;
            if (amount > 5) {
              newCartList[findIndex].amount -= 5;
              const { cartList: cl, cartDetail: cD } = await postCartItem(
                newCartList,
              );
              await getSelectPromotion(cD.allPromotions);
    
              setCartList(cl);
            } else {
              setIsDelCart(true);
    
              const currentCL = reArrangeShipment(
                newCartList.filter(el => el.productId !== id),
              );
    
              const { cartList: cl, cartDetail: cD } = await postCartItem(
                currentCL,
              );
    
              await getSelectPromotion(cD.allPromotions);
              setCartList(cl);
            }
          }
        } catch (error) {
          console.log('error', error);
        } finally {
          setLoading(false);
        } */
      };
    const onChangeText = async ({
        quantity,
        id,
      }: {
        quantity: string;
        id?: any;
      }) => {
        /* setLoading(true);
        const findIndex = cartList?.findIndex(
          item => item?.productId.toString() === id.toString(),
        );
    
        if (+quantity <= 0 && findIndex !== -1) {
          setVisibleDel(true);
          setDelId(id);
        }
        if (findIndex !== -1) {
          try {
            const newCartList = [...cartList];
            newCartList[findIndex].amount = Number(quantity);
            const { cartList: cl, cartDetail: cD } = await postCartItem(
              newCartList,
            );
            await getSelectPromotion(cD.allPromotions);
            setCartList(cl);
          } catch (e) {
            console.log('error', e);
          } finally {
            setLoading(false);
          }
        } */
      };
    
    return (
        <>
        {cartDetail.specialRequestFreebies?.map((item)=>(

<View
key={item.productFreebiesId}
style={{
  marginTop: 16,
}}>
<View style={styles.containerItem}>
  <View style={styles.containerLeft}>
    {item?.productFreebiesImage ? (
      <ImageCache
        uri={getNewPath(item?.productFreebiesImage)}
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
    <View style={styles.itemContent}>
      <Text
        fontFamily="NotoSans"
        fontSize={16}
        bold
        style={{
          width: Dimensions.get('window').width - 150,
        }}
        numberOfLines={1}>
        {item.productName}
      </Text>
      <Text fontFamily="NotoSans" fontSize={14} color="text3">
                      {/* {item.packSize
                        ? `${item.packSize} | ฿${numberWithCommas(
                            +item.marketPrice,
                          )}/${item.saleUOMTH}`
                        : `฿${numberWithCommas(+item.marketPrice)}/${
                            item.saleUOMTH
                          }`} */}
                          {item?.description?item?.description:null}
                    </Text>
     
     
    </View>
  </View>
  <View
    style={{
      flex: 0.3,
      alignItems: 'flex-end',
    }}>
    <TouchableOpacity
      style={styles.buttonDel}
     /*  onPress={() => {
        setDelId(item.productId);
        setVisibleDel(true);
      }} */>
      <Image
        source={icons.bin}
        style={{
          width: 15,
          height: 17,
          marginBottom: 2,
        }}
      />
    </TouchableOpacity>
  </View>
</View>
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
  <View style={{ flexDirection: 'row' }}>
    <View
      style={{
        width: 62,
        marginRight: 10,
      }}
    />
    <CounterSmall
      currentQuantity={item.quantity}
      onChangeText={onChangeText}
      onIncrease={onIncrease}
      onDecrease={onDecrease}
      id={item.productFreebiesId}
    />
  </View>
 
</View>
</View>
        ))} 
        </>
    )
}



export default ListItemFreebies

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
      flex: 0.8,
      alignSelf: 'flex-start',
      justifyContent: 'space-between',
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
    itemContent: {
      alignSelf: 'flex-start',
    },
  });
  