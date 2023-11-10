import { View, StyleSheet, Image, TouchableOpacity, ScrollView,Modal as ModalRN } from 'react-native';
import React, { useState } from 'react';
import { HistoryDataType } from '../../entities/historyTypes';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import dayjs from 'dayjs';
import images from '../../assets/images';
import { getNewPath } from '../../utils/functions';
import ImageCache from '../../components/ImageCache/ImageCache';
import BadgeStatus from '../../components/BadgeStatus/BadgeStatus';
import { firebaseInitialize } from '../../firebase/notification';
import analytics from '@react-native-firebase/analytics';
import { cartServices } from '../../services/CartServices';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import ModalWarning from '../../components/Modal/ModalWarning';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { customerServices } from '../../services/CustomerServices';

interface Props extends HistoryDataType {
  navigation?: any;
  isHasCustomerId: boolean;
}
export default function HistoryItemArea({
  orderProducts,
  isHasCustomerId,
  ...props
}: Props) {

  const [loading, setLoading] = useState<boolean>(false)
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [modalNotReady, setModalNotReady] = useState<boolean>(false)
  const [inactiveProducts, setInactiveProducts] = useState<any[]>([])
  const [modalCantBuy, setModalCantBuy] = useState<boolean>(false)

  const {
    cartList,
    setCartList,
    setFreebieListItem,
    cartApi: { getCartList },
} = useCart();
const {
    state: { user }
} = useAuth();

const { setItem } = useAsyncStorage('customerCompanyId');
  const { setItem: setTermPayment } = useAsyncStorage('termPayment');
  const { setItem: setCustomerNo } = useAsyncStorage('customerNo');
  const { setItem: setCustomerName } = useAsyncStorage('customerName');
  const { setItem: setProductBrand } = useAsyncStorage('productBrand');
  const { setItem: setAddress } = useAsyncStorage('address');

  const { setItem: setUserShopId } = useAsyncStorage('userShopId');

  const onReoder = async () => {
    try {
      const customer = await customerServices.getCustomerByCusComId(props.customerCompanyId.toString()) 
      setItem(props.customerCompanyId.toString())
      setTermPayment(customer.termPayment)
      setCustomerNo(props.customerNo)
      setCustomerName(props.customerName)
     /*  setProductBrand( JSON.stringify({
        product_brand_id: 1,
        product_brand_name: 'ICPLadda',
        company: props.company,
      }),) */
      setUserShopId(props.userShopId)
      setAddress(JSON.stringify({addressText:props.deliveryAddress,name:props.customerName}))
        setLoading(true)
        const payload = {
            company: user?.company || '',
            userStaffId: user?.userStaffId || '',
            orderId: props.orderId,
            isForceReorder: false
        }

        const res = await cartServices.postReorder(payload)
        if (res.inactiveProducts) {
            if (res.inactiveProducts.length !== orderProducts.length) {
                setInactiveProducts(res.inactiveProducts)
                setModalConfirm(false)
                setTimeout(() => {
                    setModalNotReady(true)
                }, 100)
            }
            else {
                setModalConfirm(false)
                setTimeout(() => {
                    setModalCantBuy(true)
                }, 100)
            }

        } else {
            const response = await cartServices.postCart(res)
            if (response) {
              const freebieList = response?.orderProducts
              .filter((item: any) => item?.isFreebie===true&&item?.isSpecialRequestFreebie===false)
              .map((el: any) => {
              
                if (el.productFreebiesId) {
                  
                  const newObj = {
                    productName: el.productName,
                    id: el.productFreebiesId,
                    quantity: el.quantity,
                    baseUnit: el.baseUnitOfMeaTh || el.baseUnitOfMeaEn,
                    status: el.productFreebiesStatus,
                    productImage: el.productFreebiesImage,
                  };
                  return newObj;
                } else {
                  const newObj = {
                    productName: el.productName,
                    id: el.productId,
                    quantity: el.quantity,
                    baseUnit: el.saleUOMTH || el.saleUOM || '',
                    status: el.productStatus,
                    productImage: el.productImage,
                  };
                  return newObj;
                }
              }
              )
              setFreebieListItem(freebieList);
                setModalConfirm(false)
                props.navigation.navigate('CartScreen')
            }
        }

    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
}

const onReoderInactive = async () => {
    try {
        setLoading(true)
        const payload = {
            company: user?.company || '',
            userStaffId: user?.userStaffId || '',
            orderId: props.orderId,
            isForceReorder: true
        }

        const res = await cartServices.postReorder(payload)
        const response = await cartServices.postCart(res)
        if (response) {
            setModalNotReady(false)
            props.navigation.navigate('CartScreen',{isReorder:true})
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
}


  const getOnlySixLength = orderProducts
    .filter(el => !el.isFreebie)
    .slice(0, 6);
  const onPress = () => {
    const date = dayjs(props.createAt).format('DD MMM BBBB');
    props.navigation.navigate('HistoryDetailScreen', {
      orderId: props.orderId,
      headerTitle: date,
    });
  };
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.flexRow,
          {
            justifyContent: 'space-between',
            width: '100%',
            paddingLeft: 14,
            paddingRight: 16,
          },
        ]}>
        <View style={styles.flexRow}>
          <Image
            style={{
              width: 24,
              height: 24,
              marginRight: 6,
            }}
            resizeMode="contain"
            source={icons.invoice}
          />
          <Text bold fontSize={14}>
            
            {props.orderNo}
          </Text>
        </View>
        <TouchableOpacity onPress={onPress}>
          <Text color="primary" fontSize={14}>
            ดูรายละเอียด
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.flexRow,
          {
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 8,
            paddingHorizontal: 16,
          },
        ]}>
        <View style={styles.flexRow}>
          <Image
            style={{
              width: 13,
              height: 13,
              marginRight: 6,
            }}
            source={icons.package}
          />
          <Text
            color="text3"
            fontSize={12}>{`${orderProducts.length} รายการ`}</Text>
        </View>
        <Text fontSize={12} color="text3">
          {dayjs(props.createAt).format('DD MMM BBBB , HH:mm น.')}
        </Text>
      </View>
      <View style={styles.border} />
      <View
        style={[
          styles.flexRow,
          {
            paddingVertical: 16,
            width: '100%',
            justifyContent: 'flex-start',
            paddingLeft: 32,
          },
        ]}>
        {getOnlySixLength.map((item, index) => {
          const isLast = index === 5 && orderProducts.length > 6;
          return isLast ? (
            <View
              style={{
                marginRight: 16,
              }}>
              <View
                style={{
                  borderRadius: 8,
                  backgroundColor: colors.text1,
                  opacity: 0.5,
                  zIndex: 1,
                  position: 'absolute',
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text color="white" semiBold>{`+${
                  orderProducts.length - 6
                }`}</Text>
              </View>
              {item.productImage ? (
                <ImageCache
                  style={{ width: 36, height: 36, zIndex: -1 }}
                  uri={getNewPath(item?.productImage)}
                />
              ) : (
                <Image
                  source={images.emptyProduct}
                  style={{ width: 36, height: 36 }}
                />
              )}
            </View>
          ) : (
            <View
              key={index}
              style={{
                marginRight: 16,
              }}>
              {item.productImage ? (
                <ImageCache
                  style={{ width: 36, height: 36 }}
                  uri={getNewPath(item?.productImage)}
                />
              ) : (
                <Image
                  source={images.emptyProduct}
                  style={{ width: 36, height: 36 }}
                />
              )}
            </View>
          );
        })}
      </View>
      {!isHasCustomerId && (
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: 20,
              height: 20,
              marginRight: 6,
            }}
            resizeMode="contain"
            source={icons.locationGray}
          />
          <Text color="text2" fontSize={12}>
            {props.customerName}
          </Text>
        </View>
      )}
      {props.deliveryAddress && (
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 20,
              marginRight: 6,
            }}
          />
          <Text
            color="text3"
            fontSize={12}
            style={{
              width: '80%',
            }}>
            {props.deliveryAddress}
          </Text>
        </View>
      )}
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 8,
          marginLeft: 32,
          flexDirection:'row',
          justifyContent:'space-between'

        }}>
        <BadgeStatus status={props.status} />
{user?.company !== 'ICPI'? 
<>
 {props?.status === 'DELIVERY_SUCCESS'||props?.status === 'SHOPAPP_CANCEL_ORDER'||props?.status === 'COMPANY_CANCEL_ORDER'? <View >
 <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{setModalConfirm(true)}}>
 <Text lineHeight={25} color='text3' bold>สั่งอีกครั้ง</Text>
 <Image source={icons.iconNext} style={{width:20,height:20}} />
 
 </TouchableOpacity>

</View>:null}
</>
: null}
       
        
      </View>
      <ModalWarning
                title="สินค้าที่คุณเลือกไว้ในตะกร้าจะถูกล้างทั้งหมด"
                titleCenter={true}
                visible={modalConfirm}
                width={'70%'}
                minHeight={50}
                desc="ต้องการยืนยันคำสั่งซื้อใช่หรือไม่?"
                onConfirm={() => {
                    onReoder()
                }}
                onRequestClose={() => {
                    setModalConfirm(false);
                }}
            />

            <ModalWarning
                visible={modalCantBuy}
                width={'80%'}
                minHeight={80}
                onlyCancel
                onRequestClose={() => setModalCantBuy(false)}
                textCancel={'ตกลง'}
                title={`รายการสินค้าทั้งหมด \n ไม่สามารถสั่งซื้ออีกครั้งได้`}

            />

            <ModalRN
                animationType="fade"
                onRequestClose={() => {
                    setModalNotReady(modalNotReady)
                }}
                visible={modalNotReady}
                transparent>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.4)',

                    }}>
                    <View style={[styles.modalView]}>
                        <View
                            style={{
                                paddingVertical: 16,
                                paddingHorizontal: 16,
                                minHeight: 50,

                            }}>
                            <Text semiBold lineHeight={30} center={true} >
                                สินค้าบางรายการไม่สามารถสั่งซื้ออีกครั้งได้
                            </Text>

                            <Text
                                fontSize={14}
                                fontFamily="Sarabun"
                                lineHeight={30}
                                color="text3"
                                style={{
                                    width: '100%',
                                }}>
                                คุณต้องการสั่งซื้ออีกครั้งใช่หรือไม่?
                            </Text>

                        </View>
                        <View style={{ flex: 1, maxHeight: 300, flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 }}>
                            <ScrollView
                                automaticallyAdjustsScrollIndicatorInsets={false}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                directionalLockEnabled

                                style={{
                                    backgroundColor: '#F8FAFF',
                                    padding: 10,


                                }}
                            >
                                <Text color='error' lineHeight={40} >สินค้าที่สั่งซื้อไม่ได้ ({inactiveProducts.length} รายการ)</Text>
                                <View style={{ marginVertical: 10 }}>
                                    {inactiveProducts.map((item) => <View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                flex: 1,

                                                marginVertical: 5
                                            }}>

                                            {item.productImage ? (
                                                <ImageCache
                                                    uri={item.productImage}
                                                    style={{
                                                        width: 72,
                                                        height: 72,
                                                    }}
                                                />
                                            ) : (
                                                <Image
                                                    source={images.emptyProduct}
                                                    style={{
                                                        width: 72,
                                                        height: 72,
                                                        backgroundColor: 'white'
                                                    }}
                                                />
                                            )}
                                            <View
                                                style={{
                                                    marginLeft: 16,
                                                    flex: 1,
                                                    alignSelf: 'center'
                                                }}>
                                                <Text semiBold>{item.productName}</Text>
                                                <Text>{item.packSize}</Text>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}>

                                                </View>
                                            </View>
                                        </View>

                                    </View>)}
                                </View>
                            </ScrollView>
                        </View>
                        <View
                            style={{
                                height: 40,
                                flexDirection: 'row',
                                width: '100%',
                                borderTopWidth: 1,
                                borderTopColor: colors.border1,
                            }}>
                            <TouchableOpacity
                                onPress={() => setModalNotReady(false)}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                }}>
                                <Text semiBold fontSize={14} fontFamily="NotoSans" center>
                                    ยกเลิก
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onReoderInactive()}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    borderLeftWidth: 1,
                                    borderLeftColor: colors.border1,
                                }}>
                                <Text
                                    semiBold
                                    center
                                    fontSize={14}
                                    fontFamily="NotoSans"
                                    color="primary">
                                    ยืนยัน
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ModalRN>
            <LoadingSpinner visible={loading}  />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border1,
    width: '100%',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    marginHorizontal: 16,
    marginTop: 8,
  },
  modalView: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
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
