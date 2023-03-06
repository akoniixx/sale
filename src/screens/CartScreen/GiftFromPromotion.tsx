import { View, StyleSheet, ScrollView, Image } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCart } from '../../contexts/CartContext';
import { colors } from '../../assets/colors/colors';
import { getNewPath } from '../../utils/functions';
import images from '../../assets/images';

interface Props {
  freebieListItem: {
    productName: string;
    id: string;
    quantity: number;
    baseUnit: string | undefined;
    status: string | undefined;
    productImage: string | undefined;
  }[];
}

export default function GiftFromPromotion({
  freebieListItem = [],
}: Props): JSX.Element {
  const { t } = useLocalization();

  if (freebieListItem.length < 1) return <></>;
  return (
    <View style={styles().container}>
      <View style={styles().header}>
        <Text fontSize={18} bold fontFamily="NotoSans">
          {t('screens.CartScreen.giftFromPromotion.title')}
        </Text>
        <Text color="text3" lineHeight={24}>
          {t('screens.CartScreen.giftFromPromotion.allListCount', {
            count: freebieListItem.length,
          })}
        </Text>
      </View>
      <View style={styles().content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {freebieListItem.map((item, index) => {
            return (
              <View key={index} style={styles().list}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 8,
                  }}>
                  {item.productImage ? (
                    <Image
                      source={{ uri: getNewPath(item.productImage) }}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                    />
                  ) : (
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      source={images.emptyProduct}
                    />
                  )}
                </View>
                <View>
                  <Text fontSize={14} color="text3" lineHeight={24}>
                    {item.productName}
                  </Text>
                  <Text semiBold fontSize={12} lineHeight={22}>
                    {item.quantity} {item.baseUnit}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      marginTop: 8,
      backgroundColor: 'white',
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    content: {
      flex: 1,
    },
    list: {
      width: 190,
      flexDirection: 'row',
      height: 72,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',

      backgroundColor: colors.background1,
      marginRight: 8,
    },
  });
};
