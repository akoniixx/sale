import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const standardWidth = 385;
const standardHeight = 812;

const responsiveWidth = (width: number) =>
  (width * screenWidth) / standardWidth;
const responsiveHeigth = (height: number) =>
  (height * screenHeight) / standardHeight;

export { responsiveHeigth, responsiveWidth };
