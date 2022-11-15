import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import Text from '../../components/Text/Text';
import { useLocalization } from '../../contexts/LocalizationContext';
import Body from './Body';
import Button from '../../components/Button/Button';
import { colors } from '../../assets/colors/colors';
import { StackNavigationHelpers } from '@react-navigation/stack/lib/typescript/src/types';

const initialStep = 1;
interface Props {
  navigation: StackNavigationHelpers;
}
const WelcomeScreen = ({ navigation }: Props): JSX.Element => {
  const { t } = useLocalization();
  const [step, setStep] = React.useState(initialStep);
  const stepList = [1, 2];

  const ref = React.useRef<ScrollView>(null);
  const onScrollTo = (step: number) => {
    ref?.current?.scrollTo({
      x: (step - 1) * Dimensions.get('window').width,
      animated: true,
    });
    setStep(step);
  };

  return (
    <Container>
      <Header
        componentRight={
          <TouchableOpacity
            onPress={() => {
              onScrollTo(3);
            }}>
            <Text fontFamily="NotoSans">{t('screens.WelcomeScreen.skip')}</Text>
          </TouchableOpacity>
        }
        componentLeft={<View />}
      />
      <Content>
        <ScrollView
          ref={ref}
          pagingEnabled
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{
            flex: 1,
          }}>
          <Body />
        </ScrollView>
      </Content>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: 16,
          paddingHorizontal: 16,
        }}>
        {step === 3 ? (
          <Button
            onPress={() => {
              navigation.navigate('LoginSuccessScreen');
            }}
            title={t('screens.WelcomeScreen.button.label')}
            style={{
              width: '100%',
            }}
          />
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
              }}>
              {stepList.map((el, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => onScrollTo(el)}
                    key={index}
                    style={{
                      width: el === step ? 20 : 8,
                      height: 10,
                      borderRadius: 4,
                      marginRight: 6,
                      backgroundColor:
                        el === step ? colors.primary : colors.background3,
                    }}
                  />
                );
              })}
            </View>
            <Button
              onPress={() => {
                onScrollTo(step + 1);
              }}
              title={t('screens.WelcomeScreen.button.next')}
              style={{
                width: '30%',
              }}
            />
          </>
        )}
      </View>
    </Container>
  );
};

export default WelcomeScreen;
