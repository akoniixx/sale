import { View, ScrollView } from 'react-native';
import React, { useMemo } from 'react';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import Header from '../../components/Header/Header';
import { colors } from '../../assets/colors/colors';

import Step from '../../components/Step/Step';
import Button from '../../components/Button/Button';
import StepOne from './StepOne';
import FooterShadow from '../../components/FooterShadow/FooterShadow';

export default function CartScreen() {
  const { t } = useLocalization();
  const [currentStep, setCurrentStep] = React.useState(0);

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case 1: {
        return <View />;
      }
      case 2: {
        return <View />;
      }
      default: {
        return <StepOne />;
      }
    }
  }, [currentStep]);

  return (
    <Container>
      <Header title={t('screens.CartScreen.title')} />
      <Content
        style={{
          backgroundColor: colors.background1,
          padding: 0,
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            paddingVertical: 12,
            justifyContent: 'center',
            marginVertical: 8,
          }}>
          <Step
            currentStep={currentStep}
            labelList={['รายการคำสั่งซื้อ', 'สรุปคำสั่งซื้อ', 'สั่งซื้อสำเร็จ']}
          />
        </View>
        <ScrollView>{renderStep}</ScrollView>
      </Content>
      <FooterShadow>
        <Button
          onPress={() => setCurrentStep(prev => prev + 1)}
          title={t('screens.CartScreen.stepOneButton')}
        />
      </FooterShadow>
    </Container>
  );
}
