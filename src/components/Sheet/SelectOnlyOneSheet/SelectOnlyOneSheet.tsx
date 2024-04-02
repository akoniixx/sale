import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, { useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { colors } from '../../../assets/colors/colors';
import Text from '../../Text/Text';
import icons from '../../../assets/icons';

interface Props {
  sheetId: string;
  payload: {
    headerText: string;
    listData: {
      id: string;
      title: string;
    }[];
    value: {
      id: string;
      title: string;
    };
  };
}

export default function SelectOnlyOneSheet(props: Props) {
  const { listData } = props.payload;
  const [currentValue, setCurrentValue] = React.useState<{
    id: string;
    title: string;
  }>({
    id: '',
    title: '',
  });

  const onSelected = async (value: { id: string; title: string }) => {
    setCurrentValue(value);
    await SheetManager.hide(props.sheetId, {
      payload: value,
    });
  };
  useEffect(() => {
    if (props.payload?.value) {
      setCurrentValue(props.payload.value);
    }
  }, [props.payload?.value]);
  return (
    <ActionSheet
      closeOnPressBack={false}
      id={props.sheetId}
      backdropProps={{
        onPress: () => {
          SheetManager.hide(props.sheetId, {
            payload: currentValue,
          });
        },
      }}
      onClose={() => {
        SheetManager.hide(props.sheetId, {
          payload: currentValue,
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
          {props.payload.headerText}
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() =>
            SheetManager.hide(props.sheetId, {
              payload: currentValue,
            })
          }>
          <Image source={icons.closeBlack} style={styles.closeImg} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={listData}
        renderItem={({ item }) => {
          const isSelected = item.id === currentValue?.id;
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onSelected(item);
              }}>
              <Text
                fontFamily="Sarabun"
                fontSize={16}
                style={{
                  marginLeft: 16,
                }}>
                {item.title}
              </Text>

              {isSelected && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 12,
                    borderWidth: 6,
                    borderColor: colors.primary,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        }}
      />
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
    justifyContent: 'space-between',
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
