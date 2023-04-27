import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useMemo } from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function Body({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { user },
  } = useAuth();

  const memoListMenus = useMemo(() => {
    const ListMenus = [
      {
        title: t('menu.order'),
        image: images.Order,
        name: 'Order',
        onPress: () => {
          navigation.navigate('SelectStoreScreen');
        },
      },
      {
        title: t('menu.history'),
        image: images.History,
        name: 'History',
        onPress: () => {
          navigation.navigate('history');
        },
      },
    ];
    if (user?.company === 'ICPI') {
      return ListMenus.filter(el => {
        return el.name !== 'Order';
      });
    }

    return ListMenus;
  }, [navigation, t, user?.company]);
  return (
    <View style={styles.container}>
      <View style={styles.containerMenu}>
        {memoListMenus.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}>
              <TouchableOpacity onPress={item.onPress}>
                <Image
                  source={item.image}
                  resizeMode="stretch"
                  style={{
                    width: 80,
                    height: 80,
                    marginTop: item.name === 'History' ? 2 : 0,
                  }}
                />

                <Text
                  center
                  fontFamily="NotoSans"
                  style={{
                    position: 'relative',
                    bottom: item.name === 'History' ? 1 : 0,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={styles.body}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={images.News}
            style={{
              height: 100,
              width: 110,
            }}
          />
          <Text color="text3">{t('screens.HomeScreen.news')}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
    bottom: 24,
    backgroundColor: 'white',
  },
  containerMenu: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
