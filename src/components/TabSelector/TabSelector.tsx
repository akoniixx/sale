import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';
export default function TabSelector({
  active,
  tabs,
  onChangeTab,
}: {
  active: number;
  onChangeTab: (value: string) => void;
  tabs: {
    value: string;
    label: string;
  }[];
}) {
  const [animation] = useState(new Animated.Value(0));

  const handleTabPress = (tabIndex: number) => {
    onChangeTab(tabs[tabIndex].value);
    Animated.spring(animation, {
      toValue: tabIndex,
      useNativeDriver: true,
    }).start();
  };

  const tabWidth = 140;
  const translateX = animation.interpolate({
    inputRange: tabs.map((_, index) => index),
    outputRange: tabs.map((_, index) => index * tabWidth),
  });
  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      directionalLockEnabled
      horizontal
      style={{
        flexDirection: 'row',
        paddingVertical: 8,
        height: 100,
        paddingLeft: 16,
        alignSelf: 'flex-start',
      }}>
      {[
        ...tabs,
        {
          value: 'last',
          label: '',
        },
      ].map((tab, index) => {
        const isLast = index === tabs.length;
        if (isLast) {
          return (
            <View
              key={tab.value}
              style={{
                width: 50,
              }}
            />
          );
        }
        return (
          <TouchableOpacity
            onPress={() => {
              handleTabPress(index);
            }}
            key={tab.value}
            style={[styles.tab]}>
            <Text
              lineHeight={24}
              semiBold
              fontSize={12}
              fontFamily="NotoSans"
              color={active === index ? 'primary' : 'text1'}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      {active !== -1 && (
        <Animated.View
          style={[styles.tabSelector, { transform: [{ translateX }] }]}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tab: {
    height: 40,
    width: 140,

    borderRadius: 32,

    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelector: {
    position: 'absolute',
    zIndex: -1,
    width: 140,

    height: 40,

    backgroundColor: colors.primary,
    opacity: 0.16,
    borderRadius: 32,
  },
});
