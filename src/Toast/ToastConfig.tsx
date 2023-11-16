import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import Text from "../components/Text/Text";
import icons from "../assets/icons";
import React from "react";
import { normalize } from "../utils/functions";
import { responsiveHeigth, responsiveWidth } from "../utils/responsive";

export const toastConfig = {
    orderToast: ({onPress, text1, text2, props}: any) => (
        <TouchableOpacity onPress={onPress}>
        <View style={[styles.modalBgSuccess,{backgroundColor:'#4C95FF'}]}>
          <View
            style={{flex:1,
              flexDirection: 'row',

            }}>
                <View style={{justifyContent:'center'}}>
                    <View style={{backgroundColor:'white',padding:10,borderRadius:20}}>
                    <Image source={icons.orderNoti} style={{width:23,height:23}} />
                    </View>
                  
                </View>
           
            <View
            style={{flex:1,paddingLeft:20}}
              >
              <Text style={styles.info}>{text1}</Text>
              <Text style={styles.info}>{text2}</Text>
             
            </View>
          </View>
        
        </View>
      </TouchableOpacity>
    ),
    promotionToast:({onPress, text1, text2, props}: any) => (
        <TouchableOpacity onPress={onPress}>
        <View style={[styles.modalBgSuccess,{backgroundColor:'#F4BF00'}]}>
          <View
            style={{flex:1,
              flexDirection: 'row',

            }}>
                <View style={{justifyContent:'center'}}>
                    <View style={{backgroundColor:'white',padding:10,borderRadius:20}}>
                    <Image source={icons.promotionNoti} style={{width:23,height:23}} />
                    </View>
                  
                </View>
           
            <View
            style={{flex:1,paddingLeft:20}}
              >
              <Text style={styles.info}>{text1}</Text>
              <Text style={styles.info}>{text2}</Text>
             
            </View>
          </View>
        
        </View>
      </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    modalBgSuccess: {
      width: responsiveWidth(345),
      borderRadius: responsiveWidth(16),
      backgroundColor: '#3EBD93',
      paddingVertical: responsiveHeigth(15),
      paddingHorizontal: normalize(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    modalBgWarning: {
      width: responsiveWidth(345),
      borderRadius: responsiveWidth(16),
      backgroundColor: '#FF981E',
      paddingVertical: responsiveHeigth(15),
      paddingHorizontal: normalize(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    modalBgFailed: {
      width: responsiveWidth(345),
      borderRadius: responsiveWidth(16),
      backgroundColor: '#EB5757',
      paddingVertical: responsiveHeigth(15),
      paddingHorizontal: normalize(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    modalBgdroneFailed: {
      width: responsiveWidth(345),
      borderRadius: responsiveWidth(16),
      backgroundColor: '#EB5757',
      paddingVertical: responsiveHeigth(15),
      paddingHorizontal: normalize(20),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    closePosition: {
      position: 'absolute',
      top: 15,
      right: 15,
    },
    info: {
      fontSize: normalize(16),
     
      color: 'white',
    },
    infolight: {
      fontSize: normalize(14),
    
      color: 'white',
    },
  });