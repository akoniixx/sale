import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { numberWithCommas } from '../../utils/functions';
import { useLocalization } from '../../contexts/LocalizationContext';
import dayjs from 'dayjs';
import PromotionItem from './PromotionItem';

interface Props {
  image?: ImageSourcePropType;
  name?: string;
  detail?: string;
  price?: number;
  promotion?: number;
  unit?: string;
}
export default function Body({
  image,
  name,
  detail,
  price,
  unit,
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
          <Image
            source={image}
            style={{
              height: 220,
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <Text fontFamily="NotoSans" bold fontSize={20}>
            {name}
          </Text>
          <Text
            fontFamily="NotoSans"
            bold
            fontSize={18}
            color="primary"
            style={{
              marginTop: 8,
            }}>
            {`฿${numberWithCommas(price)}`}
          </Text>
          <Text
            fontFamily="NotoSans"
            color="text3"
            fontSize={16}
            style={{
              marginTop: 8,
            }}>
            {`${detail} | ฿${numberWithCommas(price)}/${unit}`}
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
            {'EMAMECTIN BENZOATE 2.0% W/V ME'}
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
