import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import { useLocalization } from '../../contexts/LocalizationContext';
import dayjs from 'dayjs';
import PromotionItem from './PromotionItem';
import images from '../../assets/images';
import { PromotionType } from '../../entities/productType';

type Props = {
  packSize?: string;
  productImage?: string;
  productName?: string;
  unitPrice?: string;
  baseUOM?: string;
  commonName?: string;
  saleUOMTH?: string | null;
  description?: string | null;
  promotion?: PromotionType[];
  productId?: string;
};
export default function Body({
  packSize,
  productImage,
  productName,
  unitPrice = '0',
  commonName,
  description,
  saleUOMTH,
  promotion,
  productId,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const [isShowMore, setIsShowMore] = React.useState(false);

  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: colors.white,
          paddingVertical: 8,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {productImage ? (
            <Image
              source={{ uri: getNewPath(productImage) }}
              style={{
                width: '100%',
                height: 220,
              }}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                height: 220,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={images.emptyProduct} />
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <Text fontFamily="NotoSans" bold fontSize={20}>
            {productName}
          </Text>
          {unitPrice && (
            <Text
              fontFamily="NotoSans"
              bold
              fontSize={18}
              color="primary"
              style={{
                marginTop: 8,
              }}>
              {`฿${numberWithCommas(+unitPrice)}`}
            </Text>
          )}
          <Text
            fontFamily="NotoSans"
            color="text3"
            fontSize={16}
            style={{
              marginTop: 8,
            }}>
            {packSize
              ? `${packSize} | ฿${numberWithCommas(+unitPrice)}/${saleUOMTH}`
              : `฿${numberWithCommas(+unitPrice)}/${saleUOMTH}`}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 16,
          backgroundColor: colors.white,
        }}>
        <View
          style={{
            borderBottomColor: colors.background2,
            borderBottomWidth: 1,
          }}>
          <View
            style={{
              padding: 16,
            }}>
            <Text fontFamily="NotoSans" bold fontSize={18}>
              {t('screens.ProductDetailScreen.detail')}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 16,
          }}>
          <Text semiBold>{t('screens.ProductDetailScreen.important')}</Text>
          <Text semiBold numberOfLines={1} color="text3">
            {commonName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
              alignItems: 'center',
              width: '100%',
            }}>
            <Text semiBold>
              {t('screens.ProductDetailScreen.featuresAndBenefits')}
            </Text>
            {description && description.length > 80 && (
              <TouchableOpacity
                onPress={() => {
                  setIsShowMore(!isShowMore);
                }}>
                <Text fontSize={14} color="text3">
                  {isShowMore
                    ? t('screens.ProductDetailScreen.seeLess')
                    : t('screens.ProductDetailScreen.seeMore')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            color="text3"
            style={{
              width: '100%',
            }}
            numberOfLines={isShowMore ? undefined : 2}>
            {description}
          </Text>
          {isShowMore && (
            <View
              style={{
                height: 20,
                marginTop: 16,
              }}
            />
          )}
        </View>
        {promotion && promotion.length > 0 && (
          <View
            style={{
              backgroundColor: colors.white,
              padding: 16,
            }}>
            {promotion.map((item, index) => {
              return (
                <PromotionItem
                  key={index}
                  {...item}
                  index={index}
                  currentProductId={productId}
                  unitBuy={saleUOMTH}
                />
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
