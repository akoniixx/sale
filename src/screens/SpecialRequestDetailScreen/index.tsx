import React from 'react';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import dayjs from 'dayjs';
import Content from '../../components/Content/Content';
import { colors } from '../../assets/colors/colors';

type Props = StackScreenProps<MainStackParamList, 'SpecialRequestDetailScreen'>;
export default function SpecialRequestDetailScreen({
  navigation,
  route,
}: Props) {
  const { specialRequestId, date } = route.params;
  console.log('specialRequestId', specialRequestId);
  const headerText = dayjs(date).format('DD MMM BBBB');
  return (
    <Container edges={['left', 'right', 'top']}>
      <Header title={headerText} />
      <Content
        style={{
          backgroundColor: colors.background2,
        }}></Content>
    </Container>
  );
}
