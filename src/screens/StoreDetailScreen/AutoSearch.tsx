import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { Dimensions, Image, Pressable, View } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { productServices } from '../../services/ProductServices';
import { useAuth } from '../../contexts/AuthContext';
import { string } from 'yup';
import Text from '../../components/Text/Text';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';

type productName = {
  id: string;
  title: string;
};

function AutoSearch({ onSearch }): React.ReactElement {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const [remoteDataSet, setRemoteDataSet] = useState<productName[]>([]);
  const {
    state: { user },
  } = useAuth();

  const getSuggestions = useCallback(async q => {
    const res: { productName: string }[] =
      await productServices.getAllNameProduct(user?.company || '');
    const productsWithTitles: productName[] = res.map((item, idx) => ({
      id: String(idx),
      title: item.productName.trim(),
    }));
    const uniqueProducts = Array.from(
      new Map(productsWithTitles.map(item => [item.title, item])).values(),
    );

    const filterToken = q.toLowerCase();

    const suggestions = uniqueProducts.filter(item =>
      item.title.toLowerCase().includes(filterToken),
    );

    setRemoteDataSet(suggestions);
    setLoading(false);
  }, []);

  /* const fetchProduct = async () => {
    setLoading(true);
    try {
        const res: { productName: string }[] = await productServices.getAllNameProduct(user?.company || '');
        const productsWithTitles: productName[] = res.map((item, idx) => ({
            id: String(idx), 
            title: item.productName.trim(),
        }));
        const uniqueProducts = Array.from(new Map(productsWithTitles.map(item => [item.title, item])).values());

        setAllProduct(uniqueProducts); 
       
    } catch (error) {
        console.error("Failed to fetch products:", error);
    } finally {
        setLoading(false);
    }
}; */

  /* useEffect( () => {
    
     fetchProduct()
  }, []); */

  return (
    <View>
      <View
        style={{
          borderWidth: 1,
          borderColor: isFocused ? colors.text1 : colors.border1,
          borderRadius: 6,
        }}>
        <AutocompleteDropdown
          loading={loading}
          onFocus={() => {
            setIsFocused(true);
          }}
          inputContainerStyle={{ backgroundColor: 'white' }}
          /*  direction='down' */
          showChevron={false}
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={true}
          onSelectItem={v => {
            onSearch(v?.title);

            setQuery(v?.title || '');
          }}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.3}
          dataSet={remoteDataSet}
          suggestionsListTextStyle={{ borderBottomWidth: 0 }}
          onBlur={t => {
            onSearch(query);
            setIsFocused(false);
          }}
          emptyResultText="ไม่พบสินค้าที่ค้นหา"
          LeftComponent={
            <View
              style={{
                paddingTop: 10,
                paddingLeft: 10,
                backgroundColor: 'white',
              }}>
              <Image
                source={icons.search}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </View>
          }
          ItemSeparatorComponent={<View style={{ height: 0 }} />}
          textInputProps={{
            placeholder: 'ค้นหาสินค้า...',
            returnKeyType: 'search',
            style: { borderRadius: 8 },
            onChangeText: e => {
              setQuery(e);
              getSuggestions(e);
            },
            value: query,
          }}
          rightButtonsContainerStyle={{ backgroundColor: 'white' }}
        />
      </View>
    </View>
  );
}
export default AutoSearch;
