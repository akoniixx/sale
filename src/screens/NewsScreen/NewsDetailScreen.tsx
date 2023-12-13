import React, { useEffect, useState } from "react"
import { Dimensions, SafeAreaView, ScrollView, View } from "react-native"
import { MainStackParamList } from "../../navigations/MainNavigator"
import { StackScreenProps } from "@react-navigation/stack"
import Header from "../../components/Header/Header"
import Text from "../../components/Text/Text"
import HTML from 'react-native-render-html';
import { NewsService } from "../../services/NewsService/NewsServices"
import AsyncStorage from "@react-native-async-storage/async-storage"
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin"
import WebView from "react-native-webview"
import { normalize } from "../../utils/functions"
import { colors } from "../../assets/colors/colors"
import ImageCache from "../../components/ImageCache/ImageCache"
import DashedLine from "react-native-dashed-line"
import dayjs from "dayjs"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"
import { useAuth } from "../../contexts/AuthContext"


export default function NewsDetailScreen({
    route,
    navigation,

}: StackScreenProps<MainStackParamList, 'NewsDetailScreen'>): JSX.Element {
    const {
        state: { user }
    } = useAuth();
    const renderers = {
        iframe: IframeRenderer,
    };
    const customHTMLElementModels = {
        iframe: iframeModel,
    };
    const MemoizedRenderHtml = React.memo(HTML);
    const [data, setData] = useState<NewsDetail>()
    const [loading,setLoading] = useState(false)
    const fecthNews = async () => {
        try {
            setLoading(true)
            const company = await AsyncStorage.getItem('company')
            const res: NewsDetail = await NewsService.getNews(company || '', route.params.newsId)
            setData(res)
           
        } catch (error) {

        }
        finally{
            setLoading(false)
        }
    }
    const viewNews = async() => {
        try {
       await NewsService.postView(route.params.newsId,user?.userStaffId||'')
    
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        viewNews()
        fecthNews()
    }, [])


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} /* edges={['left', 'right', 'top']} */ >
            <Header />
            {data !== undefined ? (
                <ScrollView contentContainerStyle={{ flexGrow: 1, }} style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={{ alignItems: 'center' }}>
                            <ImageCache uri={data?.imageUrl}
                                resizeMode='cover'
                                style={{ width: '100%', height: 350 }}
                            />

                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text fontSize={20} fontFamily='NotoSans' >
                                {/*  {data?.promotionType} */}
                                {data?.topic}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row',marginVertical:10 }}>
                            <Text color='text2' style={{ fontSize: 12 }}>{dayjs(data.createdAt).format('DD MMM BBBB')}</Text>
                            <Text color='text2' style={{  fontSize: 12, marginLeft: 15 }}>{`อ่าน ${data.viewSaleApp}`}</Text>
                        </View>

                        <DashedLine
                            dashColor={colors.border1}
                            dashGap={0}
                            dashLength={8} />
                        <MemoizedRenderHtml
                            renderers={renderers}
                            WebView={WebView}
                            customHTMLElementModels={customHTMLElementModels}
                            source={{ html: data.contentFile }}
                            contentWidth={Dimensions.get('screen').width}
                            renderersProps={{
                                iframe: {
                                    scalesPageToFit: true,
                                    webViewProps: {
                                        width: Dimensions.get('screen').width - 30,
                                        height: Dimensions.get('screen').width * 0.3,
                                    },
                                },
                            }}
                            tagsStyles={{
                                img: {
                                    width: Dimensions.get('screen').width - 30,
                                    marginRight: 30,
                                    resizeMode: 'contain',
                                },
                                strong: {
                                    color: colors.text1,
                                    fontSize: normalize(18),
                                    fontWeight: '400',
                                    lineHeight: 28,
                                },
                                em: {
                                    color: colors.text2,
                                    fontSize: normalize(18),
                                    fontWeight: '200',
                                    lineHeight: 28,
                                },
                                ul: {
                                    color: colors.text2,
                                    fontSize: normalize(18),
                                    fontWeight: '200',
                                    lineHeight: 28,
                                },
                                u: {
                                    color: colors.text2,
                                    fontSize: normalize(18),
                                    fontWeight: '200',
                                    lineHeight: 28,
                                },
                                p: {
                                    color: colors.text2,
                                    fontSize: normalize(18),
                                    fontWeight: '200',
                                    lineHeight: 28,
                                    margin: 0,
                                    padding: 0,
                                },
                                ol: {
                                    color: colors.text2,
                                    fontSize: normalize(18),
                                    fontWeight: '200',
                                    lineHeight: 28,
                                },
                                li: {
                                    color: colors.text2,
                                    fontSize: normalize(18),
                                    fontWeight: '200',
                                    lineHeight: 28,
                                },
                            }}
                        />
                    </View>
                </ScrollView>

            ) : (
                <></>
            )}
<LoadingSpinner visible={loading} />

        </SafeAreaView>
    )
}