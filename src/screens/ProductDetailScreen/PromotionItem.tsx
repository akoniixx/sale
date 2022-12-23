import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Dayjs } from 'dayjs';
import { colors } from '../../assets/colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import Text from '../../components/Text/Text';
import icons from '../../assets/icons';
import { useLocalization } from '../../contexts/LocalizationContext';
import DashedLine from 'react-native-dashed-line';

interface Props {
  dateStart: Dayjs;
  dateEnd: Dayjs;
  listPromotions: { text: string }[];
  title: string;
  index: number;
}
export default function PromotionItem({
  dateStart,
  dateEnd,
  listPromotions,
  title,
  index,
}: Props): JSX.Element {
  const { t } = useLocalization();
  return (
    <LinearGradient
      style={styles.container}
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
          {`${index + 1}. ${title}`}
        </Text>
        <View style={{}}>
          {listPromotions.map((item, index) => {
            return (
              <Text color="white" key={index} fontSize={14}>
                {`•  ${item.text}`}
              </Text>
            );
          })}
        </View>
        <View
          style={{
            paddingVertical: 10,
          }}>
          <DashedLine dashColor={colors.border1} dashGap={6} />
        </View>

        <Text color="white" fontSize={14}>
          {`•  ${t('screens.ProductDetailScreen.durationPromotion', {
            dateStart: dateStart.format('DD MMMM BBBB'),
            dateEnd: dateEnd.format('DD MMMM BBBB'),
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
