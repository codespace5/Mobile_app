import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  formValueSelector,
} from 'redux-form';
import {
  findNodeHandle,
  Keyboard,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import IoIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { required, email } from '../config/validation';
import renderField from '../config/renderField';
import common from '../config/genStyle';
import colors from '../config/styles';


const extraHeight = Platform.OS === 'ios' ? 0 : 300;

const styles = StyleSheet.create({
  forgotInfoText: {
    color: '#8e8e93',
    lineHeight: 13,
    letterSpacing: 0.2,
  },
  BottomFixButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffc000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 40,
  },
  checkIconSty: {
    color: '#FFF',
    fontSize: RFValue(35),
  },
});

class ForgotPwdForm extends Component {
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
      Email,
      submitting,
      authActions: { trans },
    } = this.props;

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const validEmail = _.isString(Email) && Email !== '' && reg.test(Email) === true;

    const disable = !validEmail || submitting === true;
    const active = validEmail;
    return (
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 40, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
        ref={(c) => { if (c != null) { this.scroll = c; } }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text numberOfLines={1} style={[common.headerTitle, { marginBottom: 5 }]}>
            {trans('ForgotPasswordForm_forgot_password_text')}
          </Text>

          <Text numberOfLines={2} style={[common.textSmall, styles.forgotInfoText]}>
            {trans('ForgotPasswordForm_forgot_password_msg_text')}
          </Text>
        </View>
        <View>
          <Field
            name="email"
            type="text"
            label=""
            component={renderField}
            placeholder={trans('ForgotPasswordForm_field_1_placeholder')}
            validate={[required, email]}
            refField={this.setRefField}
            refName="email"
            keyboardType="email-address"
            onEnter={handleSubmit}
            onFocus={() => this.onFocusScroll('email')}
          />
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
          // onPress={disable ? null : () => { this.ValidateData(); }}
            onPress={disable ? null : handleSubmit}
          >
            {submitting
              ? <ActivityIndicator size="small" color="#FFF" animating />
              : <IoIcon name="md-arrow-forward" style={styles.checkIconSty} />
            }
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    );
  }
}

ForgotPwdForm.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  handleSubmit: PropTypes.func,
};

ForgotPwdForm.defaultProps = {
  navigation: {},
  authActions: {},
  handleSubmit: () => null,
};

function mapStateToProps(state) {
  const selector = formValueSelector('Forgot_PwdForm');
  const Email = selector(state, 'email');
  return {
    Email,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'Forgot_PwdForm',
})(ForgotPwdForm));
