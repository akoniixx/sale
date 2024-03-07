import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { colors } from '../../../assets/colors/colors';
import Text from '../../Text/Text';
import icons from '../../../assets/icons';
import RadioFake from '../../Radio/RadioFake';
import Button from '../../Button/Button';

export default function SelectAreaOnlyOnceSheet(props: SheetProps) {
  const payload: {
    currentVal: string;
    listArea: {
      id: string;
      title: string;
    }[];
  } = props.payload;
  const [currentValueList, setCurrentValueList] = React.useState<string>('');

  const onPressRadio = async (value: string) => {
    setCurrentValueList(value);
  };

  const onClear = async () => {
    const initialValue = payload.listArea[0].title;
    setCurrentValueList(initialValue);
  };
  const onConfirmSelected = async () => {
    await SheetManager.hide(props.sheetId, {
      payload: currentValueList,
    });
  };

  useEffect(() => {
    if (payload.currentVal) {
      setCurrentValueList(payload.currentVal);
    }
  }, [payload.currentVal]);
  return (
    <ActionSheet
      closeOnPressBack={false}
      id={props.sheetId}
      onClose={async () => {
        await SheetManager.hide(props.sheetId, {
          payload: currentValueList,
        });
      }}
      useBottomSafeAreaPadding={false}
      safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
      containerStyle={{
        height: '50%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
      <View style={styles.header}>
        <Text fontFamily="NotoSans" bold fontSize={18}>
          เลือกเขต
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() =>
            SheetManager.hide(props.sheetId, {
              payload: payload.currentVal,
            })
          }>
          <Image source={icons.closeBlack} style={styles.closeImg} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={payload.listArea}
        renderItem={({ item }) => {
          const isSelected = currentValueList.includes(item.title);
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onPressRadio(item.title);
              }}>
              <RadioFake isSelected={isSelected} />
              <Text
                fontFamily="Sarabun"
                fontSize={16}
                style={{
                  marginLeft: 16,
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.footer}>
        <Button
          title="ล้างข้อมูล"
          transparent
          onPress={onClear}
          style={{
            width: Dimensions.get('window').width / 2 - 24,
          }}
        />
        <Button
          title="ตกลง"
          onPress={onConfirmSelected}
          disabled={currentValueList.length < 1}
          style={{
            width: Dimensions.get('window').width / 2 - 24,
          }}
        />
      </View>
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border1,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  closeImg: {
    width: 24,
    height: 24,
  },
  item: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.border1,
    paddingRight: 16,
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
