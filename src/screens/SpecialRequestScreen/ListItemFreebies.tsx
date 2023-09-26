import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageCache from '../../components/ImageCache/ImageCache';
import { getNewPath } from '../../utils/functions';
import CounterSmall from '../CartScreen/CounterSmall';
import Text from '../../components/Text/Text';
import { useCart } from '../../contexts/CartContext';
import images from '../../assets/images';
import icons from '../../assets/icons';
import { colors } from '../../assets/colors/colors';
import ModalMessage from '../../components/Modal/ModalMessage';
import { useLocalization } from '../../contexts/LocalizationContext';
import ModalWarning from '../../components/Modal/ModalWarning';
import { productServices } from '../../services/ProductServices';
import { useAuth } from '../../contexts/AuthContext';
import { ProductFreebies, SpFreebies } from '../../entities/productType';
import { Dropdown } from 'react-native-element-dropdown';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const ListItemFreebies = () => {
  const { cartList, cartDetail, cartApi: { postCartItem }, } = useCart();
  const { state: { user } } = useAuth()
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleDel, setVisibleDel] = useState(false);
  const [delId, setDelId] = React.useState<string | number>('');
  const { t } = useLocalization();
  const [spFreebiesList, setSpFreebiesList] = useState<SpFreebies[]>([])

  const getBaseToFreebies = async () => {
    try {
      const updatedList = await Promise.all(
        cartDetail.specialRequestFreebies.map(async (product) => {
          try {
            const res = await productServices.getBaseFreebies(user?.company || '', product.productFreebiesCodeNAV?product.productFreebiesCodeNAV:product.productCodeNAV);
           
           
             /*  if (res && res.length > 0) {
                const { unit_desc: unitDesc } = res[0];
                return {
                  ...product,
                  base: res,
                  baseUnitOfMeaTh: unitDesc || product.baseUnitOfMeaTh,
                };
              } */
            

            return { ...product, base: res || [] };
          } catch (error) {
            console.error('Error getting base freebies for product', product, error);
            return product; // return the original product if there is an error
          }
        })
      );

      setSpFreebiesList(updatedList);
    } catch (error) {
      console.error('Error processing special request freebies', error);
    }
  }

  useEffect(() => {
    getBaseToFreebies()

  }, [cartDetail.specialRequestFreebies])

  const onIncrease = async (id: string | number) => {
    try {
      setLoading(true);
      const findIndex = spFreebiesList.findIndex(
        item =>   item?.productFreebiesId? item?.productFreebiesId === id : item?.productId ===id
      );
      if (findIndex !== -1) {
        const newSpFb = spFreebiesList
        newSpFb[findIndex].quantity += 1
        await postCartItem(cartList, newSpFb)
      }
    } catch (e) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  };
  const onDecrease = async (id: string | number) => {
    try {
      setLoading(true);
      const findIndex = spFreebiesList.findIndex(
        item => item?.productFreebiesId? item?.productFreebiesId === id : item?.productId ===id
      );
      if (findIndex !== -1) {

        const newSpFb = spFreebiesList
        if (newSpFb[findIndex].quantity > 1) {
          newSpFb[findIndex].quantity -= 1
          await postCartItem(cartList, newSpFb)
        } else {
          setIsDeleting(true)
          const spfb = await newSpFb.filter(item => item?.productFreebiesId !== id);
          await postCartItem(cartList, spfb)
        }

      }

    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const onChangeText = async ({
    quantity,
    id,
  }: {
    quantity: string;
    id?: any;
  }) => {
    const findIndex = spFreebiesList.findIndex(
      item => item?.productFreebiesId? item?.productFreebiesId === id : item?.productId ===id
    );
    if (+quantity <= 0 && findIndex !== -1) {
      setVisibleDel(true);
      setDelId(id);
    }
    if (findIndex !== -1) {
      try {
        setLoading(true)
        const spfb = spFreebiesList
        spfb[findIndex].quantity = Number(quantity);
        await postCartItem(
          cartList, spfb
        );

      } catch (e) {
        console.log('error', e);
      } finally {
        setLoading(false);
      }
    }
  };

  const onDelete = async (id: string | number) => {
    try {
      setLoading(true);
      
      const spfb = await spFreebiesList.filter(item => item?.productFreebiesId !== id && item?.productId !==id);
      await postCartItem(cartList, spfb)
      setDelId('')
      setVisibleDel(false)

    } catch (e) {
      console.log('error', e);
    } finally {
      setIsDeleting(true)
      setLoading(false);
    }
  };

  const onSelectDropDown = async (e: any, id: string) => {
    try {
      setLoading(true);
      const findIndex = spFreebiesList.findIndex(
        item => item?.productFreebiesId? item?.productFreebiesId === id : item?.productId===id,
      );
      if (findIndex !== -1) {
        const newSpFb = spFreebiesList
      if(spFreebiesList[findIndex].productFreebiesId){
        newSpFb[findIndex].baseUnitOfMeaTh = e.label
        newSpFb[findIndex].baseUnitOfMeaEn = e.value
      }
      else{
        newSpFb[findIndex].saleUOMTH = e.label
        newSpFb[findIndex].saleUOM = e.value
      }
    
       
        await postCartItem(cartList, newSpFb)
      }
    } catch (e) {
      console.log('error', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>


      {spFreebiesList.map((item) => (

        <View
          key={item.productFreebiesId}
          style={{
            marginTop: 16,
          }}>
          <View style={styles.containerItem}>
            <View style={styles.containerLeft}>
              {item?.productFreebiesImage ? (
                <ImageCache
                  uri={getNewPath(item?.productFreebiesImage)}
                  style={{
                    width: 62,
                    height: 62,
                    marginRight: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 62,
                    height: 62,
                    marginRight: 10,
                  }}>
                  <Image
                    style={{
                      width: 56,
                      height: 56,
                    }}
                    source={images.emptyProduct}
                  />
                </View>
              )}
              <View style={styles.itemContent}>
                <Text
                  fontFamily="NotoSans"
                  fontSize={16}
                  bold
                  style={{
                    width: Dimensions.get('window').width - 150,
                  }}
                  numberOfLines={1}>
                  {item.productName}
                </Text>
                <Text fontFamily="NotoSans" fontSize={14} color="text3">
                  {item?.description ? item?.description : null||item.packSize}
                </Text>


              </View>
            </View>
            <View
              style={{
                flex: 0.3,
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                style={styles.buttonDel}
                onPress={() => {
                  setDelId(item.productFreebiesId||item.productId);
                 
                  setVisibleDel(true);
                }}>
                <Image
                  source={icons.bin}
                  style={{
                    width: 15,
                    height: 17,
                    marginBottom: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
              <View
                style={{
                  width: 62,
                  marginRight: 10,
                }}
              />
              <CounterSmall
                isSpecialRequest={true}
                currentQuantity={item.quantity}
                onChangeText={onChangeText}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                id={item.productFreebiesId||item.productId}
              />
              {item.base.length > 1 ?
             

             
              <Dropdown data={item.base.map(obj => ({
                  label: obj.unit_desc,
                  value: obj.unit_code
                }))} labelField={'label'} valueField={'value'} value={item?.productFreebiesId?item.baseUnitOfMeaEn:item.saleUOM} onChange={e => {
                  onSelectDropDown(e, item?.productFreebiesId?item.productFreebiesId:item.productId)
                }}
                  style={styles.dropdown} selectedTextStyle={{ marginHorizontal: 10, fontFamily: 'NotoSansThai-Regular',fontSize:16 }} activeColor={'#F8FAFF'} containerStyle={{borderRadius:8}}
                /> 
               
            
                :
                <View style={{ marginLeft: 20 }}>
                  <Text style={{color:'#8F9EBC'}}> 
                    {item.baseUnitOfMeaTh}
                  </Text>
                </View>

              }

            </View>

          </View>

        </View>
      ))}
      <ModalMessage
        visible={isDeleting}
        message={'ลบของแถมออกจากตะกร้าแล้ว'}
        onRequestClose={() => setIsDeleting(false)}
      />
      <ModalWarning
        visible={visibleDel}
        title="ยืนยันการลบของแถม"
        desc="ต้องการยืนยันการลบของแถมใช่หรือไม่ ?"
        onConfirm={() => onDelete(delId)}
        onRequestClose={() => setVisibleDel(false)}
      />
        <LoadingSpinner visible={loading} />
    </>
  )
}



export default ListItemFreebies

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 0.8,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
  },
  buttonDel: {
    width: 26,
    height: 26,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    alignSelf: 'flex-start',
  },
  dropdown: {
    width: 106,
    marginLeft: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E7F6'
  }
});
