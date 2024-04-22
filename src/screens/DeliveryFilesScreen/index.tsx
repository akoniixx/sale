import {
  ActivityIndicator,
  View,
  Modal as ModalRN,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import ImageViewer from 'react-native-image-zoom-viewer';
import icons from '../../assets/icons';
import Content from '../../components/Content/Content';
import DashedLine from 'react-native-dashed-line';
import { colors } from '../../assets/colors/colors';
import Text from '../../components/Text/Text';

type DeliveryFilesScreenProps = StackScreenProps<
  MainStackParamList,
  'DeliveryFilesScreen'
>;
export default function DeliveryFilesScreen({
  route,
}: DeliveryFilesScreenProps) {
  const [viewUrl, setViewUrl] = React.useState('');
  const { deliveryFiles } = route.params;
  const viewImage = (url: string) => {
    setViewUrl(url);
  };

  return (
    <Container>
      <Header title="ไฟล์การจัดส่ง" />
      <Content>
        {deliveryFiles?.map((item, idx) => {
          const fileParts = item.split('/');
          const findPngOrJpg = fileParts.find(el => {
            return el.includes('.png') || el.includes('.jpg');
          });
          const splitQuery = findPngOrJpg?.split('?');

          return (
            <View style={{ marginTop: 10 }} key={idx}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    maxWidth: '60%',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 4,
                      marginRight: 20,
                    }}
                  />
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {splitQuery?.[0] || 'ไฟล์เอกสาร' + idx + '.png'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => viewImage(item)}>
                    <Image
                      source={icons.viewDoc}
                      style={{ width: 25, height: 25, marginRight: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <DashedLine
                dashColor={colors.border2}
                dashGap={0}
                dashLength={1}
                style={{
                  marginTop: 20,
                }}
                dashThickness={1}
              />
            </View>
          );
        })}
      </Content>

      <ModalRN
        animationType="fade"
        onRequestClose={() => {
          setViewUrl('');
        }}
        visible={!!viewUrl}
        transparent>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => {
              setViewUrl('');
            }}>
            <Image
              source={icons.closeBlack}
              style={{ width: 24, height: 24, marginRight: 20 }}
            />
          </TouchableOpacity>
          <View style={[styles.modalView]}>
            <ImageViewer
              minScale={0.5}
              backgroundColor="rgba(0,0,0,0)"
              imageUrls={[{ url: viewUrl }]}
              style={{ width: '100%', height: '100%' }}
              renderIndicator={() => <></>}
              loadingRender={() => (
                <ActivityIndicator
                  animating={true}
                  size={'large'}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                />
              )}
              renderHeader={() => <></>}
            />
          </View>
        </View>
      </ModalRN>
    </Container>
  );
}

const styles = StyleSheet.create({
  modalView: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 20,
    backgroundColor: 'white',

    height: '60%',

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
  },
});
