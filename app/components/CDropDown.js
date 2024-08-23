import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  // Platform,
} from 'react-native';
import _ from 'lodash';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dropdown } from '../libs/react-native-material-dropdown/index';
import colors from '../config/styles';
import common from '../config/genStyle';
import settings from '../config/settings';
// eslint-disable-next-line import/named
import { FORTAB } from '../config/MQ';
import { Icon } from '../config/icons';

const dH = FORTAB ? RFValue(50) : RFValue(40);
const drpH = FORTAB ? RFValue(46) : RFValue(36);
const sDH = FORTAB ? RFValue(30) : RFValue(30);
const sdrpH = FORTAB ? RFValue(20) : RFValue(20);
const { borderIssue } = settings;
const styles = StyleSheet.create({
  container: {
    height: dH,
    width: '100%',
    marginBottom: FORTAB ? RFValue(10) : RFValue(3),
    flexDirection: 'row',
    backgroundColor: colors.semiTransparentWhite,
    borderColor: colors.unFocusColor,
    borderBottomWidth: 1,
    position: 'relative',
  },
  inputContainer: {
    marginTop: 0,
  },
  smallCont: {
    height: sDH,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.semiTransparentWhite,
    borderRadius: sDH / 2,
    marginVertical: RFValue(5),
    position: 'relative',
    paddingLeft: sDH / 2,
  },
  sCont: {
    flex: 1,
    height: RFValue(20),
    backgroundColor: '#0000',
    marginBottom: RFValue(5),
    position: 'relative',
  },
  dropDownCont: {
    flex: 1,
    backgroundColor: '#0000',
    position: 'relative',
  },
  leftIconView: {
    width: dH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    color: '#FFF',
    marginTop: -2,
    fontSize: FORTAB ? RFValue(20) : RFValue(15),
  },
  error: {
    color: colors.errorColor,
  },
  warning: {
    color: colors.warningColor,
  },
});

const dropdownStyles = StyleSheet.create({
  container: {
    height: drpH,
    width: '100%',
    flexDirection: 'row',
    padding: RFValue(2),
  },
  sContainer: {
    height: sdrpH,
    width: '100%',
    flexDirection: 'row',
  },
  dTextView: {
    flex: 1,
    marginHorizontal: RFValue(5),
    justifyContent: 'center',
  },
  dText: {
    color: '#0008',
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: FORTAB ? RFValue(20) : RFValue(14),
    textAlign: 'left',
  },
  dRightView: {
    height: drpH,
    width: drpH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sDRightView: {
    height: sdrpH,
    width: sdrpH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

let firstElement = [{
  id: 'firstElement',
  value: 'Category',
}];

class CDropDown extends Component {
  constructor(props) {
    super(props);
    this.multiDefects = [];
    this.state = {
    };
  }

  onFocus = () => {
    const currentFocusedId = TextInput.State.currentlyFocusedField();
    if (_.isNumber(currentFocusedId)) {
      TextInput.State.blurTextInput(currentFocusedId);
    }
  }

  getValue = () => {
    const { input, value } = this.props;
    let val = {};
    if (input && input.value) {
      val = input.value;
    } else if (value) {
      val = value;
    }
    return val;
  }

  getDData = () => {
    const { dropdownData, input, firstLabel } = this.props;
    let dData = [];

    if (firstLabel) {
      firstElement[0].value = firstLabel;
    }

    if (input) {
      if (_.isArray(dropdownData)) {
        dData = firstElement.concat(dropdownData);
      } else {
        dData = firstElement;
      }
    } else {
      dData = dropdownData;
    }
    return dData;
  };

  getContainerStyle = () => {
    const { meta, isDisable } = this.props;
    const style = {};
    if (isDisable) {
      // style.backgroundColor = colors.disableGrey;
    }
    if (meta && meta.active) {
      if (borderIssue) {
        style.backgroundColor = '#FFF3';
      } else {
        // style.borderColor = colors.focusColor;
        style.borderWidth = 1;
      }
    } else if (meta && meta.touched && !meta.active) {
      if (meta.valid) {
      } else if (meta.invalid) {
        // style.borderColor = colors.errorColor;
      }
    }

    if (borderIssue) {
      style.borderWidth = 0;
    }
    return style;
  }

  renderBase = (dataObj) => {
    const { bTextStyle, smallhof, defaultText } = this.props;

    const dText = _.isString(defaultText) && defaultText !== '' ? defaultText : 'Category';
    const dValue = _.isObject(dataObj) && _.isString(dataObj.value) && dataObj.value !== '' ? dataObj.value : dText;
    return (
      <View
        style={[smallhof
          ? dropdownStyles.sContainer
          : dropdownStyles.container,
        bTextStyle ? { paddingLeft: -dH / 2 } : null,
        ]}
      >
        <View style={dropdownStyles.dTextView}>
          <Text
            numberOfLines={1}
            style={[dropdownStyles.dText, bTextStyle]}
          >
            {dValue}
          </Text>
        </View>
        <View style={smallhof ? dropdownStyles.sDRightView : dropdownStyles.dRightView}>
          <FaIcon name="angle-down" style={[{ fontSize: RFValue(20), color: '#0008' }]} />
        </View>
      </View>
    );
  };

  renderSingleDropdown = () => {
    const {
      input,
      label,
      onChangeText,
      leftIcon,
      disabled,
      smallhof,
      upside,
      isDisable,
      selectValue,
      pickerStyle,
      accordianDrop,
    } = this.props;
    const val = this.getValue();
    const dData = this.getDData();

    const dValue = _.isObject(selectValue) && selectValue.value ? _.toString(selectValue.value) : '';
    return (
      <View style={[
        smallhof ? styles.smallCont : styles.container,
        accordianDrop ? { marginTop: RFValue(12) } : (null),
        this.getContainerStyle(),
      ]}
      >
        {leftIcon
          ? (
            <View style={styles.leftIconView}>
              <Icon name={leftIcon} style={styles.leftIcon} />
            </View>
          )
          : (null)
        }
        <Dropdown
          label={label}
          value={dValue || (val && val.value ? val.value : '')}
          data={dData}
          baseColor="#000"
          disabled={disabled || isDisable}
          containerStyle={[smallhof ? styles.sCont : styles.dropDownCont]}
          pickerStyle={{ backgroundColor: colors.pureWhite, ...pickerStyle }}
          itemColor="#0008"
          selectedItemColor="#000"
          itemTextStyle={[dropdownStyles.dText, { color: '#0008' }]}
          renderBase={obj => this.renderBase(obj)}
          fontSize={FORTAB ? RFValue(20) : RFValue(14)}
          rippleInsets={{
            left: 0,
            top: 0,
            bottom: smallhof ? RFValue(18) : 0,
            right: 0,
          }}
          dropdownPosition={upside ? RFValue(4) : 0}
          itemPadding={FORTAB ? RFValue(20) : RFValue(10)}
          onFocus={this.onFocus}
          onChangeText={(dV) => {
            if (input && input.onChange) {
              if (dV.id !== 'firstElement') {
                return input.onChange(dV);
              }
              return input.onChange({});
            } if (onChangeText) {
              onChangeText(dV);
            }
          }}
        />
      </View>
    );
  };

  render() {
    const {
      meta,
      label,
      refName,
      refField,
      labelHide,
    } = this.props;
    return (
      <View style={label === 'PerPage' ? null : { marginBottom: RFValue(5), marginHorizontal: RFValue(5) }}>
        { !labelHide && label !== 'PerPage'
          ? (<Text style={[common.textSmall, { marginVertical: RFValue(5) }]}>{label}</Text>) : (null)}
        <View>
          <View
            ref={(c) => {
              if (c && refField) {
                refField(c, refName);
              }
            }}
            style={styles.inputContainer}
          >
            {this.renderSingleDropdown()}
          </View>
          {meta && meta.touched
            && ((meta.error
                && <Text style={[common.textSmall, styles.error]}>{meta.error}</Text>)
              || (meta.warning
                && <Text style={[common.textSmall, styles.warning]}>{meta.warning}</Text>))}
        </View>
      </View>
    );
  }
}


CDropDown.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
  }),
  meta: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    error: PropTypes.string,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    visited: PropTypes.bool.isRequired,
  }),
  label: PropTypes.string.isRequired,

  dropdownData: PropTypes.arrayOf(PropTypes.any),
  pickerStyle: PropTypes.objectOf(PropTypes.any),
  onChangeText: PropTypes.func,
  leftIcon: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  disabled: PropTypes.bool,
  bTextStyle: PropTypes.bool,
  smallhof: PropTypes.bool,
  refName: PropTypes.string,
  defaultText: PropTypes.string,
  refField: PropTypes.func,
  upside: PropTypes.bool,
  isDisable: PropTypes.bool,
  accordianDrop: PropTypes.bool,
  labelHide: PropTypes.bool,
};

CDropDown.defaultProps = {
  dropdownData: [],
  onChangeText: null,
  leftIcon: null,
  value: {},
  pickerStyle: {},
  disabled: false,
  bTextStyle: false,
  smallhof: false,
  refName: '',
  defaultText: '',
  refField: null,
  upside: false,
  isDisable: false,

  input: null,
  meta: null,
  accordianDrop: false,
  labelHide: false,
};

export default CDropDown;
