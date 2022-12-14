import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const LoadingNavigator: React.FC<any> = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('token');
          console.log('tokenForTest', value);

          if (!!value) {
            navigation.push('Main');
          } else {
            navigation.push('Auth');
          }
        } catch (e) {
          console.log(e, 'get async token');
        }
      };
      getData();
    }, [navigation]),
  );
  return (
    <View style={styles.scaffold}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scaffold: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingNavigator;
