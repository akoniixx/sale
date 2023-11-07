import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { productServices } from "../../services/ProductServices";
import { useAuth } from "../../contexts/AuthContext";
import { string } from "yup";
import Text from "../../components/Text/Text";
import icons from "../../assets/icons";


type productName = {
    id:string
    title: string
  }

function AutoSearch({onSearch}):React.ReactElement{
    const [allProduct, setAllProduct] = useState<productName[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false)
  const {
    state: { user },
  } = useAuth();
 
  
  const fetchProduct = async () => {
    const res: { productName: string }[] = await productServices.getAllNameProduct(user?.company||'')

    const productsWithTitles = res.map((item,idx) => ({
        id:idx,
        title: item.productName.trim(), 
      }));
    
      const uniqueProducts = [...new Map(productsWithTitles.map(item => [item["title"], item])).values()];
   
    setAllProduct(uniqueProducts)
 
  }

  
  useEffect(() => {
    fetchProduct()
  }, []);
 return(
    <View>
        <AutocompleteDropdown 
       inputContainerStyle={{backgroundColor:'white'}}
        direction='down'
       showChevron={false}
        clearOnFocus={false}
        closeOnBlur={true}
        closeOnSubmit={false}
       onSelectItem={v=>onSearch(v?.title)}
       suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
        dataSet={allProduct}
        suggestionsListTextStyle={{borderBottomWidth:0}}
        emptyResultText="ไม่พบสินค้าที่ค้นหา"
        LeftComponent={
        <View style={{paddingTop:10,paddingLeft:10,backgroundColor:'white'}}>
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
        
       }}
       containerStyle={{borderWidth:0.2}}
       rightButtonsContainerStyle={{backgroundColor:'white'}}
        />
    </View>
 )
}
export default  AutoSearch