import { useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';
export const HeaderFlatList = ({
  currentTab,
  setCurrentTab,
  tabList,
}: {
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  tabList: { label: string; value: any }[];
}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    // Trigger the animation whenever the currentTab changes
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to opacity: 1 (opaque)
      duration: 500, // 500ms duration
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      // Reset the animation value to 0 after it ends for the next animation cycle
      fadeAnim.setValue(0);
    });
  }, [currentTab, fadeAnim]); // Only re-run the effect if currentTab changes

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.white,
        height: 'auto',
      }}>
      {tabList.map((tab, index) => {
        return (
          <TouchableOpacity
            key={index}
            disabled={currentTab === index}
            onPress={() => setCurrentTab(index)}
            style={[
              styles.tabStyles,
              {
                backgroundColor:
                  currentTab === index ? colors.background2 : colors.white,
                paddingVertical: 8,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 70,
                width: `${100 / tabList.length}%`,
              },
            ]}>
            <Text
              key={index}
              semiBold
              fontSize={12}
              fontFamily="NotoSans"
              color={currentTab === index ? 'primary' : 'text2'}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabStyles: {
    backgroundColor: colors.white,
  },
});
