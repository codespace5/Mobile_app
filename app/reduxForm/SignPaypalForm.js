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
import { required, email } from '../config/validation';
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
    lineHeight: RFValue(15),
    letterSpacing: 0.3,
    fontSize: RFValue(12),
  },
});

class SignPaypalForm extends Component {
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
      paypalEmail,
      loading,
      valid,
      authActions: { trans },
    } = this.props;

    const screenText = trans('Set_Paypal_email_content');

    const validpaypalEmailNo = _.isString(paypalEmail) && paypalEmail !== '';
    const disable = !validpaypalEmailNo || !valid;
    const active = validpaypalEmailNo && valid;

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
            {trans('SignPaypalForm_set_paypal_email')}
          </Text>
        </View>

        <View>
          <Field
            name="paypalEmail"
            type="text"
            label=""
            component={renderField}
            placeholder={trans('SignPaypalForm_field_1_placeholder')}
            validate={[required, email]}
            refField={this.setRefField}
            refName="paypalEmail"
            onEnter={handleSubmit}
            onFocus={() => this.onFocusScroll('paypalEmail')}
            keyboardType="email-address"
          />
        </View>

        {
          screenText !== '' && screenText !== 'blank'
          && (
          <Text style={{
            fontSize: RFValue(14),
            color: '#333',
            alignSelf: 'stretch',
            paddingVertical: RFValue(50),
          }}
          >
            {screenText}
          </Text>
          )}

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
            {loading
              ? <ActivityIndicator size="small" color="#FFF" animating />
              : <IoIcon name="md-checkmark" style={styles.checkIconSty} />
          }
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    );
  }
}

SignPaypalForm.propTypes = {
  handleSubmit: PropTypes.func,
  navigation: PropTypes.objectOf(PropTypes.any),
  paypalEmail: PropTypes.string,
  loading: PropTypes.bool,
  valid: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

SignPaypalForm.defaultProps = {
  handleSubmit: () => null,
  navigation: {},
  paypalEmail: '',
  loading: false,
  valid: false,
  authActions: {},
};

function mapStateToProps(state) {
  const selector = formValueSelector('sPaypal_Form');
  const paypalEmail = selector(state, 'paypalEmail');
  return {
    paypalEmail,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'sPaypal_Form',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(SignPaypalForm));
