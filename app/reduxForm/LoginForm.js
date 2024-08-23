import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  formValueSelector,
} from 'redux-form';
import {
  findNodeHandle,
  Keyboard,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import IoIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { required, UserNameOrEmail, minLength6 } from '../config/validation';
import renderField from '../config/renderField';
import colors from '../config/styles';
import common from '../config/genStyle';

const extraHeight = Platform.OS === 'ios' ? 0 : 300;

const styles = StyleSheet.create({
  BottomFixButton: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(25),
    backgroundColor: '#ffc000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: RFValue(20),
    right: RFValue(40),
  },
  checkIconSty: {
    color: '#FFF',
    fontSize: RFValue(35),
  },
  InfoTextSty: {
    textAlign: 'left',
    color: '#8e8e93',
    lineHeight: 15,
    letterSpacing: 0.3,
    fontSize: RFValue(12),
  },
});

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.refFields = [];
    this.state = {
    };
  }

  onFocusScroll = (refName) => {
    const node = findNodeHandle(this.refFields[refName]);
    this.scroll.scrollToFocusedInput(node, extraHeight, 0);
  }

  setNextFocus = (refName) => {
    if (this.refFields[refName]) {
      this.refFields[refName].focus();
    } else {
      Keyboard.dismiss();
    }
  }

  setRefField = (ref, refName) => {
    this.refFields[refName] = ref;
  }

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  render() {
    const {
      handleSubmit,
      userName,
      password,
      submitting,
      authActions: { trans },
    } = this.props;

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const uName = /^[a-zA-Z0-9_-]{3,15}$/;
    const validUserName = _.isString(userName) && userName !== '' && (reg.test(userName) === true || uName.test(userName) === true);
    const validPwd = _.isString(password) && password !== '' && password.length >= 6;

    const disable = !validUserName || !validPwd || submitting === true;
    const active = validUserName && validPwd;

    return (
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 40, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
        ref={(c) => { if (c != null) { this.scroll = c; } }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text
            numberOfLines={1}
            style={[common.headerTitle]}
          >
            {trans('LogInForm_title_text')}
          </Text>
        </View>

        <View>
          <Field
            name="username"
            type="text"
            label=""
            component={renderField}
            placeholder={trans('LogInForm_field_1_placeholder')}
            validate={[required, UserNameOrEmail]}
            refField={this.setRefField}
            refName="username"
            keyboardType="email-address"
            onEnter={() => this.setNextFocus('password')}
            onFocus={() => this.onFocusScroll('username')}
          />
          <Field
            name="password"
            type="password"
            label=""
            component={renderField}
            placeholder={trans('LogInForm_field_2_placeholder')}
            validate={[required, minLength6]}
            refField={this.setRefField}
            refName="password"
            onEnter={handleSubmit}
            onFocus={() => this.onFocusScroll('password')}
          />
        </View>


        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <View>
            <Text numberOfLines={1} style={[common.textNormal, styles.InfoTextSty]}>
              {trans('LogInForm_forgot_password_text')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => { this.goto('ForgotPwd'); }}
          >
            <Text style={[common.textNBold, { color: colors.brandAppTextBlueColor }]}>
              {` ${trans('LogInForm_help_signin_text')}`}
            </Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={
            active
              ? [colors.brandAppButtonTopColor, colors.brandAppButtonBottomColor]
              : ['#D3D3D3', '#D3D3D3']
          }
          style={styles.BottomFixButton}
          location={[0.5, 0.9]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1.0, y: 0.0 }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={disable ? null : handleSubmit}
          >
            {submitting
              ? <ActivityIndicator size="small" color="#FFF" animating />
              : <IoIcon name="md-checkmark" style={styles.checkIconSty} />
          }
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    );
  }
}

LoginForm.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  handleSubmit: PropTypes.func,
  userName: PropTypes.string,
  password: PropTypes.string,
  submitting: PropTypes.bool,
};

LoginForm.defaultProps = {
  navigation: {},
  authActions: {},
  handleSubmit: () => null,
  userName: '',
  password: '',
  submitting: false,
};

function mapStateToProps(state) {
  const selector = formValueSelector('login_Form');
  const userName = selector(state, 'username');
  const password = selector(state, 'password');
  return {
    userName,
    password,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'login_Form',
  enableReinitialize: true,
})(LoginForm));
