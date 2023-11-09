import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useAuth } from '../../contexts/AuthContext';
import { NewsPromotionService } from '../../services/NewsPromotionServices';
import NewsPromotionCarousel from '../../components/Carousel/NewsPromotionCarousel';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function Body({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { user },
  } = useAuth();
  const [loading,setLoading] = useState<boolean>(false)
  const [NewsPromotion,setNewsPromotion] = useState<NewsPromotion[]>([])
  const fecthNewsPromotion = async() => {
      try {
        setLoading(true)
        const company = await AsyncStorage.getItem('company')
        const zone = await AsyncStorage.getItem('zone')
        const res = await NewsPromotionService.getNewsPromotion(company||'',zone||'')
        const sortedData: NewsPromotion[] = await res.data.sort((a: NewsPromotion, b: NewsPromotion) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        
        setNewsPromotion(sortedData.slice(0, 5))
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
  }

  useEffect(()=>{
fecthNewsPromotion()
  },[])

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
      {NewsPromotion?.length>0?<View style={{paddingHorizontal:20,marginTop:20}} >
       <Text bold fontSize={18} fontFamily='NotoSans' >โปรโมชั่น</Text>

       
      </View>:     
        <View
          style={{
            flex:1,
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
}
     
      <View style={{alignItems:'center'}}>
      <NewsPromotionCarousel data={NewsPromotion} loading={loading} navigation={navigation}  />
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
    
    padding: 20,
  },
});
