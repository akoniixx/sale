import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import images from '../../assets/images';
import { useLocalization } from '../../contexts/LocalizationContext';
import Text from '../../components/Text/Text';
import { useAuth } from '../../contexts/AuthContext';

// interface Props {
//   currentStep: number;
//   ref: React.RefObject<ScrollView>;
// }
export default function Body(): JSX.Element {
  const { t } = useLocalization();
  const {
    state: { user },
  } = useAuth();
  const companyName = user && user.company === 'ICPL' ? 'ICP Ladda' : 'ICPL';
  const listStep = [
    {
      label: t('screens.WelcomeScreen.stepOne.label'),
      subLabel: t('screens.WelcomeScreen.stepOne.subLabel', { companyName }),
      image: images.WelcomeStepOne,
      step: 1,
    },
    {
      label: t('screens.WelcomeScreen.stepTwo.label'),
      subLabel: t('screens.WelcomeScreen.stepTwo.subLabel', { companyName }),
      image: images.WelcomeStepTwo,
      step: 2,
    },
    {
      label: t('screens.WelcomeScreen.stepThree.label'),
      subLabel: t('screens.WelcomeScreen.stepThree.subLabel', { companyName }),
      image: images.WelcomeStepThree,
      step: 3,
    },
  ];
  return (
    <>
      {listStep.map((el, index) => {
        return (
          <View
            key={index}
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: Dimensions.get('window').width - 16,
              marginTop: 60,
            }}>
            <Image
              style={styled.image}
              source={el.image}
              resizeMode="stretch"
            />
            <View
              style={{
                marginTop: 16,
              }}>
              <Text fontFamily="NotoSans" bold fontSize={24} center>
                {el.label}
              </Text>
              <Text fontFamily="NotoSans" center color="text2">
                {el.subLabel}
              </Text>
            </View>
          </View>
        );
      })}
    </>
  );
}
const styled = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  },
});
