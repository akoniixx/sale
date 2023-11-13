import React, { useState } from 'react';
import {
    View,
    Modal as ModalRN,
    StyleSheet,
    //   Image,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import Text from '../Text/Text';
import ImageCache from '../ImageCache/ImageCache';
import icons from '../../assets/icons';

type Props = {
    onRequestClose?: () => void;
    visible: boolean;
    imgUrl: string
    width?: string;
    children: React.ReactNode;
};

export default function HightlightPopup({
    visible,
    onRequestClose,
    imgUrl,
    width = '90%',
    children

}: Props) {
    const [loading,setLoading] = useState(false)
    return (
        <ModalRN
            animationType="fade"
            onRequestClose={onRequestClose}
            visible={visible}
            transparent>
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                }}>

                <View style={[styles.modalView, { width }]}>
                    {imgUrl ? (
                        <ImageBackground source={{ uri: imgUrl }} style={{ width: '100%', height: '100%' }} onLoadStart={()=>setLoading(true)} onLoadEnd={()=>setLoading(false)}>
   <ActivityIndicator animating={loading} size={'large'} style={{position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,}} />
                        </ImageBackground>
                    ) : (
                       
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                         
<Text>loading...</Text>
                           
                        </View>
                    )}

                </View>
                <TouchableOpacity style={{ marginTop: 10,backgroundColor:'white',padding:10,borderRadius:50}} onPress={onRequestClose}>
                    <Image source={icons.closeBlack} style={{width:24,height:24}} />
                   
                </TouchableOpacity>
            </View>
        </ModalRN>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalView: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        height: '60%',

        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    close: {
        width: 24,
        height: 24,
    },
});
