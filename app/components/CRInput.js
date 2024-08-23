import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  TextInput,
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { Icon } from '../config/icons';
import colors from '../config/styles';
import settings from '../config/settings';
import common from '../config/genStyle';
import { FORTAB } from '../config/MQ';

const dH = RFValue(FORTAB ? 60 : 35);
const { width } = Dimensions.get('window');
const { borderIssue } = settings;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 2,
  },
  valid: {
    borderColor: '#53E69D',
  },
  invalid: {
    borderColor: '#F55E64',
  },
  container: {
    height: RFValue(FORTAB ? 50 : 40),
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  containerFull: {
    height: dH * 5,
    paddingTop: RFValue(10),
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#0000',
  },
  input: {
    color: 'black',
    flex: 1,
    fontSize: RFValue(FORTAB ? 18 : 15),
    fontFamily: colors.fonts.proximaNova.regular,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    letterSpacing: 0.3,
    borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
    borderBottomColor: '#8e8e93',
  },
  dateText: {
    color: '#000',
    fontSize: RFValue(FORTAB ? 20 : 12),
    fontFamily: colors.fonts.proximaNova.regular,
    textAlign: 'left',
  },
  datePickerCont: {
    flex: 1,
    justifyContent: 'center',
    padding: RFValue(2),
  },
  leftIconView: {
    width: dH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    color: '#000',
    marginTop: -2,
    fontSize: RFValue(FORTAB ? 20 : 15),
  },
  error: {
    color: colors.errorColor,
  },
  warning: {
    color: colors.warningColor,
  },
  validText: {
    color: colors.validColor,
  },
});

const datePickerStyle = StyleSheet.create({
  dateInput: {
    borderWidth: 0,
    flex: 1,
    marginHorizontal: RFValue(5),
    paddingTop: 0,
    paddingBottom: 0,
    height: dH - RFValue(FORTAB ? 20 : 10),
    alignItems: 'flex-start',
  },
  placeholderText: {
    color: '#CCC',
    fontSize: RFValue(FORTAB ? 20 : 12),
    fontFamily: colors.fonts.proximaNova.regular,
    textAlign: 'left',
  },
  dateText: {
    color: '#000',
    fontSize: RFValue(FORTAB ? 20 : 12),
    fontFamily: colors.fonts.proximaNova.regular,
    textAlign: 'left',
  },
  btnTextConfirm: {
    color: colors.brandBackgroundLight,
  },
  btnTextCancel: {
    color: '#F00',
  },
  btnConfirm: {
    padding: RFValue(3),
    paddingHorizontal: RFValue(10),
  },
  btnCancel: {
    padding: RFValue(3),
    paddingHorizontal: RFValue(10),
  },
});

/**
 * to be wrapped with redux-form Field component
 */
export default class CInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getContainerStyle = () => {
    const {
      meta,
      isDisable,
    } = this.props;
    const style = {};
    if (isDisable) {
      style.backgroundColor = colors.disableGrey;
    }
    if (meta && meta.active) {
      if (borderIssue) {
        style.backgroundColor = '#FFF3';
      } else {
        style.borderColor = colors.focusColor;
        style.borderWidth = 0;
      }
    } else if (meta && meta.touched && !meta.active) {
      if (meta.valid) {
        // style.borderColor = colors.validColor;
      } else if (meta.invalid) {
        style.borderColor = colors.errorColor;
      }
    }
    if (borderIssue) {
      style.borderWidth = 0;
    }
    return style;
  }

  getValue = () => {
    const { input } = this.props;
    if (_.isObject(input) && input.value !== undefined && input.value !== null) {
      if (_.isObject(input.value) && (typeof input.value.value === 'string' || typeof input.value.value === 'number')) {
        return input.value.value.toString();
      } if (input.value.toString) {
        return input.value.toString();
      }
      return '';
    }
    return '';
  };

  renderInput = () => {
    const {
      input,
      meta,
      inputStyle,
      datePicker,
      onSubmitEditing,
      onChangeText,
      leftIcon,
      textArea,
      placeholder,
      minDate,
      maxDate,
      isDisable,
      refName,
      refField,
      onEnter,
      filterSpace,
      mgBottom,
      setWidth,
      setView,
      borderNone,
      viewStyle,
      bankdetails,
      ColorSty,
      placeholderTextColor,
      FleftIcon,
      MleftIcon,
      editable,
      ...inputProps
    } = this.props;

    return (
      <View
        style={[
          (textArea
            ? styles.containerFull
            : [styles.container,
              { marginBottom: mgBottom, width: setWidth > 0 || setWidth !== '' ? setWidth : '100%' },
              setView,
            ]
          ),
          common.shadow,
          borderNone ? { borderBottomWidth: 0 } : null,
          viewStyle,
          this.getContainerStyle(),
        ]}
      >
        {leftIcon ? (
          <View style={styles.leftIconView}>
            {bankdetails ? <FIcon name={FleftIcon} style={[styles.leftIcon, ColorSty]} />
              : <Icon name={leftIcon} style={[styles.leftIcon, ColorSty]} />}
          </View>
        ) : (null) }
        {datePicker ? (
          <DatePicker
            date={input.value}
            ref={(o) => {
              this.input = o;
            }}
            mode="date"
            placeholder=" "
            format="YYYY-MM-DD"
            minDate={minDate || '1970-01-01'}
            maxDate={maxDate || moment().add(50, 'years').format('YYYY-MM-DD')}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconComponent={<Icon nam="ios-home" color="#FFF" />}
            style={styles.datePickerCont}
            customStyles={datePickerStyle}
            onDateChange={input.onChange}
          />
        ) : (
          <TextInput
            {...inputProps}
            onChangeText={(t) => {
              if (typeof t === 'string') {
                if (textArea) {
                  input.onChange(t);
                } else if (filterSpace) {
                  input.onChange(t);
                } else {
                  input.onChange(t.replace(/^\s+/, ''));
                }
              }
            }}
            placeholder={placeholder}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
            value={this.getValue()}
            ref={(c) => {
              if (c != null && refField != null) {
                refField(c, refName);
              }
            }}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={onEnter}
            multiline={textArea}
            editable={editable}
            selectionColor={colors.brandAppBackColor}
            numberOfLines={textArea ? 5 : 1}
            placeholderTextColor={placeholderTextColor || '#8e8e93'}
            underlineColorAndroid="#0000"
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.input,
              inputStyle,
              textArea ? { textAlignVertical: 'top' } : null,
            ]}
          />
        )}
      </View>
    );
  };

  render() {
    const {
      meta,
      leftIcon,
      // ...inputProps
    } = this.props;

    return (
      <View>
        <View style={styles.inputContainer}>
          {this.renderInput()}
        </View>
        {meta && meta.touched
            && ((meta.error
                && <Text style={[common.textSmall, styles.error, { marginLeft: leftIcon ? dH : 0 }]}>{meta.error}</Text>)
              || (meta.warning
                && <Text style={[common.textSmall, styles.warning]}>{meta.warning}</Text>))}
      </View>
    );
  }
}

CInput.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    error: PropTypes.string,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    visited: PropTypes.bool.isRequired,
  }).isRequired,

  inputStyle: PropTypes.objectOf(PropTypes.any),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  datePicker: PropTypes.bool,
  editable: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  leftIcon: PropTypes.string,
  FleftIcon: PropTypes.string,
  MleftIcon: PropTypes.string,
  textArea: PropTypes.bool,
  minDate: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.string,
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.any,
    PropTypes.string,
  ]),
  refName: PropTypes.string,
  refField: PropTypes.func,
  isDisable: PropTypes.bool,
  onEnter: PropTypes.func,
  filterSpace: PropTypes.bool,
};

CInput.defaultProps = {
  inputStyle: {},
  onFocus: null,
  onBlur: null,
  datePicker: false,
  onSubmitEditing: null,
  onChangeText: null,
  placeholder: 'jfgjh',
  leftIcon: null,
  FleftIcon: null,
  MleftIcon: null,
  textArea: false,
  minDate: null,
  maxDate: null,
  refName: '',
  refField: null,
  onEnter: null,
  isDisable: false,
  filterSpace: false,
  editable: true,
};
