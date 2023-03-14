import { Dimensions, FlatList, Image, View } from 'react-native';
import React, { useMemo } from 'react';
import Text from '../../components/Text/Text';
import images from '../../assets/images';
import { HistoryDataType } from '../../entities/historyTypes';
import HistoryItemArea from './HistoryItemArea';
import CustomerItem from './CustomerItem';
import { HistoryTypeStore } from '.';

interface Props {
  data: HistoryDataType[];
  navigation?: any;
  fetchDataMore: () => Promise<void>;
  typeSearch?: string;
  dataCustomer?: HistoryTypeStore[];
  setCustomerCompanyId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  customerCompanyId: number | undefined;
}
export default function ContentBody({
  data = [],
  navigation,
  fetchDataMore,
  typeSearch,
  dataCustomer,
  setCustomerCompanyId,
  customerCompanyId,
}: Props) {
  const EmptyItem = () => {
    return (
      <View
        style={{
          minHeight: Dimensions.get('window').height / 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={images.emptyGift}
          style={{
            width: 140,
            height: 140,
          }}
        />
        <Text fontFamily="NotoSans" color="text3">
          ไม่พบรายการสินค้า
        </Text>
      </View>
    );
  };
  const onPressCustomer = (id: number) => {
    setCustomerCompanyId(id);
  };
  const isHasCustomerId = useMemo(() => {
    return !!customerCompanyId;
  }, [customerCompanyId]);
  return typeSearch === 'area' || customerCompanyId ? (
    <FlatList
      data={data}
      contentContainerStyle={{
        padding: 16,
      }}
      onEndReached={fetchDataMore}
      onEndReachedThreshold={0.2}
      keyExtractor={(item, index) => item.orderId.toString() + index}
      ListEmptyComponent={EmptyItem}
      renderItem={({ item }) => {
        return (
          <HistoryItemArea
            {...item}
            navigation={navigation}
            isHasCustomerId={isHasCustomerId}
          />
        );
      }}
    />
  ) : (
    <FlatList
      data={dataCustomer}
      contentContainerStyle={{
        padding: 16,
      }}
      keyExtractor={(item, index) => item.customerCompanyId.toString() + index}
      ListEmptyComponent={EmptyItem}
      renderItem={({ item: i }) => {
        return (
          <CustomerItem
            navigation={navigation}
            {...i}
            onPress={onPressCustomer}
          />
        );
      }}
    />
  );
}
