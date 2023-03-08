import { View, StyleSheet } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import Checkbox from '../../components/Checkbox/Checkbox';
import CheckboxListView from '../../components/Checkbox/CheckboxListView';
import { colors } from '../../assets/colors/colors';
import { useCart } from '../../contexts/CartContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

interface Props {
  promotionList: {
    value: string;
    key: string;
    title: string;
    promotionType: string;
  }[];
}
export default function PromotionSection({
  promotionList,
}: Props): JSX.Element {
  const { t } = useLocalization();
  const [loading, setLoading] = React.useState(false);
  // console.log(promotionListValue.length === promotionList.length);
  const {
    cartList,
    setCartList,
    setPromotionListValue,
    cartDetail,
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
      await postCartItem(cartList, newAllPromotion);
      await getSelectPromotion(newAllPromotion);
      setPromotionListValue(currentPromotionList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles().container}>
      <Text fontSize={18} bold lineHeight={28}>
        {t('screens.CartScreen.promotionSection.promotionTitle')}
      </Text>
      <View
        style={{
          marginTop: 16,
        }}>
        <Checkbox
          onPress={async () => {
            if (promotionListValue.length === 0) {
              await postNewCart(promotionList.map(item => item.value));
            } else {
              await postNewCart([]);
            }
          }}
          valueCheckbox={
            promotionListValue.length === promotionList.length ? ['all'] : []
          }
          listCheckbox={[
            {
              title: 'เข้าร่วมโปรโมชันทั้งหมด',
              value: 'all',
              key: 'all',
            },
          ]}
        />
        <View
          style={{
            marginTop: 16,
            backgroundColor: colors.background1,
          }}>
          <CheckboxListView
            valueCheckbox={promotionListValue}
            onPress={async value => {
              if (promotionListValue.includes(value)) {
                const newPromotion = promotionListValue.filter((el: string) => {
                  return el !== value;
                });
                await postNewCart(newPromotion);
              } else {
                await postNewCart([...promotionListValue, value]);
              }
            }}
            listCheckbox={newPromotionList}
          />
        </View>
      </View>
      <LoadingSpinner visible={loading} />
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
