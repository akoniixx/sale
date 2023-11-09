import { StyleSheet, TouchableOpacity, View, Modal as ModalRN, Image, } from "react-native";
import Button from "../../components/Button/Button";
import { cartServices } from "../../services/CartServices";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../../navigations/MainNavigator";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ModalWarning from "../../components/Modal/ModalWarning";
import Text from "../../components/Text/Text";
import { colors } from "../../assets/colors/colors";

import { ScrollView } from "react-native-gesture-handler";
import ImageCache from "../../components/ImageCache/ImageCache";

import images from "../../assets/images";
import React from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { customerServices } from "../../services/CustomerServices";


interface Props {
    orderId: string;
    orderLength: string | number
    navigation: StackNavigationProp<
        MainStackParamList
    >;
}

export default function FooterReorder({ orderId, orderLength, navigation, ...props }: Props) {
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
                orderId: orderId,
                isForceReorder: false
            }

            const res = await cartServices.postReorder(payload)
            if (res.inactiveProducts) {
                if (res.inactiveProducts.length !== orderLength) {
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
                    navigation.navigate('CartScreen')
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
                orderId: orderId,
                isForceReorder: true
            }

            const res = await cartServices.postReorder(payload)
           
            
            const response = await cartServices.postCart(res)
            if (response) {
                setModalNotReady(false)
                navigation.navigate('CartScreen',{isReorder:true})
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>

            <View style={styles.container}>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 14,
                        width: '100%',
                        borderRadius: 8,
                        borderColor: '#4C95FF',
                        borderWidth: 1,
                    }}

                    onPress={() => {
                        setModalConfirm(true);
                    }}
                >
                    <Text bold color="primary" lineHeight={30}>สั่งซื้ออีกครั้ง </Text>
                </TouchableOpacity>
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
            <LoadingSpinner visible={loading} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    }, modalView: {
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