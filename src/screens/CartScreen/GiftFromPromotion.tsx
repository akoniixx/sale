import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { colors } from '../../assets/colors/colors';
import { getNewPath } from '../../utils/functions';
import images from '../../assets/images';
import ImageCache from '../../components/ImageCache/ImageCache';
import SkeletonLoading from '../../components/SkeletonLoading/SkeletonLoading';

interface Props {
  freebieListItem: {
    productName: string;
    id: string;
    quantity: number;
    baseUnit: string | undefined;
    status: string | undefined;
    productImage: string | undefined;
  }[];
  loadingPromo: boolean;
}

export default function GiftFromPromotion({
  freebieListItem = [],
  loadingPromo,
}: Props): JSX.Element {
  const { t } = useLocalization();

  if (freebieListItem.length < 1) return <></>;
  return (
    <View style={styles().container}>
      <View style={styles().header}>
        <Text fontSize={18} bold fontFamily="NotoSans">
          {t('screens.CartScreen.giftFromPromotion.title')}
        </Text>
        {loadingPromo ? (
          <View>
            <SkeletonLoading
              style={{
                width: 80,
              }}
            />
          </View>
        ) : (
          <Text color="text3" lineHeight={24}>
            {t('screens.CartScreen.giftFromPromotion.allListCount', {
              count: freebieListItem.length,
            })}
          </Text>
        )}
      </View>
      {loadingPromo ? (
        <View style={styles().skeleton}>
          <View style={styles().skeletonList}>
            <SkeletonLoading style={{ width: 56, height: 56 }} />
            <View
              style={{
                marginLeft: 8,
              }}>
              <SkeletonLoading style={{ width: 32, height: 16 }} />
              <SkeletonLoading
                style={{ width: 40, height: 16, marginTop: 4 }}
              />
            </View>
          </View>
          <View style={styles().skeletonList}>
            <SkeletonLoading style={{ width: 56, height: 56 }} />
            <View
              style={{
                marginLeft: 8,
              }}>
              <SkeletonLoading style={{ width: 32, height: 16 }} />
              <SkeletonLoading
                style={{ width: 40, height: 16, marginTop: 4 }}
              />
            </View>
          </View>
        </View>
      ) : (
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
                      <ImageCache
                        uri={getNewPath(item.productImage)}
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
      )}
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
      minWidth: 190,
      flexDirection: 'row',
      height: 72,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',

      backgroundColor: colors.background1,
      marginRight: 8,
    },
    skeleton: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 16,
    },
    skeletonList: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
      width: Dimensions.get('window').width / 2 - 32,
      backgroundColor: colors.background1,
    },
  });
};
