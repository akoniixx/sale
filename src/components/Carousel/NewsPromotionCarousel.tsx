import React, { useRef } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { colors } from "../../assets/colors/colors";
import    Carousel, { Pagination} from 'react-native-snap-carousel';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PromotionCard } from "./PromotionCard";

interface Props {
    data: NewsPromotion[]
    navigation?: any;
    allScreen?: boolean;
    loading?: boolean;
  }

export default function NewsPromotionCarousel({
  data,
    navigation,
     
 
  loading = false,
}:Props){
    const isCarousel = useRef(null);
  const screen = Dimensions.get('window');
  const [index, setIndex] = React.useState(0);

    return (
       
            <>
              {loading ? (
                <View
                  style={{
                    padding: 10,
                    width: '100%',
                  }}>
                  <SkeletonPlaceholder
                    backgroundColor={colors.skeleton}
                    speed={2000}
                    borderRadius={10}>
                    <SkeletonPlaceholder.Item>
                      <View
                        style={{
                          height: 120,
                          borderRadius: 10,
                        }}
                      />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </View>
              ) : (
                <Carousel
                  autoplay={true}
                  autoplayInterval={7000}
                  autoplayDelay={5000}
                  loop={true}
                  ref={isCarousel}
                  data={data}
                  sliderWidth={screen.width-20}
                  itemWidth={screen.width}
                  onSnapToItem={(idx: number) => setIndex(idx)}
                  useScrollView={true}
                  vertical={false}
                  renderItem={({item}: any) => {
                    
                      return (
                        <TouchableOpacity
                          onPress={ () => {
                          
                            navigation.navigate('NewsPromotionDetailScreen',item);
                          }}>
                          <PromotionCard background={item.promotionImageSecond} />
                        </TouchableOpacity>
                      );
                    }
                  }
                />
              )}

<View
          style={{
            position: 'absolute',
            width: '100%',
            top: '90%',
          }}>
          <Pagination
            dotsLength={data?.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: '#1F2933',
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.9}
            tappableDots={true}
          />
        </View>
            </>
          )
    
}