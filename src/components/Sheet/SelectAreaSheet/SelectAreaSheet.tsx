import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import React, { useEffect } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import { colors } from '../../../assets/colors/colors';
import Text from '../../Text/Text';
import icons from '../../../assets/icons';
import Button from '../../Button/Button';
import FakeCheckbox from '../../Checkbox/FakeCheckbox';

export default function SelectAreaSheet(props: SheetProps) {
  const payload: {
    currentVal: string[];
    listArea: {
      id: string;
      title: string;
    }[];
  } = props.payload;
  const [currentValueList, setCurrentValueList] = React.useState<string[]>([]);
  const onConfirmSelected = async () => {
    const isAllChecked = currentValueList.length === payload.listArea.length;

    await SheetManager.hide(props.sheetId, {
      payload: isAllChecked ? [] : currentValueList,
    });
  };

  const onClear = () => {
    const initialValue = payload.listArea.map(item => item.title);
    setCurrentValueList(initialValue);
  };

  const onPressCheckbox = (value: string) => {
    const isExist = currentValueList.includes(value);
    if (isExist) {
      setCurrentValueList(currentValueList.filter(item => item !== value));
    } else {
      setCurrentValueList([...currentValueList, value]);
    }
  };

  useEffect(() => {
    if (payload.currentVal.length > 0) {
      setCurrentValueList(payload.currentVal);
    } else {
      setCurrentValueList(payload.listArea.map(item => item.title));
    }
  }, [payload.currentVal, payload.listArea]);
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
        height: '70%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
      <View style={styles.header}>
        <Text fontFamily="NotoSans" bold fontSize={18}>
          เลือกเขตการขาย
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
        data={[
          {
            id: 'all',
            title: 'ทุกเขต',
          },
          ...payload.listArea,
        ]}
        renderItem={({ item }) => {
          const isChecked = currentValueList.includes(item.title);

          if (item.title === 'ทุกเขต') {
            const isAllChecked =
              currentValueList.length === payload.listArea.length;
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  if (isAllChecked) {
                    setCurrentValueList([]);
                  } else {
                    setCurrentValueList(
                      payload.listArea.map(item => item.title),
                    );
                  }
                }}>
                <FakeCheckbox
                  value={currentValueList.length === payload.listArea.length}
                />
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
          }

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onPressCheckbox(item.title);
              }}>
              <FakeCheckbox value={isChecked} />
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
          title="คืนค่าทั้งหมด"
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
