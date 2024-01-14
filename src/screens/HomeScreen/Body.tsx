import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useAuth } from '../../contexts/AuthContext';
import { NewsPromotionService } from '../../services/NewsService/NewsPromotionServices';
import NewsPromotionCarousel from '../../components/Carousel/NewsPromotionCarousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewsList from '../../components/News/NewsList';
import { ScrollView } from 'react-native-gesture-handler';
import { NewsService } from '../../services/NewsService/NewsServices';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function Body({ navigation }: Props): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { user },
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(false)
  const [NewsPromotion, setNewsPromotion] = useState<NewsPromotion[]>([])
  const [newsList, setNewsList] = useState<Pined[]>([])
  const fecthNewsPromotion = async () => {
    try {
      setLoading(true)
      const company = await AsyncStorage.getItem('company')
      const zone = await AsyncStorage.getItem('zone')
      const res = await NewsPromotionService.getNewsPromotion(company || '', zone || '')
      const sortedData: NewsPromotion[] = await res.data.sort((a: NewsPromotion, b: NewsPromotion) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      setNewsPromotion(sortedData.slice(0, 5))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const fecthNewsList = async () => {
    try {
      setLoading(true)
      const company = await AsyncStorage.getItem('company')
      const res: Pined[] = await NewsService.getPined(company || '')
      const filterData: Pined[] = await res.filter((item) => item.page === 'MAIN_PAGE')
      const resNews: NewsInterface[] = await NewsService.getNewsList(company || '', 1, 99, 'NEWEST', '')

      if (res.length < 5) {
        const joinArray = res.concat(resNews)
        setNewsList(joinArray)
      } else {
        setNewsList(filterData)
      }



    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fecthNewsPromotion()
    fecthNewsList()
  }, [])

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

  const renderPromotion = () => (
    <>
      {NewsPromotion?.length > 0 ? <View style={{ paddingHorizontal: 20, marginTop: 20 }} >
        <Text bold fontSize={18} fontFamily='NotoSans' >โปรโมชั่น</Text>


      </View> :


newsList?.length ==0 ? 
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50
          }}>
          <Image
            source={images.News}
            style={{
              height: 100,
              width: 110,
            }}
          />
          <Text color="text3">{t('screens.HomeScreen.news')}</Text>
        </View>: null
      }

      <View style={{ alignItems: 'center' }}>
        <NewsPromotionCarousel data={NewsPromotion} loading={loading} navigation={navigation} />
      </View>
    </>
  )

  const renderNews = () => (
    <View style={{ marginBottom: 40 }}>
      {newsList?.length > 0 ? <View style={{ paddingHorizontal: 20, marginTop: 20 }} >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text bold fontSize={18} fontFamily='NotoSans' >ข่าวสาร</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NewsScreen')}>
            <Text semiBold fontSize={14} color='text3' fontFamily='NotoSans' >ทั้งหมด</Text>
          </TouchableOpacity>

        </View>



      </View> :
        <View style={{ paddingHorizontal: 20, marginTop: 50 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text bold fontSize={18} fontFamily='NotoSans' >ข่าวสาร</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewsScreen')}>
              <Text semiBold fontSize={14} color='text3' fontFamily='NotoSans' >ทั้งหมด</Text>
            </TouchableOpacity>

          </View>
          <View
            style={{
              flex: 1,
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
      }

      <View style={{ paddingLeft: 20, marginTop: 10 }}>
        <NewsList data={newsList} loading={loading} navigation={navigation} />
      </View>
    </View>
  )

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
      <ScrollView>
        {newsList?.length <= 0 && NewsPromotion?.length <= 0 ?
          <>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '10%'
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
          </> : <>
            {renderPromotion()}


            {renderNews()}
          </>
        }



      </ScrollView>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',

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
