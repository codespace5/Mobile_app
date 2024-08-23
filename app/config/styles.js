import { Platform, StatusBar } from 'react-native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
// eslint-disable-next-line import/named
import { FORTAB } from './MQ';
// import settings from './settings';

const colors = {
  navBarBackgroundColor: '#fff',
  navBarTextColor: '#F66407',
  navBarSubtitleTextColor: '#F66407',
  navBarButtonColor: '#ae1218', // Change
  statusBarTextColorScheme: Platform.OS === 'ios' ? 'light' : 'light',
  statusBarColor: Platform.OS === 'ios' ? '#000' : '#000',
  navBarSubtitleColor: '#F66407',
  mainGradient: {
    colors: ['#f3a00500', '#f3a00533', '#f3a00566'],
    location: [0.75, 0.85, 1],
  },

  buttonGradient: {
    // colors: ['#f3a005', '#f76131'],
    colors: ['#f76131', '#f3a005'],
    location: [0.5, 0.75, 0.9],
    start: { x: 0.0, y: 0.0 },
    end: { x: 1.0, y: 0.0 },
  },

  brandBackgroundDark: '#162327',
  brandBackgroundLight: 'white',
  brandDarkOrange: '#f76131',
  brandBtnColor: '#F66407',
  tabBarBackGround: '#FFF',
  tabBarHeight: FORTAB ? 49 : 50,
  tabBarSelectedIconColor: '#f3a005',
  tabBarIconColor: '#888',
  pureWhite: '#FFFF',
  disableGrey: '#CCC',
  semiTransparentWhite: '#fff5',
  greyBtn: '#8e8e93',
  validColor: '#0F0',
  errorColor: '#F00',
  warningColor: '#A80',
  focusColor: '#000',
  unFocusColor: '#BBB',
  headerHeight: getStatusBarHeight(true),
  headerUnsafeHeight:
    Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight,
  bottomSpace: getBottomSpace(),
  // MTC APP COLORS CODE...
  brandAppTextBlackColor: '#262626',
  brandAppTextGrayColor: '#AAAAAA',
  brandAppTextBlueColor: '#2960BF',
  // brandAppBackColor: "#F8C63E",
  brandAppBackColor: '#ea6a1f',
  // brandAppButtonTopColor: '#FBB034',
  // brandAppButtonBottomColor: '#FFDD00',
  brandAppButtonTopColor: '#ea6a1f',
  brandAppButtonBottomColor: '#FBB034',

  /*
  theme -color #F8C63E - yellow primary
  text- color #262626 - black primary
  text- color #AAAAAA - gray secondary
  text- color #2960BF - blue highlighted

  gradient upside- #F8C63E
    Downside - #E73A34
  */

  fonts: {
    montserrat: {
      black: 'Montserrat-Black',
      blackItalic: 'Montserrat-BlackItalic',
      bold: 'Montserrat-Bold',
      boldItalic: 'Montserrat-BoldItalic',
      extraBold: 'Montserrat-ExtraBold',
      extraBoldItalic: 'Montserrat-ExtraBoldItalic',
      extraLight: 'Montserrat-ExtraLight',
      extraLightItalic: 'Montserrat-ExtraLightItalic',
      italic: 'Montserrat-Italic',
      light: 'Montserrat-Light',
      lightItalic: 'Montserrat-LightItalic',
      medium: 'Montserrat-Medium',
      mediumItalic: 'Montserrat-MediumItalic',
      regular: 'Montserrat-Regular',
      semiBold: 'Montserrat-SemiBold',
      semiBoldItalic: 'Montserrat-SemiBoldItalic',
      thin: 'Montserrat-Thin',
      thinItalic: 'Montserrat-ThinItalic',
    },
    proximaNova: {
      bold: 'ProximaNova-Bold',
      regular: 'ProximaNova-Regular',
      semiBold: 'ProximaNova-Semibold',
    },
  },
  navBarTextFontFamily: 'ProximaNova-Semibold',
};
export default colors;
