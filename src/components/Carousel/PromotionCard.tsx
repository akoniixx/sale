import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import ProgressiveImage from '../ProgressingImage/ProgressingImage';
import { normalize } from '../../utils/functions';
import { colors } from '../../assets/colors/colors';

interface guruData {
  background: any;
}
export const PromotionCard: React.FC<guruData> = ({ background }) => {
  return (
    <View>
      <View style={styles.card}>
        <ProgressiveImage
          style={{ height: normalize(200), borderRadius: 10 }}
          source={{ uri: background }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(30),
    borderWidth: 0.1,
    borderColor: '#D9DCDF',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
});
