import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../../components/Text/Text';
import icons from '../../assets/icons';
import { useLocalization } from '../../contexts/LocalizationContext';
import DashedLine from 'react-native-dashed-line';
import { PromotionType } from '../../entities/productType';
import dayjs from 'dayjs';
import { promotionTypeMap } from '../../utils/mappingObj';

interface Props extends PromotionType {
  index: number;
  unitBuy: string | null | undefined;
  currentProductId?: string;
  productName?: string;
  promotionLength?: number;
}
export default function PromotionItem({
  index,
  conditionDetail,
  endDate,
  unitBuy,
  currentProductId,
  startDate,
  productName,
  promotionType,
  promotionLength = 0,
  ...props
}: Props): JSX.Element {
  const { t } = useLocalization();
  const isLast = index === promotionLength - 1;

  return (

    <LinearGradient
      style={[
        styles.container,
        {
          marginBottom: isLast ? 0 : 12,
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
          {`${index + 1}. ${promotionTypeMap(promotionType)} - ${props.promotionName}`}
        </Text>

        {
          promotionType === 'DISCOUNT_MIX' && conditionDetail.map((condition, index) => {
            if (condition.typeMix === 'Quantity') {
              const targetProduct = condition.products.find(product => product.productId === currentProductId);
              if (targetProduct) {
                return (
                  <View key={index}>
                    {condition.conditionDiscount.map((discount, dIndex) => (
                      <View key={dIndex}>
                        <Text color="white"
                          style={{
                            lineHeight: 30,
                          }}>{`• ซื้อ${discount.quantity} ${discount.saleUnit} ลด ${discount.discountPrice} บาท ${discount.saleUnit}`}</Text>

                      </View>
                    ))}
                  </View>
                );
              }
            }
          })

        }


        {promotionType === 'DISCOUNT_MIX' &&
          conditionDetail.map((condition) => {
            if (condition.conditionDiscount.typeMix === 'Size') {
              return condition.conditionDiscount.products.map((product) => {
                if (product.productId === currentProductId) {
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
                }
                return null; // If product ID doesn't match
              });
            }
            return null; // If typeMix is not 'Size'
          })
        }


        {promotionType === 'OTHER' ? (
          conditionDetail.map((condition, index) => {
            if (condition.products.some(product => product.key === currentProductId)) {
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
            } else {
              return null;
            }
          })

        ) : <></>}


        {promotionType === 'FREEBIES_MIX' && conditionDetail.map((detail) => {
          if (detail.typeMix === 'Quantity') {
            const product = detail.products.find((prod) => prod.productId === currentProductId);
            if (product) {
              return (
                <>
                  {detail.conditionFreebies.map((freebieDetail) => (
                    <View key={freebieDetail.quantity}>
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
          }
          return null;
        })}


        {promotionType === 'FREEBIES_MIX' &&
          conditionDetail.map((detail) => {
            if (detail.typeMix === 'Size') {
              return (
                <>
                  {detail.products.map((product) => {
                    if (product.productId === currentProductId) {
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
                    }
                  })}
                </>
              );
            }
          })}



        {conditionDetail?.map(item => {
          if (currentProductId !== item.productId) {
            return null;
          }
          return item.condition.map((el, idx) => {
            if (promotionType === 'DISCOUNT_NOT_MIX') {
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
                      productNameFree: productName || '',
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
        })}

        <View
          style={{
            paddingVertical: 10,
          }}>
          <DashedLine dashColor={colors.border1} dashGap={6} />
        </View>

        <Text color="white" fontSize={14}>
          {`•  ${t('screens.ProductDetailScreen.durationPromotion', {
            dateStart: dayjs(startDate).format('DD MMMM BBBB'),
            dateEnd: dayjs(endDate).format('DD MMMM BBBB'),
          })}`}
        </Text>
      </View>
    </LinearGradient>
  );
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
