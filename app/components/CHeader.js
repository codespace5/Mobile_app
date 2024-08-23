/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/named */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import IoIcon from 'react-native-vector-icons/Ionicons';
import EIcon from 'react-native-vector-icons/Entypo';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon } from '../config/icons';
import colors from '../config/styles';
import common from '../config/genStyle';
import { FORTAB } from '../config/MQ';
import Device from 'react-native-device-info';
import { isIphoneX } from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  headerMainView: {
    width: '100%',
    height: FORTAB ? 70 : 55,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: '#8e8e93',
    position: 'relative',
  },
  centerTextSty: {
    textAlign: 'center',
    backgroundColor: '#0000',
    color: '#000',
  },
  BackIconViewSty: {
    flex: 1,
    position: 'absolute',
    height: FORTAB ? 70 : 55,
    width: 55,
    padding: 10,
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  rightIconViewSty: {
    position: 'absolute',
    height: FORTAB ? 70 : 55,
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BackIconSty: {
    fontSize: FORTAB ? 35 : 30,
    color: '#000',
  },
  // addIconsty: {
  //   padding: 20,
  //   borderWidth: 1,
  //   borderColor: '#0000',
  //   borderRadius: '50%',
  // },
  profileTabViewSty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    height: FORTAB ? 70 : 55,
    top: 0,
    right: 0,
    paddingRight: 25,
  },
  profileTabIconSty: {
    fontSize: RFValue(20),
    color: '#000',
  },
  commonFlexSty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class CHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      centerText,
      showBackArrow,
      showCenterText,
      showRightText,
      onRightIconAction,
      onBackAction,
      rightText,
      ShowRightIcon,
      rightIconName,
      showBottomBorder,
      profileTab,
      profileTabIcon,
      Addbank,
      QrCodeAction,
      SettingAction,
      notificationIcon,
      notificationIconName,
      otherMainViewSty,
    } = this.props;

    return (
      <View style={[styles.headerMainView, { borderBottomWidth: showBottomBorder ? 1 : 0 }, otherMainViewSty]}>
        {showBackArrow ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.BackIconViewSty}
            onPress={onBackAction}
          >
            <IoIcon name="ios-arrow-round-back" style={styles.BackIconSty} />
            {/* {profileTab
              ? <Icon name="Add-user" style={styles.profileTabIconSty} />
              : <IoIcon name="md-arrow-back" style={styles.BackIconSty} />
            } */}
          </TouchableOpacity>
        ) : null}

        {showCenterText ? (
          <View style={{ width: '100%' }}>
            <Text
              numberOfLines={1}
              style={[common.textH3, common.textBold, styles.centerTextSty]}
            >
              {centerText}
            </Text>
          </View>
        ) : null}

        {showRightText ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.rightIconViewSty, { width: ShowRightIcon ? 55 : '25%' }]}
            onPress={onRightIconAction}
          >
            {ShowRightIcon ?
              notificationIcon ?
                <MIcon name={notificationIconName} style={[styles.profileTabIconSty, { fontSize: RFValue(16) }]} /> :
              profileTab
                ? (<EIcon name={profileTabIcon} style={[styles.profileTabIconSty, { fontSize: RFValue(16) }]} />)
                : (<Icon name={rightIconName} style={[styles.BackIconSty, { fontSize: RFValue(16) }]} />)
              : (
                <Text
                  numberOfLines={1}
                  style={[common.textH4,
                    common.textBold,
                    styles.centerTextSty,
                    { color: colors.brandAppBackColor },
                  ]}
                >
                  {rightText}
                </Text>
              )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

CHeader.propTypes = {
  centerText: PropTypes.string,
  showBackArrow: PropTypes.bool,
  showCenterText: PropTypes.bool,
  showRightText: PropTypes.bool,
  ShowRightIcon: PropTypes.bool,
  rightText: PropTypes.string,
  rightIconName: PropTypes.string,
  profileTabIcon: PropTypes.string,
  onRightIconAction: PropTypes.func,
  onBackAction: PropTypes.func,
  QrCodeAction: PropTypes.func,
  SettingAction: PropTypes.func,
  showBottomBorder: PropTypes.bool,
  profileTab: PropTypes.bool,
  Addbank: PropTypes.bool,
  notificationIcon: PropTypes.bool,
  notificationIconName: PropTypes.string,
};

CHeader.defaultProps = {
  centerText: '',
  showBackArrow: false,
  showCenterText: false,
  ShowRightIcon: false,
  showRightText: false,
  profileTab: false,
  Addbank: false,
  showBottomBorder: true,
  rightText: '',
  rightIconName: '',
  profileTabIcon: '',
  onRightIconAction: null,
  onBackAction: null,
  QrCodeAction: null,
  SettingAction: null,
  notificationIcon: false,
  notificationIconName: '',
};

export default CHeader;
