import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import { useLocalization } from '../../contexts/LocalizationContext';
import dayjs from 'dayjs';
import PromotionItem from './PromotionItem';
import images from '../../assets/images';

type Props = {
  packSize?: string;
  productImage?: string;
  productName?: string;
  unitPrice?: string;
  baseUOM?: string;
  commonName?: string;
};
export default function Body({
  baseUOM,
  packSize,
  productImage,
  productName,
  unitPrice = '0',
  commonName,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const [isShowMore, setIsShowMore] = React.useState(false);
  const mockDataPromotion = [
    {
      id: 1,
      title: 'ของแถมขั้นบันได - โปรโมชัน ไซม๊อกซิเมท',
      listPromotions: [
        {
          text: 'ซื้อ 10 ลัง แถม 1 ลัง',
        },
        {
          text: 'ซื้อ 20 ลัง แถม 2 ลัง',
        },
      ],
      dateStart: dayjs(),
      dateEnd: dayjs().add(1, 'month'),
    },
  ];

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
              ? `${packSize} | ฿${numberWithCommas(+unitPrice)}/${baseUOM}`
              : `฿${numberWithCommas(+unitPrice)}/${baseUOM}`}
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
            }}>
            <Text semiBold>
              {t('screens.ProductDetailScreen.featuresAndBenefits')}
            </Text>
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
          </View>
          <Text
            color="text3"
            style={{ width: '80%' }}
            numberOfLines={isShowMore ? undefined : 2}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
            expedita impedit vitae exercitationem voluptatem quas repellat dicta
            quod. Sunt voluptatibus nulla praesentium fugiat itaque, corporis
            commodi animi repellat cum veritatis! Lorem ipsum dolor sit, amet
            consectetur adipisicing elit. Sit expedita impedit vitae
            exercitationem voluptatem quas repellat dicta quod. Sunt
            voluptatibus nulla praesentium fugiat itaque, corporis commodi animi
            repellat cum veritatis! Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Sit expedita impedit vitae exercitationem
            voluptatem quas repellat dicta quod. Sunt voluptatibus nulla
            praesentium fugiat itaque, corporis commodi animi repellat cum
            veritatis! Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Sit expedita impedit vitae exercitationem voluptatem quas repellat
            dicta quod. Sunt voluptatibus nulla praesentium fugiat itaque,
            corporis commodi animi repellat cum veritatis!
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
        {mockDataPromotion.length > 0 && (
          <View
            style={{
              backgroundColor: colors.white,
              padding: 16,
            }}>
            {mockDataPromotion.map((item, index) => {
              return <PromotionItem key={index} {...item} index={index} />;
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
