import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { Icon } from '../config/icons';
import colors from '../config/styles';
import settings from '../config/settings';
import common from '../config/genStyle';
import { FORTAB } from '../config/MQ';

const dH = FORTAB ? 60 : 35;
const { width } = Dimensions.get('window');
const { borderIssue } = settings;

const styles = StyleSheet.create({
  container: {
    height: FORTAB ? 50 : 40,
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  containerFull: {
    height: dH * 2.5,
    paddingTop: 10,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#0000',
  },
  input: {
    color: 'black',
    flex: 1,
    fontSize: FORTAB ? 18 : 15,
    fontFamily: colors.fonts.proximaNova.regular,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    letterSpacing: 0.3,
    borderBottomWidth: Platform.OS === 'ios' ? 0 : 1,
    borderBottomColor: Platform.OS === 'ios' ? '#0000' : '#8e8e93',
  },
  dateText: {
    color: '#FFF',
    fontSize: FORTAB ? 20 : 14,
    fontFamily: colors.fonts.proximaNova.regular,
    textAlign: 'left',
  },
  datePickerCont: {
    height: 28,
    justifyContent: 'center',
  },
  leftIconView: {
    width: dH,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  leftIcon: {
    color: '#8e8e93',
    marginTop: -2,
    fontSize: FORTAB ? 25 : 20,
  },
  textContent: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
  },
  inputText: {
    width: width / 3,
    color: colors.brandBtnColor,
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: RFValue(17),
  },
});

const datePickerStyle = StyleSheet.create({
  dateInput: {
    borderWidth: 0,
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    height: dH - (FORTAB ? 20 : 10),
    alignItems: 'flex-start',
  },
  placeholderText: {
    color: '#323232',
    // fontSize: FORTAB ? 20 : 13,
    fontSize: RFValue(13),
    fontFamily: colors.fonts.proximaNova.regular,
    textAlign: 'left',
  },
  dateText: {
    color: '#323232',
    // fontSize: FORTAB ? 20 : 13,
    fontSize: RFValue(13),
    fontFamily: colors.fonts.proximaNova.regular,
    textAlign: 'left',
  },
  btnTextConfirm: {
    color: '#000',
  },
});

class CInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  onFocus() {
    this.setState({ focused: true }, () => {
      if (this.props.onFocus) {
        this.props.onFocus();
      }
    });
  }

  onBlur() {
    this.setState({ focused: false }, () => {
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    });
  }

  blur = () => {
    if (this.input) {
      this.input.blur();
    }
  };

  getContainerStyle() {
    const { focused } = this.state;
    // const { leftIcon } = this.props;
    const style = {};
    if (focused) {
      if (borderIssue) {
        style.backgroundColor = '#FFF3';
      } else {
        // style.borderColor = colors.brandBackgroundLight;
        // style.borderWidth = 1;
      }
    }
    if (borderIssue) {
      style.borderWidth = 0;
    }
    return style;
  }

  focus() {
    if (this.input !== undefined && this.input !== null) {
      if (this.props.datePicker) {
        this.input.onPressDate();
      } else {
        this.input.focus();
      }
    }
  }

  render() {
    const { focused, date } = this.state;
    const {
      inputStyle,
      datePicker,
      onSubmitEditing,
      onChangeText,
      leftIcon,
      MleftIcon,
      FleftIcon,
      bankdetails,
      textArea,
      value,
      placeholder,
      beforeText,
      borderNone,
      // borderWid,
      viewStyle,
      ColorSty,
      editable,
      beforeTxtBg,
      mgBottom,
      mode,
      format,
      minDate,
      setWidth,
      setView,
      placeholderTextColor,
      addBankIcon,
      searchIcon,
    } = this.props;
    return (
      /* eslint-disable no-nested-ternary */
      <View style={[
        (textArea ? styles.containerFull : [styles.container, { marginBottom: mgBottom, width: setWidth > 0 || setWidth !== '' ? setWidth : '100%' }, setView]),
        common.shadow,
        // beforeLogin ? styles.bfLogin : (null),
        // focused ? { borderBottomColor: colors.brandAppBackColor, borderBottomWidth: 1 } : null,
        borderNone ? { borderBottomWidth: 0 } : null,
        // borderWid ? { borderBottomWidth: 1} : null,
        viewStyle,
        // beforeTxtBg ? { paddingLeft: 0 }  : null,
        // !leftIcon ? { paddingLeft: dH / 2 } : null,
        this.getContainerStyle(),
      ]}
      >
        {leftIcon ? (
          <View style={styles.leftIconView}>
            {searchIcon
              ? <MIcon name="search" style={[styles.leftIcon, ColorSty]} />
              : bankdetails
                ? <FIcon name={FleftIcon} style={[styles.leftIcon, ColorSty]} />
                : <Icon name={leftIcon} style={[styles.leftIcon, ColorSty]} />
            }
            {/* {addBankIcon ? <FIcon name="bank" style={[styles.leftIcon, ColorSty]} />
              : null } */}
          </View>
        ) : (null)}

        {datePicker ? (
          <DatePicker
            date={date || value}
            ref={(o) => {
              this.input = o;
            }}
            mode={mode !== '' ? mode : 'date'}
            placeholder={placeholder}
            format={format !== '' ? format : 'DD-MM-YYYY'}
            minDate={minDate !== '' ? minDate : moment().format('DD-MM-YYYY')}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"

            iconComponent={<Icon nam="Home" color="#FFF" />}
            style={styles.datePickerCont}
            customStyles={datePickerStyle}
            onDateChange={(dDate) => {
              this.setState({ date: dDate }, () => {
                if (onChangeText) {
                  onChangeText(dDate);
                }
                setTimeout(() => {
                  if (onSubmitEditing) {
                    onSubmitEditing();
                  }
                }, 1000);
              });
            }}
          />
        ) : (beforeText || beforeTxtBg) ? (
          <View style={[styles.textContent, beforeTxtBg ? { alignItems: 'center' } : (null)]}>
            <Text style={[styles.inputText, beforeTxtBg
              ? {
                backgroundColor: '#f8f8f8',
                borderRightWidth: StyleSheet.hairlineWidth,
                borderRightColor: '#eee',
                height: 40,
                lineHeight: 40,
                maxWidth: 40,
                color: '#000',
                textAlign: 'center',
              }
              : (null)]}
            >
              {beforeText}
            </Text>
            <TextInput
              {...this.props}
              ref={(o) => { this.input = o; }}
              multiline={textArea}
              numberOfLines={textArea ? 6 : 1}
              placeholderTextColor="#8e8e93"
              underlineColorAndroid="#0000"
              onFocus={() => this.onFocus()}
              onBlur={() => this.onBlur()}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                inputStyle,
                textArea ? { textAlignVertical: 'top' } : null,
              ]}
            />
          </View>
        ) : (
          <TextInput
            {...this.props}
            ref={(o) => { this.input = o; }}
            value={value && value.toString ? value.toString() : value}
            multiline={textArea}
            numberOfLines={textArea ? 5 : 1}
            selectionColor={colors.brandAppBackColor}
            placeholderTextColor={placeholderTextColor ? placeholderTextColor : '#8e8e93'}
            underlineColorAndroid="#0000"
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            autoCapitalize="none"
            autoCorrect={false}
            editable={editable}
            style={[
              styles.input,
              inputStyle,
              textArea ? { textAlignVertical: 'top' } : null,
            ]}
          />
        )}
      </View>
    /* eslint-disable no-nested-ternary */
    );
  }
}


CInput.propTypes = {
  inputStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.any,
  ]),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  datePicker: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  leftIcon: PropTypes.string,
  MleftIcon: PropTypes.string,
  FleftIcon: PropTypes.string,
  bankdetails: PropTypes.bool,
  addBankIcon: PropTypes.bool,
  textArea: PropTypes.bool,
  beforeText: PropTypes.string,
  mode: PropTypes.string,
  format: PropTypes.string,
  minDate: PropTypes.string,
  beforeTxtBg: PropTypes.bool,
  viewStyle: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.objectOf(PropTypes.any),
    PropTypes.any,
  ]),
};

CInput.defaultProps = {
  inputStyle: null,
  onFocus: null,
  onBlur: null,
  datePicker: false,
  onSubmitEditing: null,
  onChangeText: null,
  placeholder: 'Default Placeholder',
  leftIcon: null,
  MleftIcon: null,
  FleftIcon: null,
  bankdetails: false,
  addBankIcon: false,
  textArea: false,
  beforeTxtBg: false,
  viewStyle: {},
  beforeText: '',
  mode: '',
  format: '',
  minDate: '',
};

export default CInput;
