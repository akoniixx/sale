import { View, StyleSheet } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import Checkbox from '../../components/Checkbox/Checkbox';
import CheckboxListView from '../../components/Checkbox/CheckboxListView';
import { colors } from '../../assets/colors/colors';

export default function PromotionSection(): JSX.Element {
  const { t } = useLocalization();
  const [promotionList, setPromotionList] = React.useState<string[]>([]);
  const checkBoxMockData = [
    {
      title: '01-64 - ของแถมขั้นบันได - โปรโมชัน ไซม๊อกซิเมท',
      value: '01-64',
      key: '01-64',
    },
    {
      title: '02-64 - ของแถมขั้นบันได - โปรโมชัน ไซม๊อกซิเมท',
      value: '02-64',
      key: '02-64',
    },
    {
      title: '03-64 - ของแถมขั้นบันได - โปรโมชัน ไซม๊อกซิเมท',
      value: '03-64',
      key: '03-64',
    },
  ];
  return (
    <View style={styles().container}>
      <Text fontSize={18} bold>
        {t('screens.CartScreen.promotionSection.promotionTitle')}
      </Text>
      <View
        style={{
          marginTop: 16,
        }}>
        <Checkbox
          onPress={() =>
            setPromotionList(prev => {
              if (prev.length === 0) {
                return checkBoxMockData.map(item => item.value);
              }
              return [];
            })
          }
          valueCheckbox={
            promotionList.length === checkBoxMockData.length ? ['all'] : []
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
            valueCheckbox={promotionList}
            onPress={value => {
              if (promotionList.includes(value)) {
                setPromotionList(prev => prev.filter(item => item !== value));
              } else {
                setPromotionList(prev => [...prev, value]);
              }
            }}
            listCheckbox={checkBoxMockData}
          />
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
