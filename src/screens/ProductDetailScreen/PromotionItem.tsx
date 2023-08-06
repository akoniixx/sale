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
          {`${index + 1}. ${props.promotionName}`}
        </Text>



         {promotionType === 'DISCOUNT_MIX'&&conditionDetail[0].typeMix==='Quantity'?(

conditionDetail[0]?.conditionDiscount?.map((el, idx) => {
  return <View>
    <Text
      key={idx}
      color="white"
      style={{
        lineHeight: 30,
      }}
    >
      {`•  ${t('screens.ProductDetailScreen.promotionDiscount_mix_quantity', {
        buy: el.quantity,
        discountPrice: el.discountPrice,
        unitBuy: el.saleUnit ,
      })} `}
    </Text>
  </View>
})

        ):<></>} 

{promotionType === 'DISCOUNT_MIX'&&conditionDetail[0].conditionDiscount.typeMix==='Size'?(
 
conditionDetail[0]?.conditionDiscount?.products.map((el, idx) => {
 if(el.productId===currentProductId){
  return <View>
    <Text
      key={idx}
      color="white"
      style={{
        lineHeight: 30,
      }}
    >
      
      {`•  ${t('screens.ProductDetailScreen.promotionDiscount_mix_size', {
        buy: conditionDetail[0].conditionDiscount.size,
        discountPrice: el.discountPrice,
        unitBuy: el.saleUnit ,
      })} `}
    </Text>
  </View>
}})

        ):<></>} 

{promotionType === 'OTHER'?(

conditionDetail?.map((el, idx) => {
  return <View>
    <Text
      key={idx}
      color="white"
      style={{
        lineHeight: 30,
      }}
    >
      {el.detail}
    </Text>
  </View>
})

        ):<></>} 



{promotionType === 'FREEBIES_MIX'&&conditionDetail[0].typeMix==='Quantity'?(

conditionDetail[0]?.conditionFreebies?.map((el, idx) => {
  return <View>
    <Text
      key={idx}
      color="white"
      style={{
        lineHeight: 30,
      }}
    >
      {`•  ${t('screens.ProductDetailScreen.freebies_mix_quantity', {
        buy: el.quantity,
        unitBuy: el.saleUnit ,
        productNameFree: el.freebies[0].productName,
        commonNameFree: el.freebies[0].commonName,
        sizeFree: el.freebies[0].packSize,
        free: el.freebies[0].quantity,
        unitFree: el.freebies[0].saleUOMTH
      })} `}
    </Text>
  </View>
})


        ):<></>} 

{promotionType === 'FREEBIES_MIX'&&conditionDetail[0].typeMix==='Size'?(

conditionDetail[0]?.conditionFreebies?.map((el, idx) => {
  return <View>
    <Text
      key={idx}
      color="white"
      style={{
        lineHeight: 30,
      }}
    >sssss
      {`•  ${t('screens.ProductDetailScreen.freebies_mix_quantity', {
        buy: el.quantity,
        unitBuy: el.saleUnit ,
        productNameFree: el.freebies[0].productName,
      })} `}
    </Text>
  </View>
})


        ):<></>} 


        
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
