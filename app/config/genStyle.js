import { StyleSheet, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from './styles';
import { FORTAB } from './MQ';

const common = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowRadius: 3,
      shadowOffset: { height: 5, width: 5 },
      zIndex: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#b0b0b0',
    },
    android: Platform.Version >= 21 ? {
    } : null,
  }),
  PT10: {
    paddingTop: RFValue(10),
  },
  MT5: {
    marginTop: RFValue(5),
  },
  MT10: {
    marginTop: RFValue(10),
  },
  MT20: {
    marginTop: RFValue(20),
  },
  MT25: {
    marginTop: RFValue(25),
  },
  ML10: {
    marginLeft: RFValue(10),
  },
  MB10: {
    marginBottom: RFValue(10),
  },
  MR10: {
    marginRight: RFValue(10),
  },
  PT15: {
    paddingTop: RFValue(15),
  },
  PT20: {
    paddingTop: RFValue(20),
  },
  PT30: {
    paddingTop: RFValue(30),
  },
  PB40: {
    paddingBottom: RFValue(40),
  },
  HP15: {
    paddingTop: RFValue(15),
  },
  HP10: {
    paddingTop: RFValue(10),
  },
  white: {
    color: '#FFF',
  },
  textBig: {
    color: '#000',
    fontSize: FORTAB ? RFValue(28) : RFValue(24),
    backgroundColor: '#0000',
    fontFamily: colors.fonts.proximaNova.regular,
  },
  textH1: {
    color: '#000',
    fontSize: FORTAB ? RFValue(26) : RFValue(22),
    backgroundColor: '#0000',
    fontFamily: colors.fonts.proximaNova.regular,
  },
  textH2: {
    color: '#000',
    fontSize: FORTAB ? RFValue(24) : RFValue(20),
    backgroundColor: '#0000',
    fontFamily: colors.fonts.proximaNova.regular,
  },
  textH3: {
    color: '#000',
    fontSize: FORTAB ? RFValue(22) : RFValue(18),
    backgroundColor: '#0000',
    fontFamily: colors.fonts.proximaNova.regular,
  },
  textH4: {
    color: '#000',
    fontSize: FORTAB ? RFValue(20) : RFValue(16),
    backgroundColor: '#0000',
    fontFamily: colors.fonts.proximaNova.regular,
  },
  headerTitle: {
    color: '#000',
    fontFamily: colors.fonts.proximaNova.semiBold,
    fontSize: FORTAB ? RFValue(26) : RFValue(22),
    backgroundColor: '#0000',
  },
  textNormal: {
    color: '#000',
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: FORTAB ? RFValue(20) : RFValue(14),
    backgroundColor: '#0000',
  },
  textNBold: {
    color: '#000',
    fontFamily: colors.fonts.proximaNova.semiBold,
    fontSize: FORTAB ? RFValue(20) : RFValue(12),
    backgroundColor: '#0000',
  },
  txtCenter: {
    textAlign: 'center',
  },
  textSmall: {
    color: '#000',
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: FORTAB ? RFValue(16) : RFValue(12),
    backgroundColor: '#0000',
  },
  semiBold: {
    fontFamily: colors.fonts.proximaNova.semiBold,
  },
  medium: {
    fontFamily: colors.fonts.proximaNova.medium,
  },
  regular: {
    fontFamily: colors.fonts.proximaNova.regular,
  },
  containerCommon: {
    flex: 1,
    justifyContent: 'center',
    padding: RFValue(10),
  },
  containerMainBg: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  justRowBet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textBold: {
    fontFamily: colors.fonts.proximaNova.bold,
  },
  text16: {
    fontSize: FORTAB ? RFValue(22) : RFValue(20),
  },
  brandColor: {
    color: colors.brandBtnColor,
  },
  StatusBar: {
    backgroundColor: colors.statusBarColor,
    height: colors.headerHeight,
  },
  CommonMainViewSty: {
    flex: 1,
    backgroundColor: colors.brandAppBackColor,
  },

  smallTextSty: {
    color: colors.brandAppBackColor,
    backgroundColor: '#0000',
    letterSpacing: 0.3,
    fontSize: FORTAB ? RFValue(12) : RFValue(8),
    fontFamily: colors.fonts.proximaNova.regular,
  },
});

export default common;
