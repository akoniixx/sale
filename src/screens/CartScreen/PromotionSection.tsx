import { View, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import Checkbox from '../../components/Checkbox/Checkbox';
import CheckboxListView from '../../components/Checkbox/CheckboxListView';
import { colors } from '../../assets/colors/colors';
import { useCart } from '../../contexts/CartContext';

import SkeletonLoading from '../../components/SkeletonLoading/SkeletonLoading';

interface Props {
  promotionList: {
    value: string;
    key: string;
    title: string;
    promotionType: string;
  }[];
  loadingPromo: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PromotionSection({
  promotionList,
  loadingPromo,
  setLoading,
  loading,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    cartList,
    setPromotionListValue,
    cartDetail,
    setCartList,
    promotionListValue,
    cartApi: { postCartItem, getSelectPromotion },
  } = useCart();
  const newPromotionList = promotionList.map((el, idx) => {
    return {
      ...el,
      title: `${idx + 1}. ${el.title}`,
    };
  });
  const postNewCart = async (currentPromotionList: string[]) => {
    try {
      setLoading(true);
      const newAllPromotion = cartDetail.allPromotions.map(el => {
        return {
          ...el,
          isUse: el.promotionId
            ? currentPromotionList.includes(el.promotionId)
            : false,
        };
      });
      const { cartList: cl, cartDetail: cD } = await postCartItem(
        cartList,
        cartDetail.specialRequestFreebies,
        newAllPromotion,
      );
      await getSelectPromotion(cD.allPromotions);

      setCartList(cl);
      setPromotionListValue(currentPromotionList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (newPromotionList.length <= 0) {
    return <View />;
  }

  return (
    <View style={styles().container}>
      <Text fontSize={18} bold lineHeight={28} fontFamily="NotoSans">
        {t('screens.CartScreen.promotionSection.promotionTitle')}
      </Text>
      <View
        style={{
          marginTop: 16,
        }}>
        {loadingPromo ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <SkeletonLoading
              style={{
                width: 16,
              }}
            />
            <SkeletonLoading
              style={{
                width: Dimensions.get('window').width / 2,
                marginLeft: 16,
              }}
            />
          </View>
        ) : (
          <>
            <Checkbox
              disabled={loading}
              onPress={async () => {
                if (
                  promotionListValue.length === 0 ||
                  promotionListValue.length !== promotionList.length
                ) {
                  await postNewCart(promotionList.map(item => item.value));
                } else {
                  await postNewCart([]);
                }
              }}
              valueCheckbox={
                promotionListValue.length === promotionList.length
                  ? ['all']
                  : []
              }
              listCheckbox={[
                {
                  title: 'เข้าร่วมโปรโมชันทั้งหมด',
                  value: 'all',
                  key: 'all',
                },
              ]}
            />
          </>
        )}

        <View
          style={{
            marginTop: 16,
            backgroundColor: colors.background1,
          }}>
          {loadingPromo ? (
            <View>
              {newPromotionList.map((_, idx) => {
                const isLast = idx === newPromotionList.length - 1;
                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      padding: 16,
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: colors.border1,
                    }}>
                    <SkeletonLoading
                      style={{
                        flex: 1,
                        height: 20,
                      }}
                    />
                    <SkeletonLoading
                      style={{
                        width: 16,
                        marginLeft: 16,
                      }}
                    />
                  </View>
                );
              })}
            </View>
          ) : (
            <CheckboxListView
              disabled={loading}
              valueCheckbox={promotionListValue}
              onPress={async value => {
                if (promotionListValue.includes(value)) {
                  const newPromotion = promotionListValue.filter(
                    (el: string) => {
                      return el !== value;
                    },
                  );
                  await postNewCart(newPromotion);
                } else {
                  await postNewCart([...promotionListValue, value]);
                }
              }}
              listCheckbox={newPromotionList}
            />
          )}
        </View>
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
  });
};
