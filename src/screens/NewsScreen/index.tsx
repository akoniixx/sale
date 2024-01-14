import React, { useEffect, useRef, useState } from "react";

import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import Header from "../../components/Header/Header";
import { Button, Dimensions, FlatList, Image, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ImageCache from "../../components/ImageCache/ImageCache";
import Text from "../../components/Text/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../assets/colors/colors";
import NewsCard from "../../components/News/NewsCard";
import { NewsService } from "../../services/NewsService/NewsServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PinedCarousel from "../../components/Carousel/PinedCarousel";
import DashedLine from "react-native-dashed-line";
import images from "../../assets/images";
import { useLocalization } from "../../contexts/LocalizationContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ActionSheet from 'react-native-actions-sheet';
import { normalize } from "../../utils/functions";
import icons from "../../assets/icons";
interface Props {
    navigation: StackNavigationHelpers;
}

export default function NewsScreen({ navigation }: Props): JSX.Element {
    const [pined, setPined] = useState<Pined[]>([])
    const [newsList, setNewsList] = useState<NewsInterface[]>([])
    const [loading, setLoading] = useState(false)
    const [sortBy, setSortBy] = useState<'MOST_READ'|'NEWEST'>('NEWEST');
    const [checkBox, setCheckBox] = useState<CheckBoxItem[]>([
        {
            id: 1,
            title: 'ข่าวสาร',
            value: 'NEWS',
            checked: true,
        },
        {
            id: 2,
            title: 'คลังความรู้',
            value: 'INFO',
            checked: true,
        },
    ])
    const filterListSelect = [
        {
            id: 1,
            title: 'ล่าสุด',
            value: 'NEWEST',

        },
        {
            id: 2,
            title: 'อ่านมากสุด',
            value: 'MOST_READ',

        },
    ];
    const { t } = useLocalization();
    const filterNews = useRef<any>();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    interface CheckBoxItem {
        id: number;
        title: string;
        value: string;
        checked: boolean;
    }

    const fecthPin = async () => {
        try {
            setLoading(true)
            const company = await AsyncStorage.getItem('company')

            const res: Pined[] = await NewsService.getPined(company || '')
            const filterData: Pined[] = await res.filter((item) => item.page === 'NEWS_PAGE')

            setPined(filterData)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }

    }

    const fecthNewsList = async (sortingType: 'MOST_READ'|'NEWEST', type: string) => {
        try {
            setLoading(true)
            const company = await AsyncStorage.getItem('company')
            const res: NewsInterface[] = await NewsService.getNewsList(company || '', 1, 99, sortingType?sortingType:'NEWEST', type?type:'')
            setNewsList(res)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleCheckbox = (id: number) => {
        const checkedCount = checkBox.reduce((count, item) => item.checked ? count + 1 : count, 0);
        setCheckBox(prevState =>
            prevState.map(item => {
                if (item.id === id) {

                    return checkedCount > 1 || !item.checked ? { ...item, checked: !item.checked } : item;
                }
                return item;
            })
        );
    };

    const getSelectedValues = () => {

        const areAllChecked = checkBox.every(item => item.checked);


        if (areAllChecked) {
            return "";
        }

        const selectedValues = checkBox.filter(item => item.checked).map(item => item.value)
        return selectedValues.join(',')
    };
    const handleSubmit = async () => {
        const selectedValues = getSelectedValues();
        console.log(selectedValues)
        await fecthNewsList(sortBy, selectedValues)
        filterNews.current.hide();


    };
    useEffect(() => {
        fecthPin()
        fecthNewsList('NEWEST', '')
    }, [])




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['left', 'right', 'top']}>
            <Header

                title="ข่าวสารทั้งหมด"
                componentRight={
                    <TouchableOpacity
                        onPress={async () => {

                            filterNews.current.show();
                        }}>
                        <Image source={icons.filter} style={{ width: 28, height: 29 }} />
                    </TouchableOpacity>
                }
            />
           
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                {pined.length !== 0 && <>
                    <View style={{ maxHeight: 140 }}>
                        <PinedCarousel data={pined} navigation={navigation} />
                    </View>
                    <DashedLine
                        dashColor={colors.border2}
                        dashGap={0}
                        dashLength={0.5}

                    />
                </>}

                <View style={{ flex: 1, }}>
                    <FlatList
                        data={newsList}
                        keyExtractor={(item) => item.newsId}
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListEmptyComponent={
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Image
                                    source={images.News}
                                    style={{
                                        height: 100,
                                        width: 110,
                                    }}
                                />
                                <Text color="text3">{t('screens.HomeScreen.news')}</Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <View style={{ marginTop: 20 }}>
                                <NewsCard data={item} navigation={navigation} />
                            </View>

                        )}
                    />

                </View>

            </View>
           
            <ActionSheet ref={filterNews}>
                <View
                    style={{
                        backgroundColor: 'white',
                        paddingVertical: normalize(30),
                        width: windowWidth,
                        height: windowHeight * 0.5,
                        borderRadius: normalize(20),
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',

                            paddingHorizontal: normalize(20),
                            justifyContent: 'space-between'
                        }}>

                        <View />
                        <Text bold style={{ fontSize: 22, }}>
                            ตัวกรอง
                        </Text>


                        <TouchableOpacity
                            style={{}}
                            onPress={() => {

                                filterNews.current.hide();
                            }}>
                            <Image source={icons.closeBlack} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            borderBottomWidth: 0.3,
                            paddingVertical: 5,
                            borderColor: colors.border2,
                        }}
                    />
                    <View style={{ flex: 1 }}>

                        <View style={{ backgroundColor: '#F8FAFF', paddingHorizontal: 16, paddingVertical: 10 }}>
                            <Text fontSize={24} fontFamily='NotoSans'>เรียงตาม</Text>
                        </View>



                        {filterListSelect.map((el, idx) => {
                            const isFocus = sortBy === el.value;
                            return (
                                <View key={idx}>
                                    <TouchableOpacity
                                        onPress={async () => {
                                            setSortBy(el.value);
                                        }}
                                        key={idx}
                                        style={{
                                            height: 60,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingRight: 16,
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                paddingHorizontal: normalize(30),
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: 20,
                                                }}>
                                                {el.title}
                                            </Text>
                                        </View>

                                        {isFocus ? (
                                            <Image
                                                source={icons.radio}
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                        ) :
                                            <Image
                                                source={icons.radioEmpty}
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                        }
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            borderBottomWidth: 1,

                                            borderColor: colors.background2,
                                            width: Dimensions.get('screen').width * 0.9,
                                            alignSelf: 'center',
                                        }}
                                    />
                                </View>
                            );
                        })}



                        <View style={{ backgroundColor: '#F8FAFF', paddingHorizontal: 16, paddingVertical: 10 }}>
                            <Text fontSize={24} fontFamily='NotoSans'>หมวดหมู่</Text>
                        </View>
                        {checkBox.map((el, idx) => {
                            const isFocus = sortBy === el.value;
                            return (
                                <View key={idx}>
                                    <TouchableOpacity
                                        onPress={async () => {

                                            handleCheckbox(el.id)

                                        }}
                                        key={idx}
                                        style={{
                                            height: 60,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingRight: 16,
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                paddingHorizontal: normalize(30),
                                            }}>
                                            <Text
                                                style={{
                                                    fontSize: 20,


                                                }}>
                                                {el.title}
                                            </Text>
                                        </View>

                                        {el.checked ? (
                                            <Image
                                                source={icons.checkbox}
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                        ) :
                                            <Image
                                                source={icons.uncheckbox}
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                }}
                                            />
                                        }
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            borderBottomWidth: 1,

                                            borderColor: colors.background2,
                                            width: Dimensions.get('screen').width * 0.9,
                                            alignSelf: 'center',
                                        }}
                                    />
                                </View>
                            );
                        })}
                    </View>

                </View>
                <View style={{ paddingHorizontal: 16 }}>
                    <TouchableOpacity onPress={() => handleSubmit()}
                        style={{ alignItems: "center", backgroundColor: colors.primary, paddingVertical: 15, borderRadius: 8 }}>
                        <Text color='white' fontFamily='NotoSans' fontSize={24}>ตกลง</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>
            <LoadingSpinner visible={loading} />


        </SafeAreaView>
    )
}