/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../config/styles';
// eslint-disable-next-line import/named
import { FORTAB } from '../config/MQ';
import { Icon } from '../config/icons';

const dH = FORTAB ? 50 : 40;
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: dH,
    width: '100%',
    marginVertical: FORTAB ? RFValue(10) : RFValue(5),
    padding: 2,
    borderRadius: 5,
  },
  btnCont: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0000',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 5,
  },
  btnText: {
    backgroundColor: '#0000',
    color: '#FFF',
    fontFamily: colors.fonts.proximaNova.semiBold,
    fontSize: FORTAB ? RFValue(20) : RFValue(16),
    letterSpacing: 0.5,
  },
  leftIcon: {
    color: '#FFF',
    fontSize: FORTAB ? RFValue(26) : RFValue(18),
    marginHorizontal: RFValue(4),
  },
  disableBtn: {
    backgroundColor: '#AAA',
  },
});

export default class CButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  renderIcon() {
    const {
      iconProvider,
      leftIcon,
      iconColor,
      size,
    } = this.props;

    if (iconProvider === 'ionicons') {
      return (<IonIcon name={leftIcon} style={styles.leftIcon} />);
    } if (iconProvider === 'fontawesome') {
      return (
        <FAIcon
          name={leftIcon}
          style={[styles.leftIcon,
            iconColor ? { color: iconColor } : (null), size ? { fontSize: size } : (null)]}
          color={iconColor}
        />
      );
    }
    return (<Icon name={leftIcon} style={styles.leftIcon} />);
  }

  render() {
    const {
      btnText,
      load,
      onPress,
      btnStyle,
      btnPadding,
      textStyle,
      leftIcon,
      disable,
      circle,
      btnTStyle,
      loadColor,
      onRef,
      showSearchIcon,
    } = this.props;

    return (
      <LinearGradient
        colors={[colors.brandAppButtonTopColor, colors.brandAppButtonBottomColor]}
        style={[styles.container, { opacity: disable ? 0.5 : 1 }, btnStyle]}
        location={[0.5, 0.9]}
        start={{ x: 1, y: 1 }}
        end={{ x: 1.0, y: 0.0 }}
      >
        <TouchableOpacity
          ref={(o) => {
            if (o && _.isFunction(onRef)) {
              onRef(o);
            } else {
              this.CButton = o;
            }
          }}
          activeOpacity={disable ? 1 : 0.6}
          style={[
            styles.btnCont,
            btnPadding ? { paddingHorizontal: btnPadding / 2, borderRadius: btnPadding } : null,
            circle ? { borderRadius: dH / 2 } : null,
            // disable && !load ? styles.disableBtn : null,
            btnTStyle,
          ]}
          onPress={load || disable ? null : onPress}

        >
          {!load && leftIcon ? this.renderIcon() : (null)}
          {load ? <ActivityIndicator size={FORTAB ? 'small' : 'small'} color={loadColor || '#fff'} animating />
            : showSearchIcon ? <MIcon name="search" style={{ color: '#FFF', fontSize: RFValue(18) }} /> : <Text style={[styles.btnText, textStyle]}>{btnText}</Text>}
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

CButton.propTypes = {
  btnText: PropTypes.string,
  load: PropTypes.bool,
  onPress: PropTypes.func,
  disable: PropTypes.bool,
  btnStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.any,
  ]),
  btnPadding: PropTypes.number || null,
  textStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.any,
  ]),
  circle: PropTypes.bool,
};

CButton.defaultProps = {
  btnText: '',
  load: false,
  onPress: null,
  disable: false,
  btnStyle: null,
  btnPadding: null,
  textStyle: null,
  circle: false,
};
