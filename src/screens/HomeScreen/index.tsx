import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import images from '../../assets/images';
import Text from '../../components/Text/Text';
import Body from './Body';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Modal from '../../components/Modal/Modal';
import HightlightPopup from '../../components/Popup/HightlightPopup';
import { NewsPromotionService } from '../../services/NewsService/NewsPromotionServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: StackNavigationHelpers;
}
export default function HomeScreen({ navigation }: Props): JSX.Element {
  const {
    state,
    authContext: { getUser },
  } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [highlight,setHighLight] = useState<HighlightNews[]>([])
  const [modalVisible,setModalVisible] = useState<boolean>(true)


const fetchHitglight = async() => {
  try {
    setLoading(true)
    const company = await AsyncStorage.getItem('company')
    const res = await NewsPromotionService.getHighlight(company||'')
     setHighLight(res.data)
   
  } catch (error) {
    console.log(error)
  }
  finally{
    setLoading(false)
  }

}

useEffect(()=>{
  fetchHitglight()
},[])

  useEffect(() => {
    
    if (!state?.user?.userStaffId) {
      try {
        setLoading(true)
        getUser();
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    
    }
  }, [state?.user, getUser]);

  const name = state.user?.firstname || '';

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
                {`สวัสดี, ${name}`}
              </Text>
              <Text color="white" fontSize={14} fontFamily="NotoSans">
                {state.user?.role}
              </Text>
            </View>
            <View style={styles.circle}>
              {state.user?.profileImage ? (
                <Image
                  source={{
                    uri: state.user?.profileImage,
                    cache: 'reload',
                  }}
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 62 / 2,
                  }}
                />
              ) : (
                <Text fontFamily="NotoSans" fontSize={24} color="primary">
                  {name.charAt(0)}
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>
        <Body navigation={navigation} />
      </Content>
      {highlight[0]?.status&& 
      <HightlightPopup visible={modalVisible} imgUrl={highlight[0]?.imageUrl||''} onRequestClose={()=>setModalVisible(false)} url={highlight[0]?.url} />}
     
       
     
      <LoadingSpinner visible={loading} />
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
