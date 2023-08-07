import { Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import SearchInput from '../../components/SearchInput/SearchInput';
import { productServices } from '../../services/ProductServices';
import { ProductFreebies } from '../../entities/productType';
import ImageCache from '../../components/ImageCache/ImageCache';
import images from '../../assets/images';
import { ScrollView } from 'react-native-gesture-handler';
import icons from '../../assets/icons';
import DashedLine from 'react-native-dashed-line';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import { SubmitButton } from '../../components/Form/SubmitButton';
import Button from '../../components/Button/Button';


interface Props {
    navigation?: any;
    route?: any
  }

export default function FreeSpeciaRequestScreen({ navigation,route }: Props) {
    const [page, setPage] = React.useState<number>(1);
    const [searchValue, setSearchValue] = React.useState<string | undefined>();
    const [freebies,setFreebies] = useState<ProductFreebies>([])

    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelect = (idx) => {
      if (selectedItems.includes(idx)) {
        setSelectedItems(prev => prev.filter(i => i !== idx));
      } else if (selectedItems.length < 2) {
        setSelectedItems(prev => [...prev, idx]);
      } else {
        alert("You can only select 2 items.");
      }
    };


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
<ScrollView showsVerticalScrollIndicator={false}>
        {freebies?.map((el,idx)=>(
           <TouchableOpacity key={idx} onPress={() => handleSelect(el)}>
             <View
             key={idx}
             style={{
               flexDirection: 'row',
              paddingVertical:20,
               flex: 1,
             backgroundColor:  selectedItems.includes(el) ? '#F8FAFF' : 'transparent' ,
               borderBottomColor: colors.border1,
               borderBottomWidth: 0.5,
               borderStyle: 'solid'
             }}>
             <View
               style={{
                 flexDirection: 'row',
                 flex: 1,
               
                 width:'80%'
               }}>
               {el.productFreebiesImage ? (
                 <ImageCache
                   uri={getNewPath(el.productImage)}
                   style={{
                     width: 72,
                     height: 72,
                   }}
                 />
               ) : (
                 <Image
                   source={images.emptyProduct}
                   style={{
                     width: 72,
                     height: 72,
                   }}
                 />
               )}
               <View
                 style={{
                   marginLeft: 16,
                   flex: 1,
                   alignSelf:'center'
                 }}>
                 <Text semiBold>{el.productName}</Text>
                 <View
                   style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                   }}>
                   <Text color="text3" fontSize={14}>
                   {el.description}
                   </Text>
                 </View> 
               </View>
             </View>
             <View style={{alignItems:'center',alignSelf:'center',width:40}}>
             {selectedItems.includes(el) && <Image source={icons.check} style={{width:20,height:20}}/>}
            
             </View>
             
          
           </View>
          
           </TouchableOpacity>
           
        ))}
        </ScrollView>
       
</Content>

<FooterShadow
              style={{
                position: 'absolute',
                bottom: 0,
              }}>
              <Button
              disabled={selectedItems.length===0}
                style={{
                  height: 50,
                  marginBottom: 16,
                }}
                onPress={() => {
                 console.log(selectedItems)
                }}
                title="เพิ่มของแถม"
              iconBack={
                selectedItems.length>0?
            <View style={{backgroundColor:'#135CC6',paddingVertical:1,paddingHorizontal:10,marginLeft:5,borderRadius:6,alignSelf:'center'}}>
  <Text fontFamily='NotoSans' bold fontSize={16}  color='white'>{selectedItems.length + ' รายการ'}</Text>
            </View>
              
           
              : null
              }
              />
            </FooterShadow>

</KeyboardAvoidingView>
        </Container>
    )

}