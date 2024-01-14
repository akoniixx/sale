import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import Text from "../Text/Text";
import images from "../../assets/images";
import { normalize } from "../../utils/functions";
import ImageCache from "../ImageCache/ImageCache";


interface Props {
    data: Pined[]
    navigation?: any;
    allScreen?: boolean;
    loading?: boolean;
}
export default function NewsList({
    data,
    navigation,
    loading
}: Props) {



    return (
        <View style={{ flexDirection: 'row' }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.map((e, i) => (

                    i < 5 ?
                        (<TouchableOpacity style={{ marginRight: 5 ,borderRadius:16 }} key={i} onPress={() => navigation.navigate('NewsDetailScreen', {
                            newsId: e.newsId
                        })}>
                            <ImageCache uri={e.imageUrl} style={{ width: normalize(150), height: normalize(150),borderRadius:10 }} resizeMode='contain' />
                        </TouchableOpacity>) : <></>

                ))}


            </ScrollView>



        </View>
    )
}