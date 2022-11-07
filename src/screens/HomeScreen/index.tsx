import { ImageBackground, StyleSheet, View } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import Body from './Body';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function HomeScreen({ navigation }: Props): JSX.Element {
  const name = 'ชิษณุชา';
  return (
    <Container>
      <Content style={{ padding: 0, flex: 1, width: '100%' }}>
        <ImageBackground
          source={images.HomeScreenBG}
          style={{
            minHeight: 160,
            width: '100%',
            justifyContent: 'center',
          }}>
          <View
            style={{
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <View>
              <Text color="white" fontSize={24} fontFamily="NotoSans" bold>
                สวัสดี,
              </Text>
              <Text color="white" fontSize={14} fontFamily="NotoSans">
                Sale, Marketing executive
              </Text>
            </View>
            <View style={styles.circle}>
              <Text fontFamily="NotoSans" fontSize={24} color="primary">
                {name.charAt(0)}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <Body navigation={navigation} />
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 62,
    height: 62,
    borderRadius: 62 / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
