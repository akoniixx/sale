import { Image, KeyboardAvoidingView, Platform, TouchableOpacity, View ,Alert} from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../components/Text/Text';
import { colors } from '../../assets/colors/colors';
import { getNewPath, numberWithCommas } from '../../utils/functions';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import SearchInput from '../../components/SearchInput/SearchInput';
import { productServices } from '../../services/ProductServices';
import { ProductFreebies, ProductType, SpFreebies } from '../../entities/productType';
import ImageCache from '../../components/ImageCache/ImageCache';
import images from '../../assets/images';
import { ScrollView } from 'react-native-gesture-handler';
import icons from '../../assets/icons';
import DashedLine from 'react-native-dashed-line';
import FooterShadow from '../../components/FooterShadow/FooterShadow';
import { SubmitButton } from '../../components/Form/SubmitButton';
import Button from '../../components/Button/Button';
import ModalWarning from '../../components/Modal/ModalWarning';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Props {
  navigation?: any;
  route?: any
}


export default function FreeSpeciaRequestScreen({ navigation, route }: Props) {
  const [page, setPage] = React.useState<number>(1);
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [freebies, setFreebies] = useState<SpFreebies[]>([])
  const [product,setProduct] = useState<SpFreebies[]>([])
  const [selectedItems, setSelectedItems] = useState<SpFreebies[]>([]);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [debounceSearchValue, setDebounceSearchValue] = useState<string | undefined>('');
  const [type, setType] = React.useState<string>('product');
  const headerList = [
    {
      id: 'product',
      title: 'สินค้าแบรนด์ตัวเอง',
    },
    {
      id: 'freebies',
      title: 'สินค้าอื่นๆ'
    },
  ];

  
  
  const {
    state: { user },
  } = useAuth();

  const {
    cartDetail,
    cartList,
    cartApi: { postCartItem },
  } = useCart();

  const handleSelect = (idx: SpFreebies) => {
    if (selectedItems.some(item =>item.productFreebiesId? item.productFreebiesId === idx.productFreebiesId:item.productId===idx.productId)) {
      setSelectedItems(prev => prev.filter(i =>i.productFreebiesId? i.productFreebiesId !== idx.productFreebiesId: i.productId!==idx.productId));
    } else  {
      const itemWithQuantity = { ...idx, quantity: 1 };
      setSelectedItems(prev => [...prev, itemWithQuantity]);
    } 
  };

  const getFreebies = async () => {
    setLoading(true)
    const payload: any ={
      company: user?.company,
      searchText: searchValue
    }
    try {
      const res = await productServices.getProductFree(payload)
      setFreebies(res.data)
      setLoading(false)
    } 
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  const getProduct = async () => {
    setLoading(true)
    try {
      const customerCompanyId = await AsyncStorage.getItem('customerCompanyId');
      const productB = await AsyncStorage.getItem('productBrand');

      const pB = JSON.parse(productB || '{}');
      const result = await productServices.getAllProducts({
        company: user?.company,
        page: 1,
        take: 99,
        searchText: searchValue,
        customerCompanyId: customerCompanyId || '',
        productBrandId: pB?.product_brand_id,
       
      });
      const updatedProducts = result.data.map(product => {
        const newProduct = { ...product }; // Create a copy of the object
        delete newProduct.promotion; // Remove the 'promotion' field
        return newProduct;
      });
    setProduct(updatedProducts)
      setLoading(false)
    } 
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }

    
  }

  const onSearch = (v: string | undefined) => {
    setDebounceSearchValue(v);
  };

  const onConfirm = async() => {
    setVisibleConfirm(false)
    try {
      setLoading(true);
      await postCartItem(cartList,selectedItems)
      navigation.navigate('SpecialRequestScreen')
      
     
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(cartDetail?.specialRequestFreebies){
      
      let selected = Array.from(new Set([...cartDetail?.specialRequestFreebies,...selectedItems]))
      
      setSelectedItems(selected)

    }
    getProduct()
    getFreebies()
  }, [debounceSearchValue])

  const renderFreebies = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
      flexGrow: 1,

      paddingBottom: 70
    }}>
      {freebies?.map((el, idx) => (
        <TouchableOpacity key={idx} onPress={() => handleSelect(el)}>
         
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              flex: 1,
              backgroundColor: selectedItems.some(item=>item.productFreebiesId === el.productFreebiesId) ? '#F8FAFF' : 'transparent',
              borderBottomColor: colors.border1,
              borderBottomWidth: 0.5,
              borderStyle: 'solid'
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,

                width: '80%'
              }}>
               
              {el.productFreebiesImage ? (
                <ImageCache
                  uri={getNewPath(el.productFreebiesImage)}
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
                  alignSelf: 'center'
                }}>
                <Text semiBold>{el.productName}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'center', alignSelf: 'center', width: 40 }}>
              {selectedItems.some(item=>item.productFreebiesId === el.productFreebiesId) && <Image source={icons.check} style={{ width: 20, height: 20 }} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  const renderProduct = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
      flexGrow: 1,

      paddingBottom: 70
    }}>
      {product?.map((el, idx) => (
        <TouchableOpacity key={idx} onPress={() => handleSelect(el)}>
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              flex: 1,
              backgroundColor: selectedItems.some(item=>item.productId === el.productId) ? '#F8FAFF' : 'transparent',
              borderBottomColor: colors.border1,
              borderBottomWidth: 0.5,
              borderStyle: 'solid'
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,

                width: '80%'
              }}>
              {el.productImage ? (
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
                  alignSelf: 'center'
                }}>
                <Text semiBold>{el.productName}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text color="text3" fontSize={14}>
                    {el.packSize}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'center', alignSelf: 'center', width: 40 }}>
              {selectedItems.some(item=>item.productId === el.productId) && <Image source={icons.check} style={{ width: 20, height: 20 }} />}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  return (
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
        <View
            style={{
              marginBottom:20
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                backgroundColor: colors.background3,
                height: 46,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: colors.background3,
              }}>
              {headerList?.map(item => {
                return (
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      borderRadius: 6,
                      backgroundColor:
                        type === item.id ? 'white' : 'transparent',
                    }}
                    key={item.id}
                    onPress={() => {
                      setType(item.id);
                    }}>
                    <Text fontFamily="NotoSans" semiBold>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
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
         

                {type==='product'?
                 renderProduct()
                
            :
            renderFreebies()
              }
         
        </Content>
        <FooterShadow
          style={{
            position: 'absolute',
            bottom: 0,
          }}>
          <Button
            disabled={selectedItems.length === 0}
            style={{
              height: 50,
              marginBottom: 16,
            }}
            onPress={() => {
              setVisibleConfirm(true)
            }}
            title="เพิ่มของแถม"
            iconBack={
              selectedItems.length > 0 ?
                <View style={{ backgroundColor: '#135CC6', paddingVertical: 1, paddingHorizontal: 10, marginLeft: 5, borderRadius: 6, alignSelf: 'center' }}>
                  <Text fontFamily='NotoSans' bold fontSize={16} color='white'>{selectedItems.length + ' รายการ'}</Text>
                </View>
                : null
            }
          />
        </FooterShadow>
      </KeyboardAvoidingView>
      <ModalWarning
          visible={visibleConfirm}
          title="ยืนยันการเพิ่มของแถม"
          desc={`ต้องการยืนยันการเพิ่มของแถม Special Request ${selectedItems.length} รายการ ใช่หรือไม่ ?`}
          onConfirm={async () => {
            await onConfirm();
          }}
          onRequestClose={() => setVisibleConfirm(false)}
        />
         <LoadingSpinner visible={loading} />
    </Container>
  )

}