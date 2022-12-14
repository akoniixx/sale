import {
  ViewStyle,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import { Picker } from '@react-native-picker/picker';
import Text from '../Text/Text';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { useLocalization } from '../../contexts/LocalizationContext';
interface Props {
  value?: any;
  placeholder?: string;
  style?: ViewStyle;
  data?: {
    label: string;
    value: string;
  }[];
  onChangeValue?: (value: any) => void;
  titleModal?: string;
}
export default function Dropdown({
  value,
  placeholder,
  style,
  data,
  onChangeValue,
  titleModal,
}: Props) {
  const [isVisible, setIsVisible] = React.useState(false);
  const { t } = useLocalization();
  const [currentValue, setCurrentValue] = React.useState(undefined);
  return (
    <>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: colors.border2,
          borderRadius: 6,
          ...style,
        }}
        onPress={() => {
          setIsVisible(true);
        }}>
        <Image
          source={icons.iconDropdown}
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            right: 6,
          }}
        />
        <Text
          style={{
            left: 16,
            position: 'absolute',
          }}
          fontSize={14}>
          {value}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isVisible}
        hideClose
        onRequestClose={() => {
          setIsVisible(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            {titleModal && (
              <Text center fontSize={20} bold>
                {titleModal}
              </Text>
            )}
            <Picker
              mode="dropdown"
              selectedValue={currentValue ? currentValue : value}
              onValueChange={v => {
                if (!v) {
                  setCurrentValue(undefined);
                  return;
                }
                setCurrentValue(v);
              }}>
              {data?.map((item, idx) => {
                return (
                  <Picker.Item
                    key={idx}
                    label={item.label}
                    value={item.value.toString()}
                  />
                );
              })}
            </Picker>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Platform.OS === 'android' ? 16 : 0,
              }}>
              <Button
                secondary
                title={t('dropDownModal.buttonCancel')}
                style={{
                  flex: 0.45,
                }}
                onPress={() => {
                  setIsVisible(false);
                }}
              />
              <Button
                title={t('dropDownModal.buttonConfirm')}
                style={{
                  flex: 0.45,
                }}
                onPress={() => {
                  setIsVisible(false);
                  onChangeValue?.(currentValue);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({});
