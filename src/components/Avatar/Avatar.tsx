import {
  View,
  Image,
  ImageStyle,
  ViewStyle,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React from 'react';
import { colors } from '../../assets/colors/colors';
import icons from '../../assets/icons';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import ModalWarning from '../Modal/ModalWarning';
import Text from '../Text/Text';
import ImageCache from '../ImageCache/ImageCache';
const options: ImageLibraryOptions = {
  maxWidth: 200,
  maxHeight: 200,
  mediaType: 'photo',
  quality: 0.5,
  selectionLimit: 1,
};
interface Props {
  source: any;
  style?: ImageStyle;
  styleView?: ViewStyle;
  width?: number;
  height?: number;
  isShowEdit?: boolean;
  onPressEdit?: (value: any) => void;
  name?: string;
}
export default function Avatar({
  source,
  style,
  styleView,
  isShowEdit = true,
  onPressEdit,
  name,
  ...props
}: Props) {
  const { width = 108, height = 108 } = props;
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  async function requestStoragePermission() {
    try {
      if (Platform.OS === 'ios') {
        return true;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'สิทธ์การเข้าถึง Storage',
          message: 'เพื่อให้สามารถเข้าถึงไฟล์ได้',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'ยกเลิก',
          buttonPositive: 'ตกลง',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (error) {
      console.warn(error);
    }
  }
  const onPickImage = async () => {
    const isGranted = await requestStoragePermission();
    if (!isGranted) {
      setModalVisible(true);
      return;
    }
    await launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      } else {
        if (onPressEdit) {
          onPressEdit(response.assets[0]);
        }
      }
    });
  };
  const borderRadius = width / 2;
  return (
    <View
      style={{
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        borderRadius,
        width,
        height,
        backgroundColor: colors.background1,
        justifyContent: 'center',
        alignItems: 'center',
        ...styleView,
      }}>
      {source ? (
        <ImageCache
          uri={source.uri ? source.uri : source}
          resizeMode="cover"
          style={{
            borderRadius,
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        <Text fontFamily="NotoSans" fontSize={24} color="primary" semiBold>
          {name?.charAt(0)}
        </Text>
      )}
      {isShowEdit && (
        <TouchableOpacity
          onPress={onPickImage}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 4,
          }}>
          <Image
            source={icons.iconEditPhoto}
            style={{
              width: 28,
              height: 28,
            }}
          />
        </TouchableOpacity>
      )}
      <ModalWarning
        title={'กรุณาเปิดสิทธิ์การเข้าถึง Storage'}
        onlyCancel
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
}
