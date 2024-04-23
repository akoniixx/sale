import { TouchableOpacity, View } from 'react-native';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';
import React from 'react';
import ImageCache from '../ImageCache/ImageCache';
import dayjs from 'dayjs';

interface Props {
  data: NewsInterface | Pined;
  navigation?: any;
  allScreen?: boolean;
  loading?: boolean;
}
export default function NewsCard({ data, navigation, loading }: Props) {
  const tag = (type: string) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.border2,
        width: 60,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 10,
      }}>
      <Text color="text2" lineHeight={20} style={{ fontSize: 10 }}>
        {type === 'NEWS' ? 'ข่าวสาร' : 'คลังความรู้'}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('NewsDetailScreen', {
          newsId: data.newsId,
        })
      }
      style={{ flexDirection: 'row' }}>
      <View>
        <ImageCache
          uri={data.imageUrl}
          style={{ width: 120, height: 120 }}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          flex: 1,
          padding: 20,
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Text
          bold
          numberOfLines={2}
          lineHeight={25}
          style={{ overflow: 'hidden' }}>
          {data.topic}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text color="text2" style={{ marginTop: 10, fontSize: 12 }}>
            {dayjs(data.createdAt).format('DD MMM BBBB')}
          </Text>
          <Text
            color="text2"
            style={{
              marginTop: 10,
              fontSize: 12,
              marginLeft: 15,
            }}>{`อ่าน ${data.viewSaleApp}`}</Text>
        </View>

        {tag(data.type)}
      </View>
    </TouchableOpacity>
  );
}
