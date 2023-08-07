import { KeyboardAvoidingView, Platform, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import { numberWithCommas } from '../../utils/functions';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import SearchInput from '../../components/SearchInput/SearchInput';
import { productServices } from '../../services/ProductServices';
import { ProductFreebies } from '../../entities/productType';


interface Props {
    navigation?: any;
    route?: any
  }

export default function FreeSpeciaRequestScreen({ navigation,route }: Props) {
    const [page, setPage] = React.useState<number>(1);
    const [searchValue, setSearchValue] = React.useState<string | undefined>();
    const [freebies,setFreebies] = useState<ProductFreebies>([])


    const getFreebies = async () => {
      try {
        const res = await productServices.getProductFree('ICPL')
        setFreebies(res.data)
      } catch (error) {
        console.log(error)
      }
    }

    const onSearch = (v: string | undefined) => {
      
      };
    useEffect(()=>{
        getFreebies()
    },[])

    return(
        <Container>
             <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          width: '100%',
        }}>
        <Header
          title="เพิ่มของแถม (Special Req.) "
         /*  onBackCustom={() => {
            navigation.navigate('CartScreen', {
              specialRequestRemark: specialRequestRemark,
              step: 1,
            });
          }} */
        />
<Content>
<SearchInput
          onSearch={onSearch}
          value={searchValue}
          style={{
            width: '100%',
          }}
          placeholder={'ค้นหาของแถม...'}
          onChange={v => {
            setSearchValue(v);
            setPage(1);
          }}
        />

        {freebies?.map((item)=>(
            <View key={item.productFreebiesId}>
                <Text color="text2">
                    {item.productName}
                </Text>
            </View>
        ))}
        
       
</Content>

</KeyboardAvoidingView>
        </Container>
    )

}