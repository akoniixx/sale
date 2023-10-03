import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { MainStackParamList } from "../../navigations/MainNavigator";
import Text from "../../components/Text/Text";
import ImageCache from "../../components/ImageCache/ImageCache";
import { getNewPath } from "../../utils/functions";
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

export default function NewsPromotionDetailScreen({
    navigation,
    route,
}: StackScreenProps<MainStackParamList, 'NewsPromotionDetailScreen'>): JSX.Element {
    const data: NewsPromotion = route.params
    const { t } = useLocalization();
    return (
        <Container>
            <Header />
            <Content
                style={{
                    backgroundColor: colors.white,
                    flex: 1,
                }}>
                <View style={{ alignItems: 'center' }}>
                    <ImageCache uri={data.promotionImageSecond}
                        resizeMode='cover'
                        style={{ width: '100%', height: 200 }}
                    />
                </View>
                <View style={{ marginVertical: 20 }}>
                    <Text fontSize={20} fontFamily='NotoSans' >
                        {data.promotionSubject}
                    </Text>
                </View>
                <DashedLine
                    dashColor={colors.border1}
                    dashGap={0}
                    dashLength={8} />
                <View style={{ marginVertical: 20 }}>
                    <Text>
                        {data.promotionDetail}
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
                        colors={[colors.BGDiscount1, colors.BGDiscount2]}
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
                                {`1. ${promotionTypeMap(data.promotionType)} - ${data.promotionName}`}
                            </Text>


                            {
                                data.promotionType === 'DISCOUNT_MIX' && data.conditionDetail.map((condition, index) => {
                                    if (condition.typeMix === 'Quantity') {

                                        return (
                                            <View key={index}>
                                                {condition.conditionDiscount.map((discount, dIndex) => (
                                                    <View key={dIndex}>
                                                        <Text color="white"
                                                            style={{
                                                                lineHeight: 30,
                                                            }}>{`• ซื้อ${discount.quantity} ${discount.saleUnit} ลด ${discount.discountPrice} บาทต่อ${discount.saleUnit}`}</Text>

                                                    </View>
                                                ))}
                                            </View>
                                        );
                                    }
                                }
                                )

                            }


                            {data.promotionType === 'DISCOUNT_MIX' &&
                                data.conditionDetail.map((condition) => {
                                    if (condition.conditionDiscount.typeMix === 'Size') {
                                        return condition.conditionDiscount.products.map((product) => {

                                            return (
                                                <Text
                                                    key={product.productId}
                                                    color="white"
                                                    style={{
                                                        lineHeight: 30,
                                                    }}
                                                >
                                                    {`• เมื่อซื้อครบ ${condition.conditionDiscount.size} ${product.saleUnit} ลด ${product.discountPrice} บาทต่อ${product.saleUnitDiscount}`}
                                                </Text>
                                            );

                                            return null; // If product ID doesn't match
                                        });
                                    }
                                    return null; // If typeMix is not 'Size'
                                })
                            }


                            {data.promotionType === 'OTHER' ? (
                                data.conditionDetail.map((condition, index) => {

                                    return (
                                        <Text
                                            key={index}
                                            color="white"
                                            style={{
                                                lineHeight: 30,
                                            }}>

                                            {condition.detail}
                                        </Text>
                                    );

                                })

                            ) : <></>}


                            {data.promotionType === 'FREEBIES_MIX' && data.conditionDetail.map((detail) => {
                                if (detail.typeMix === 'Quantity') {

                                    return (
                                        <>
                                            {detail.conditionFreebies.map((freebieDetail) => (
                                                <View >
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


                            {data.promotionType === 'FREEBIES_MIX' &&
                                data.conditionDetail.map((detail) => {
                                    if (detail.typeMix === 'Size') {
                                        return (
                                            <>
                                                {detail.products.map((product) => {

                                                    return (
                                                        <View>
                                                            <Text key={product.key}
                                                                color="white"
                                                                style={{
                                                                    lineHeight: 30,
                                                                }}>{
                                                                    `• เมื่อซื้อครบ ${detail.size} kg / L`
                                                                }</Text>
                                                            <Text color="white"
                                                                style={{
                                                                    lineHeight: 30,
                                                                }}>
                                                                {detail.conditionFreebies[0].freebies.map((freebie, idx) => (
                                                                    `แถม${freebie.productName} ${freebie.packSize ? `ขนาด ${freebie.packSize}` : ``} จำนวน ${freebie.quantity} ${freebie.baseUnitOfMeaTh ? freebie.baseUnitOfMeaTh : freebie.saleUOMTH}${idx + 1 === detail.conditionFreebies[0].freebies.length ? '' : ','} `
                                                                ))}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </>
                                        );
                                    }
                                })}


                            {data.promotionType === 'DISCOUNT_NOT_MIX' && data.conditionDetail.map((el, idx) => {
                                return (
                                    <>
                                        {el.condition.map((el, idx) => {
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

                            {/* {data?.conditionDetail?.map(item => {
          
          return item.condition.map((el, idx) => {
            if (data.promotionType === 'DISCOUNT_NOT_MIX') {
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
              );
            }


            return (el.freebies || []).map((el2, idx) => {
              if (!el2.productFreebiesId) {
                return (
                  <Text
                    key={idx}
                    color="white"
                    style={{
                      lineHeight: 30,
                    }}>
                    {`•  ${t(
                      'screens.ProductDetailScreen.promotionTextConvert',
                      {
                        buy: el.quantity,
                        free: el2.quantity,
                        productNameFree: el2.productName,
                        unitFree: el2.saleUOMTH || el2.saleUOM || '',
                        unitBuy: unitBuy || '',
                      },
                    )} `}
                  </Text>
                );
              }

              return (
                <Text
                  key={idx}
                  color="white"
                  style={{
                    lineHeight: 30,
                  }}>{`•  ${t(
                    'screens.ProductDetailScreen.promotionTextConvert',
                    {
                      buy: el.quantity,
                      free: el2.quantity,
                      productNameFree: el2.productName,
                      unitBuy: unitBuy || '',
                      unitFree: el2.baseUnitOfMeaTh || el2.baseUnitOfMeaEn || '',
                    },
                  )}`}</Text>
              );
            });
          });
        })}  */}

                            <View
                                style={{
                                    paddingVertical: 10,
                                }}>
                                <DashedLine dashColor={colors.border1} dashGap={6} />
                            </View>

                            <Text color="white" fontSize={14}>
                                {`•  ${t('screens.ProductDetailScreen.durationPromotion', {
                                    dateStart: dayjs(data.startDate).format('DD MMMM BBBB'),
                                    dateEnd: dayjs(data.endDate).format('DD MMMM BBBB'),
                                })}`}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
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