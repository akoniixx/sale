import Autocomplete from 'react-native-autocomplete-input';
import React, { useEffect, useState } from 'react';


import {

  StyleSheet,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';
import { productServices } from '../../services/ProductServices';
import { useAuth } from '../../contexts/AuthContext';

function AutoSearch({onChange,onSearch}): React.ReactElement {
  const [allProduct, setAllProduct] = useState<productName[]>([]);
  const [query, setQuery] = useState('');
  const isLoading = !allProduct.length;
  const queriedProduct = React.useMemo(
    () => filterMovies(allProduct, query),
    [allProduct, query]
  );

  type productName = {

    productName: string
  }

  const {
    state: { user },
  } = useAuth();
  function filterMovies(product: productName[], query?: string): productName[] {
    if (!query || !product.length) {
      return [];
    }
    const regex = new RegExp(`${query}`, 'i');
    return product.filter((p) => p.productName.search(regex) >= 0 );
  }
  let suggestions: productName[] = React.useMemo(
    () =>
    queriedProduct.length === 1 && queriedProduct[0].productName === query
        ? [] 
        : queriedProduct,
    [queriedProduct, query]
  );
  const fetchProduct = async () => {
    const res = await productServices.getAllNameProduct(user?.company||'')
    const uniqueProducts = [...new Map(res.map(item => [item["productName"].trim(), item])).values()];
    setAllProduct(uniqueProducts)
  }

  const placeholder = isLoading
    ? 'Loading data...'
    : 'ค้นหาสินค้า...';

  useEffect(() => {
    fetchProduct()
  }, []);

  return (

    <View style={styles.autocompleteContainer}>
      <Autocomplete
        editable={!isLoading}
        autoCorrect={false}
        data={suggestions}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
        flatListProps={{
          keyboardShouldPersistTaps: 'always',
          keyExtractor: (movie: productName, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity onPress={() => {
              suggestions= []
              onSearch(item.productName)
              setQuery(item.productName)}}>
              <Text >{item.productName}</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
    padding: 5,
  },
});

export default AutoSearch;
