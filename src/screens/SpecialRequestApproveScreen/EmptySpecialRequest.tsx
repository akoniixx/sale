import { View, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';

export default function EmptySpecialRequest() {
  return (
    <View style={styles.container}>
      <Image source={images.emptyList} style={styles.image} />
      <Text color="text3" fontFamily="NotoSans" fontSize={16}>
        ไม่มีพบรายการคำสั่งซื้อ
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.5,
  },
  image: {
    width: 140,
    height: 140,
    backgroundColor: 'transparent',
  },
});
