import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import CardItem from './CardItem';
import EmptySpecialRequest from './EmptySpecialRequest';
import { SpecialRequestType } from '../../contexts/SpecialRequestContext';

interface Props {
  currentTab: number;
  data: {
    data: SpecialRequestType[];
    count: number;
  };
  navigation: any;
  getSpecialRequest: () => Promise<void>;
  onLoadMore: () => void;
}

const mappingTab = {
  0: 'รายการที่ต้องอนุมัติ',
  1: 'รายการที่อนุมัติแล้ว',
  2: 'รายการที่ไม่อนุมัติ',
};

export default function ListFlatList({
  currentTab,
  data,
  navigation,
  getSpecialRequest,
  onLoadMore,
}: Props) {
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getSpecialRequest();
      setRefreshing(false);
    } catch (error) {
      console.log('error', error);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text fontFamily="NotoSans" fontSize={14} semiBold>
          {mappingTab[currentTab as keyof typeof mappingTab]}
        </Text>
        <Text
          fontFamily="Sarabun"
          fontSize={14}
          color="text3"
          semiBold>{`${data.count} รายการ`}</Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollIndicatorInsets={{ right: 1 }}
        style={{ paddingTop: 4 }}
        data={data.data}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.05}
        keyExtractor={(item, index) =>
          item.orderId.toString() + index + Math.random()
        }
        contentContainerStyle={{
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
        renderItem={({ item }) => {
          return <CardItem navigation={navigation} item={item} />;
        }}
        ListEmptyComponent={<EmptySpecialRequest />}
        ListFooterComponent={
          <View
            style={{
              height: 40,
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
