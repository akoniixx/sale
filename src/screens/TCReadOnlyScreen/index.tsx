import { View, ScrollView } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Text from '../../components/Text/Text';
import Header from '../../components/Header/Header';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import termConditions from '../../utils/termAndConditions.json';
export default function TCReadOnlyScreen(
  props: StackScreenProps<MainStackParamList, 'TCReadOnlyScreen', undefined>,
) {
  return (
    <Container>
      <Header title="เงื่อนไขและข้อตกลงการใช้บริการ" />
      <Content>
        <ScrollView scrollEventThrottle={16}>
          <View
            style={{
              paddingBottom: 24,
            }}>
            {termConditions.conditions.map(el => {
              return (
                <Text
                  key={el}
                  lineHeight={30}
                  color="text3"
                  style={{
                    marginTop: 4,
                  }}>
                  {el}
                </Text>
              );
            })}
            {termConditions.stepData.map(el => {
              return (
                <View
                  key={el.stepName}
                  style={{
                    marginTop: 16,
                  }}>
                  <Text semiBold color="text1" fontSize={16}>
                    {el.stepName}
                  </Text>
                  {el.stepDetail.map((el2, idx) => {
                    return (
                      <Text
                        key={idx}
                        lineHeight={30}
                        color="text3"
                        style={{
                          marginTop: 8,
                          marginLeft: 32,
                        }}>
                        {`${idx + 1}. ${el2}`}
                      </Text>
                    );
                  })}
                  {el.nestedStepDetail?.map((el3, idx) => {
                    return (
                      <Text
                        style={{
                          marginLeft: 48,
                        }}
                        lineHeight={30}
                        color="text3"
                        key={el3}>{`${idx + 1} ${el3}`}</Text>
                    );
                  })}
                </View>
              );
            })}
            <Text
              color="text1"
              semiBold
              style={{
                marginTop: 16,
              }}>
              {termConditions.contact.title}
            </Text>
            <Text
              style={{
                marginTop: 4,
              }}
              color="text3">
              {termConditions.contact.content}
            </Text>
          </View>
        </ScrollView>
      </Content>
    </Container>
  );
}
