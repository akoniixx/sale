import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, SafeAreaView, ScrollView, TouchableOpacity, View, Modal as ModalRN, StyleSheet, ImageBackground, ActivityIndicator, } from "react-native";
import { MainStackParamList } from "../../navigations/MainNavigator";
import Container from "../../components/Container/Container";
import Header from "../../components/Header/Header";
import Text from "../../components/Text/Text";
import icons from "../../assets/icons";
import { colors } from "../../assets/colors/colors";
import DashedLine from "react-native-dashed-line";
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface file {
    fileName: string
    fileSize: number
    height: number
    width: number
    type: string
    uri: string

}

export default function UploadFileScreen({
    route,
    navigation,
}: StackScreenProps<MainStackParamList, 'UploadFileScreen'>) {
    const [file, setFile] = useState<Asset[] | undefined>([]);
    const [url, setUrl] = useState()
    const [toggleModle, setToggleModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const uploadFile = async () => {
        const result: ImagePickerResponse = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 0
        });
        if (!result.didCancel) {
            setFile(result.assets)
        }
    };

    const viewImage = (url) => {
        setUrl(url)
        setToggleModal(true)
    }

    const renderViewImg = () => (<ModalRN
        animationType="fade"
        onRequestClose={() => setToggleModal(false)}
        visible={toggleModle}
        transparent>
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.4)',
            }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setToggleModal(false)}>
                <Image source={icons.closeBlack} style={{ width: 24, height: 24, marginRight: 20 }} />
            </TouchableOpacity>
            <View style={[styles.modalView]}>
                <ImageBackground source={{ uri: url }} style={{ width: '100%', height: '100%' }} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)}>
                    <ActivityIndicator animating={loading} size={'large'} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }} />
                </ImageBackground>
            </View>
        </View>
    </ModalRN>)
    return (
        <SafeAreaView style={{ flex: 1 }} >
            {renderViewImg()}
            <Header title="เพิ่มเอกสาร" />
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={{ marginTop: 20 }}>
                    <View>
                        <Text lineHeight={40} bold> อัพโหลดเอกสารเป็นไฟล์ภาพ</Text>
                        <Text fontSize={14} bold color='text3'>เพิ่มเอกสารได้สูงสุด 5 ภาพ</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <TouchableOpacity style={{ backgroundColor: colors.primary, alignItems: 'center', paddingVertical: 12, borderRadius: 8 }}
                            onPress={() => uploadFile()}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={icons.iconAddWhite} style={{ width: 16, height: 16, marginRight: 10 }} />
                                <Text fontSize={18} bold color="white">เพิ่มเอกสาร</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <DashedLine
                    dashColor={colors.border2}
                    dashGap={0}
                    dashLength={1}
                    style={{
                        marginTop: 30
                    }}
                    dashThickness={1}
                />

                {
                    file?.length != undefined && file?.length > 0 ?
                        <View style={{ marginTop: 30, flex: 1 }}>
                            <Text>{`เอกสารทั้งหมด ${file?.length} ภาพ`}</Text>
                            <View style={{ marginTop: 20, flex: 1 }}>
                                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }} >
                                    {file.map((item, idx) => (
                                        <View style={{ marginTop: 10 }} key={idx}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                                <View style={{ flexDirection: 'row', maxWidth: '60%', alignItems: 'center' }}>
                                                    <Image source={{ uri: item.uri }} style={{ width: 40, height: 40, marginRight: 20 }} />
                                                    <Text numberOfLines={1} ellipsizeMode='tail'>{item.fileName}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>

                                                    <TouchableOpacity onPress={() => viewImage(item.uri)}>
                                                        <Image source={icons.viewDoc} style={{ width: 25, height: 25, marginRight: 20 }} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity>
                                                        <Image source={icons.binRed} style={{ width: 25, height: 25 }} />
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                            <DashedLine
                                                dashColor={colors.border2}
                                                dashGap={0}
                                                dashLength={1}
                                                style={{
                                                    marginTop: 20
                                                }}
                                                dashThickness={1}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View> : null
                }
            </View>




        </SafeAreaView>

    )


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