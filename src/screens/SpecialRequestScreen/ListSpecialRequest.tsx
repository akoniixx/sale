import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useEffect } from 'react';
import { newProductType, useCart } from '../../contexts/CartContext';
import { colors } from '../../assets/colors/colors';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import ImageCache from '../../components/ImageCache/ImageCache';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import icons from '../../assets/icons';
import Button from '../../components/Button/Button';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

interface Props {
  item: newProductType;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ListSpecialRequest({
  item,
  setIsShow,
}: Props): JSX.Element {
  const alreadyHaveSpecialRequest = item.specialRequestDiscount > 0;
  const [loading, setLoading] = React.useState(false);
  const [isShowInput, setIsShowInput] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [specialRequestValue, setSpecialRequestValue] = React.useState('');
  const {
    cartList,
    setCartList,
    cartApi: { postCartItem, getCartList },
  } = useCart();
  const onRemoveSpecialRequest = async ({ id }: { id: string }) => {
    const findIndex = cartList.findIndex(el => el.productId === id);
    const newCartList = [...cartList];
    try {
      setLoading(true);
      const payload = [
        ...newCartList.slice(0, findIndex),
        {
          ...newCartList[findIndex],
          specialRequest: 0,
        },
        ...newCartList.slice(findIndex + 1),
      ];
      const result = await postCartItem(payload);
      await getCartList();
      setCartList(result);
      return null;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (alreadyHaveSpecialRequest) {
      setSpecialRequestValue(item.specialRequest.toString());
    }
  }, []);
  const onConfirmSpecialRequest = async ({ id }: { id: string }) => {
    const findIndex = cartList.findIndex(el => el.productId === id);
    const newCartList = [...cartList];
    const isSpecialRequestHighMoreThanPrice =
      +specialRequestValue > +item.marketPrice;
    if (isSpecialRequestHighMoreThanPrice) {
      return setError('*ราคาส่วนลดพิเศษสูงกว่าราคาขาย');
    }
    if (specialRequestValue.length === 0) {
      return setError('*กรุณาระบุส่วนลดพิเศษ');
    }
    if (+specialRequestValue === item.specialRequest) {
      setIsShowInput(false);
      return;
    }
    if (specialRequestValue.length > 0 && !isSpecialRequestHighMoreThanPrice) {
      const payload = [
        ...newCartList.slice(0, findIndex),
        {
          ...newCartList[findIndex],
          specialRequest: +specialRequestValue,
        },
        ...newCartList.slice(findIndex + 1),
      ];
      try {
        setLoading(true);
        const { cartList: cl } = await postCartItem(payload);
        await getCartList();
        setCartList(cl);
        setIsShowInput(false);

        return null;
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.topStyle}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {item?.productImage ? (
            <ImageCache
              uri={getNewPath(item?.productImage)}
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
            <Text>{item?.productName}</Text>
            <Text color="text3">{`฿ ${numberWithCommas(
              item?.totalPrice,
            )}`}</Text>
          </View>
        </View>
        <View>
          <Text>{`${item?.amount}x (${item.saleUomTH || item.saleUom})`}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.promotionSpecial}
              style={{
                width: 24,
                height: 24,
                marginRight: 8,
              }}
            />
            <Text fontFamily="NotoSans" semiBold fontSize={14}>
              ส่วนลดพิเศษ
            </Text>
          </View>
          {alreadyHaveSpecialRequest && !isShowInput ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsShowInput(true);
                }}>
                <Text color="primary">แก้ไข</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await onRemoveSpecialRequest({ id: item.productId });
                }}
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border1,
                  marginLeft: 8,
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.binBlack}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setIsShowInput(false);
                setSpecialRequestValue('');
                setError(null);
              }}
              style={{
                display: isShowInput ? 'flex' : 'none',
              }}>
              <Text color="primary">ยกเลิก</Text>
            </TouchableOpacity>
          )}
        </View>

        <>
          {isShowInput ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 16,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: !!error ? colors.error : colors.border1,
                  paddingHorizontal: 16,
                  flex: 0.78,
                  borderRadius: 8,
                }}>
                <TextInput
                  keyboardType="numeric"
                  onFocus={() => {
                    setIsShow(false);
                  }}
                  onChangeText={text => {
                    const convertText = text.replace(/[^0-9]/g, '');
                    setError(null);
                    setSpecialRequestValue(convertText);
                  }}
                  value={numberWithCommas(specialRequestValue).toString()}
                  placeholderTextColor={colors.text3}
                  style={{
                    flex: 0.7,
                    height: 40,
                    fontFamily: 'Sarabun-Medium',
                  }}
                  placeholder="ระบุส่วนลดพิเศษ"
                />

                <Text
                  fontFamily="NotoSans"
                  bold
                  fontSize={14}
                  style={{
                    flex: 0.3,
                    textAlign: 'right',
                  }}>
                  {`฿/${item?.saleUomTH || item?.saleUom}`}
                </Text>
              </View>
              <Button
                title="ยืนยัน"
                style={{
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 0,
                }}
                onPress={() => {
                  onConfirmSpecialRequest({ id: item?.productId });
                }}
              />
            </View>
          ) : (
            <>
              {alreadyHaveSpecialRequest ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    backgroundColor: colors.background1,
                    borderColor: !!error ? colors.error : colors.border1,
                    paddingHorizontal: 16,
                    flex: 1,
                    height: 40,
                    marginTop: 16,
                    borderRadius: 8,
                    width: '100%',
                  }}>
                  <Text>{`฿ ${numberWithCommas(item.specialRequest)}`}</Text>
                  <Text
                    fontFamily="NotoSans"
                    bold
                    fontSize={14}
                    style={{
                      textAlign: 'right',
                    }}>
                    {`/${item?.saleUomTH || item?.saleUom}`}
                  </Text>
                </View>
              ) : (
                <Button
                  onPress={() => setIsShowInput(true)}
                  secondary
                  title="กดเพื่อระบุส่วนลด"
                  style={{
                    marginTop: 16,
                    height: 40,
                    paddingVertical: 0,
                  }}
                />
              )}
            </>
          )}
          {error && <Text color="error">{error}</Text>}
        </>
      </View>
      <LoadingSpinner visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    marginVertical: 8,
  },
  topStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    padding: 16,
    borderColor: colors.background2,
  },
  card: {
    borderColor: colors.background3,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 32,
  },
});
