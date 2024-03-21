import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { MainStackParamList } from "../../navigations/MainNavigator";
import Text from "../../components/Text/Text";
import ImageCache from "../../components/ImageCache/ImageCache";

import Container from "../../components/Container/Container";
import { colors } from "../../assets/colors/colors";
import Content from "../../components/Content/Content";
import Header from "../../components/Header/Header";
import DashedLine from "react-native-dashed-line";
import LinearGradient from "react-native-linear-gradient";
import dayjs from "dayjs";
import { useLocalization } from "../../contexts/LocalizationContext";
import icons from "../../assets/icons";
import { promotionTypeMap } from "../../utils/mappingObj";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { NewsPromotionService } from "../../services/NewsService/NewsPromotionServices";


export default function NewsPromotionDetailScreen({
    navigation,
    route,
}: StackScreenProps<MainStackParamList, 'NewsPromotionDetailScreen'>): JSX.Element {
    const [data, setData] = useState<NewsPromotion>();
    const [loading, setLoading] = useState<boolean>(false)


    const feacthPromotionDetail = async (id: string) => {
        try {
            setLoading(true)
            const res = await NewsPromotionService.getNewsPromotionById(id)
            setData(res)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }


    }



    useEffect(() => {
        if (route.params.fromNoti) {
            feacthPromotionDetail(route.params.promotionId)

        } else {
            setData(route.params.data)
        }
    }, [])





    const { t } = useLocalization();
    return (
        <Container>
            <Header />

            <Content
                style={{
                    backgroundColor: colors.white,
                    flex: 1,
                }}>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                    flexGrow: 1,

                    paddingBottom: 70
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <ImageCache uri={data?.promotionImageSecond}
                            resizeMode='cover'
                            style={{ width: '100%', height: 200 }}
                        />

                    </View>
                    <View style={{ marginVertical: 20 }}>
                        <Text fontSize={20} fontFamily='NotoSans' >
                            {/*  {data?.promotionType} */}
                            {data?.promotionSubject}
                        </Text>
                    </View>
                    <DashedLine
                        dashColor={colors.border1}
                        dashGap={0}
                        dashLength={8} />


                    {new Date(data?.startDate).getTime() <= new Date().getTime() ? (<>

                        <View style={{ marginVertical: 20 }}>
                            <Text>
                                {data?.promotionDetail}
                            </Text>
                        </View>
                        <View>
                            <LinearGradient
                                style={[
                                    styles.container,
                                    {
                                        marginBottom: 0,
                                    },
                                ]}
                                colors={['#4C95FF', '#4C95FF']}
                                start={{ x: 0.5, y: 0.5 }}>
                                <View style={styles.header}>
                                    <Image
                                        source={icons.promotionDetail}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            marginRight: 8,
                                        }}
                                    />
                                    <Text color="white" fontFamily="NotoSans" bold fontSize={18}>
                                        {t('screens.ProductDetailScreen.promotion')}
                                    </Text>
                                </View>


                                <View style={styles.content}>
                                    <Text color="white" semiBold>
                                        {`1. ${promotionTypeMap(data?.promotionType)} - ${data?.promotionName}`}
                                    </Text>


                                    {
                                        data?.promotionType === 'DISCOUNT_MIX' && data?.conditionDetail.map((condition, index) => {
                                            if (condition.typeMix === 'Quantity') {

                                                return (
                                                    <>
                                                        <Text color="white"
                                                            style={{
                                                                lineHeight: 30,
                                                            }}>
                                                            {`สินค้ากลุ่มที่ ${index + 1}: `}
                                                            {condition.products.map((p, idx) => (
                                                                `${p.productName} ${p.packSize}${idx + 1 === condition.products.length ? '' : ','} `
                                                            ))}</Text>
                                                        <View key={index}>
                                                            {condition?.conditionDiscount.map((discount, dIndex) => (
                                                                <View key={dIndex}>
                                                                    <Text color="white"
                                                                        style={{
                                                                            lineHeight: 30,
                                                                        }}>{`• ซื้อ${discount.quantity} ${discount.saleUnit} ลด ${discount.discountPrice} บาทต่อ${discount.saleUnit}`}</Text>

                                                                </View>
                                                            ))}
                                                        </View>
                                                    </>
                                                );
                                            }
                                        }
                                        )

                                    }


                                    {
                                        data?.promotionType === 'DISCOUNT_MIX' &&
                                        data?.conditionDetail.map((condition, index) => {
                                            const { typeMix, size, products } = condition.conditionDiscount;

                                            if (typeMix === 'Size') {
                                                return (
                                                    <>
                                                        <Text color="white" style={{ lineHeight: 30 }}>
                                                            {`สินค้ากลุ่มที่ ${index + 1}: ซื้อครบ ${size} kg/L`}
                                                        </Text>
                                                        {products.map(product => {
                                                            const matchedProduct = condition.products.find(
                                                                item => item.productId === product.productId
                                                            );

                                                            const productDetails = matchedProduct
                                                                ? `• ${matchedProduct.productName} ${matchedProduct.packSize}`
                                                                : '';

                                                            return (
                                                                <View>
                                                                    <Text
                                                                        key={product.productId}
                                                                        color="white"
                                                                        style={{ lineHeight: 30 }}
                                                                    >
                                                                        {`${productDetails} ${product.saleUnit} ลด ${product.discountPrice} บาทต่อ${product.saleUnitDiscount}`}
                                                                    </Text>
                                                                </View>
                                                            );
                                                        })}
                                                    </>
                                                );
                                            }

                                            return null; // If typeMix is not 'Size'
                                        })
                                    }


                                    {data?.promotionType === 'OTHER' ? (
                                        data?.conditionDetail.map((condition, index) => (
                                            <>
                                                <Text color="white"
                                                    style={{
                                                        lineHeight: 30,
                                                    }}>
                                                    {`สินค้ากลุ่มที่ ${index + 1}: `}
                                                    {condition.products.map((p, idx) => (
                                                        `${p.productName} ${p.packSize}${idx + 1 === condition.products.length ? '' : ','} `
                                                    ))}
                                                </Text>
                                                <Text
                                                    key={index}
                                                    color="white"
                                                    style={{
                                                        lineHeight: 30,
                                                    }}>

                                                    {`• ${condition.detail}`}
                                                </Text>
                                            </>

                                        ))

                                    ) : <></>}


                                    {data?.promotionType === 'FREEBIES_MIX' && data?.conditionDetail.map((detail, idx) => {
                                        if (detail.typeMix === 'Quantity') {

                                            return (
                                                <>
                                                    <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                        <Text color="white" >
                                                            {`สินค้ากลุ่มที่ ${idx + 1}: `}
                                                        </Text>
                                                        {detail.products.map((product, index) => (
                                                            <Text color="white">
                                                                {`${product.productName} ขนาด ${product.packSize}${index + 1 === detail.products.length ? '' : ','} `}
                                                            </Text>
                                                        ))}</View>
                                                    {detail.conditionFreebies.map((freebieDetail, idx) => (
                                                        <View style={{ paddingLeft: 10, marginTop: 5 }}>
                                                            <Text color="white"
                                                                style={{
                                                                    lineHeight: 30,
                                                                }}>{`• เมื่อซื้อครบ ${freebieDetail.quantity} ${freebieDetail.saleUnit} `}</Text>
                                                            <Text color="white"
                                                                style={{
                                                                    lineHeight: 30,
                                                                }}>
                                                                {`แถม`}
                                                                {freebieDetail.freebies.map((freebie, idx) => (
                                                                    ` ${freebie.productName} จำนวน ${freebie.quantity} ${freebie.baseUnitOfMeaTh ? freebie.baseUnitOfMeaTh : freebie.saleUOMTH}${idx + 1 === freebieDetail.freebies.length ? '' : ','} `
                                                                ))}
                                                            </Text>

                                                        </View>
                                                    ))}
                                                </>
                                            );
                                        }

                                        return null;
                                    })}


                                    {data?.promotionType === 'FREEBIES_MIX' &&
                                        data?.conditionDetail.map((detail, index) => {
                                            if (detail.typeMix === 'Size') {
                                                return (
                                                    <>

                                                        <Text color="white" style={{ marginTop: 10 }}>
                                                            {`สินค้ากลุ่มที่ ${index + 1}: ${detail.products.map((product) => (` ${product.productName} ${product.packSize}`))}`}
                                                        </Text>


                                                        <Text key={index}
                                                            color="white"
                                                            style={{
                                                                lineHeight: 30,
                                                            }}>{
                                                                `• เมื่อซื้อครบ ${detail.size} kg / L ${detail.conditionFreebies[0].freebies.map((freebie, idx) => (
                                                                    `แถม${freebie.productName} ${freebie.packSize ? `ขนาด ${freebie.packSize}` : ``} จำนวน ${freebie.quantity} ${freebie.baseUnitOfMeaTh ? freebie.baseUnitOfMeaTh : freebie.saleUOMTH}${idx + 1 === detail.conditionFreebies[0].freebies.length ? '' : ','} `
                                                                ))}`
                                                            }</Text>

                                                    </>
                                                );
                                            }
                                        })}


                                    {data?.promotionType === 'DISCOUNT_NOT_MIX' && data?.conditionDetail.map((itm, idx) => {
                                        return (
                                            <>
                                                <Text color="white">ซื้อ{itm.productName} ขนาด {itm.packsize}</Text>
                                                {itm.condition.map((el, idx) => {
                                                    return (
                                                        <View key={idx}>
                                                            <Text
                                                                key={idx}
                                                                color="white"
                                                                style={{
                                                                    lineHeight: 30,
                                                                }}>
                                                                {`•  ${t('screens.ProductDetailScreen.promotionDiscount', {
                                                                    buy: el.quantity,
                                                                    discountPrice: el.discountPrice,
                                                                    productNameFree: '' || '',
                                                                    unitDiscount:
                                                                        el.saleUnitDiscountTH || el.saleUnitDiscount || '',
                                                                    unitBuy: el.saleUnitTH || el.saleUnit || '',
                                                                })} `}
                                                            </Text>
                                                        </View>
                                                    )

                                                })}
                                            </>
                                        )
                                    })

                                    }

                                    {data?.promotionType === 'FREEBIES_NOT_MIX' && data?.conditionDetail.map((itm, idx) => {
                                        return (
                                            <>
                                                <View style={{ marginTop: 10 }} key={idx}>
                                                    <Text color="white">ซื้อ{itm.productName} ขนาด {itm.packsize}</Text>
                                                </View>

                                                {itm.condition.map((el, idx) => (
                                                    <>
                                                        <View key={idx} style={{ paddingHorizontal: 10 }}>
                                                            <Text
                                                                key={idx}
                                                                color="white"
                                                                style={{
                                                                    lineHeight: 30,
                                                                }}>
                                                                {`• ซื้อครบ ${el.quantity} ${el.saleUnit} แถม${el.freebies.map((el2) => (
                                                                    ` ${el2.productName} ${el2.packSize ? el2.packSize : ''} จำนวน ${el2.quantity} ${el2.saleUOMTH ? el2.saleUOMTH : ''}`
                                                                ))}`}
                                                            </Text>

                                                        </View>
                                                    </>
                                                ))}
                                            </>
                                        )
                                    })
                                    }


                                    <View
                                        style={{
                                            paddingVertical: 10,
                                        }}>
                                        <DashedLine dashColor={colors.border1} dashGap={6} />
                                    </View>

                                    <Text color="white" fontSize={14}>
                                        {`•  ${t('screens.ProductDetailScreen.durationPromotion', {
                                            dateStart: dayjs(data?.startDate).format('DD MMMM BBBB'),
                                            dateEnd: dayjs(data?.endDate).format('DD MMMM BBBB'),
                                        })}`}
                                    </Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </>) : (
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={{ marginTop: 50, alignItems: 'center' }}>
                                <Image source={icons.poster} style={{ width: 57, height: 60 }} />
                                <Text semiBold color='text3' style={{ marginTop: 20 }} >ติดตามโปรโมชันพิเศษได้เร็วๆ นี้</Text>
                                <Text semiBold fontSize={16} fontFamily='Sarabun' color='primary' style={{ marginTop: 10 }}>{`วันที่ ${dayjs(data?.startDate).format('DD MMMM BBBB')}`}</Text>
                            </View>

                        </View>
                    )}

                </ScrollView>



            </Content>
            <LoadingSpinner visible={loading} />
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderColor: '#0064FB',
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: colors.border1,
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    content: {
        paddingTop: 20,
        paddingBottom: 16,
        paddingHorizontal: 24,
    },
});