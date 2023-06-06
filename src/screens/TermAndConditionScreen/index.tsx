import { ScrollView, View } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import Text from '../../components/Text/Text';
import Checkbox from '../../components/Checkbox/Checkbox';
import Button from '../../components/Button/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import termConditions from '../../utils/termAndConditions.json';

interface Props {
  navigation: any;
}
export default function TermAndConditionScreen({
  navigation,
}: Props): JSX.Element {
  const [disabledCheckbox, setDisabledCheckbox] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <Container>
      <Header title="เงื่อนไขการใช้งาน" />
      <Content
        style={{
          paddingTop: 0,
        }}>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              setDisabledCheckbox(false);
            }
          }}>
          <View
            style={{
              marginTop: 16,
            }}>
            <Text semiBold fontSize={18} fontFamily="NotoSans">
              ข้อตกลงและเงื่อนไข
            </Text>
            <Text
              fontFamily="NotoSans"
              style={{
                marginTop: 8,
              }}>
              โปรดอ่านข้อตกลงและเงื่อนไขโดยละเอียดก่อน ดำเนินการถัดไป
            </Text>
          </View>
          <View
            style={{
              marginVertical: 24,
            }}>
            <Text bold fontSize={24} fontFamily="NotoSans">
              เงื่อนไขการใช้งาน
            </Text>
          </View>
          <Text
            style={{
              marginVertical: 8,
            }}>
            หัวข้อนโยบาย
          </Text>
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
        <View
          style={{
            minHeight: 100,
            paddingVertical: 24,
          }}>
          <Checkbox
            disabled={disabledCheckbox}
            onPress={() => {
              setChecked(!checked);
            }}
            valueCheckbox={checked ? ['accept'] : []}
            listCheckbox={[
              {
                title: 'ฉันยอมรับข้อมตกลงและเงื่อนไข',
                value: 'accept',
                key: 'accept',
              },
            ]}
          />
          <Button
            onPress={async () => {
              await AsyncStorage.setItem('alreadyAcceptTerm', 'false');
              navigation.navigate('LoginSuccessScreen');
            }}
            disabled={!checked}
            title="ยอมรับ"
            style={{
              marginTop: 16,
            }}
          />
        </View>
      </Content>
    </Container>
  );
}
