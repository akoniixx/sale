import { View } from 'react-native';
import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import { StepIndicatorStyles } from 'react-native-step-indicator/lib/typescript/src/types';
import { colors } from '../../assets/colors/colors';
import Text from '../Text/Text';

interface Props {
  currentStep: number;
  customStyles?: StepIndicatorStyles;
  labelList: string[];
  stepCount?: number;
  onPress?: (step: number) => void;
}
export default function Step({
  currentStep,
  customStyles,
  labelList = [],
  stepCount = 3,
  onPress,
}: Props): JSX.Element {
  return (
    <StepIndicator
      onPress={(step: number) => {
        onPress && onPress(step);
      }}
      stepCount={stepCount}
      customStyles={{
        stepStrokeWidth: 1,
        separatorStrokeWidth: 1.5,
        stepIndicatorSize: 40,
        currentStepIndicatorSize: 40,
        currentStepStrokeWidth: 0,

        stepStrokeUnFinishedColor: colors.border2,
        stepIndicatorFinishedColor: colors.primary,
        stepIndicatorCurrentColor: colors.primary,
        stepIndicatorUnFinishedColor: colors.white,
        stepStrokeFinishedColor: colors.primary,
        separatorFinishedColor: colors.primary,
        separatorUnFinishedColor: colors.border2,
        ...customStyles,
      }}
      renderLabel={({ stepStatus, label }) => {
        return (
          <Text
            fontFamily="NotoSans"
            semiBold={stepStatus === 'current'}
            style={{
              color:
                stepStatus === 'finished' || stepStatus === 'current'
                  ? colors.text1
                  : colors.border2,
            }}>
            {label}
          </Text>
        );
      }}
      renderStepIndicator={({ position, stepStatus }) => {
        return (
          <View>
            <Text
              bold
              color={
                stepStatus === 'finished' || stepStatus === 'current'
                  ? 'white'
                  : 'border2'
              }>
              {position + 1}
            </Text>
          </View>
        );
      }}
      currentPosition={currentStep}
      labels={labelList}
    />
  );
}
