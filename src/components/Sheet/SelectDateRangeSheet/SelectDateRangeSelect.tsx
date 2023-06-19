import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import icons from '../../../assets/icons';
import Text from '../../Text/Text';
import { colors } from '../../../assets/colors/colors';
import Button from '../../Button/Button';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';

export default function SelectDateRangeSelect(props: SheetProps) {
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [isOpenDateStart, setIsOpenDateStart] = React.useState<boolean>(false);
  const [isOpenDateEnd, setIsOpenDateEnd] = React.useState<boolean>(false);

  useEffect(() => {
    if (props.payload) {
      setDateRange(props.payload.dateRange);
    }
  }, [props.payload]);

  return (
    <ActionSheet
      onClose={async () => {
        await SheetManager.hide(props.sheetId, {
          payload: dateRange,
        });
      }}
      containerStyle={{
        height: '32%',
        justifyContent: 'space-between',
      }}
      id={props.sheetId}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 64,
          }}>
          <Text fontSize={20} bold fontFamily="NotoSans">
            เลือกวันที่ที่ต้องการ
          </Text>
          <TouchableOpacity
            onPress={async () => {
              await SheetManager.hide(props.sheetId, {
                payload: dateRange,
              });
            }}
            style={{
              position: 'absolute',
              right: 16,
            }}>
            <Image
              source={icons.closeBlack}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: colors.background1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 8,
            minHeight: 100,
          }}>
          <View
            style={{
              alignSelf: 'flex-start',
              flex: 0.48,
            }}>
            <Text fontFamily="NotoSans" color="text2">
              วันที่เริ่ม
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setIsOpenDateStart(true);
              }}>
              {dateRange?.startDate ? (
                <Text fontFamily="NotoSans" color="text1">
                  {dayjs(dateRange.startDate).format('DD/MM/YYYY')}
                </Text>
              ) : (
                <Text fontFamily="NotoSans" color="text3">
                  เลือกวันที่เริ่ม
                </Text>
              )}
              <Image
                source={icons.iconCalendar}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: 'flex-start',
              flex: 0.48,
            }}>
            <Text fontFamily="NotoSans" color="text2">
              วันที่สิ้นสุด
            </Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setIsOpenDateEnd(true);
              }}>
              {dateRange?.endDate ? (
                <Text fontFamily="NotoSans" color="text1">
                  {dayjs(dateRange.endDate).format('DD/MM/YYYY')}
                </Text>
              ) : (
                <Text fontFamily="NotoSans" color="text3">
                  เลือกวันที่สิ้นสุด
                </Text>
              )}
              <Image
                source={icons.iconCalendar}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border1,
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}>
        <TouchableOpacity
          onPress={() => {
            setDateRange({
              startDate: undefined,
              endDate: undefined,
            });
          }}
          style={{
            flex: 0.48,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text bold fontFamily="NotoSans">
            ล้างข้อมูล
          </Text>
        </TouchableOpacity>
        <Button
          onPress={async () => {
            await SheetManager.hide(props.sheetId, {
              payload: dateRange,
            });
          }}
          style={{
            flex: 0.48,
          }}
          title="ตกลง"
        />
      </View>

      <DatePicker
        open={isOpenDateStart}
        modal
        mode="date"
        locale="th"
        maximumDate={new Date()}
        onCancel={() => {
          setIsOpenDateStart(false);
          setDateRange(prev => ({
            ...prev,
            startDate: undefined,
          }));
        }}
        date={dateRange.startDate ? dateRange.startDate : new Date()}
        onConfirm={date => {
          setDateRange({
            ...dateRange,
            startDate: date,
          });
          setIsOpenDateStart(false);
        }}
      />
      <DatePicker
        open={isOpenDateEnd}
        modal
        mode="date"
        locale="th"
        minimumDate={dateRange.startDate}
        maximumDate={new Date()}
        onCancel={() => {
          setIsOpenDateEnd(false);
          setDateRange(prev => ({
            ...prev,
            endDate: undefined,
          }));
        }}
        date={dateRange.endDate ? dateRange.endDate : new Date()}
        onConfirm={date => {
          setDateRange({
            ...dateRange,
            endDate: date,
          });
          setIsOpenDateEnd(false);
        }}
      />
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border1,
    backgroundColor: colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
});
