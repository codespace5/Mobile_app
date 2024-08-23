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
  View,
  Platform,
} from 'react-native';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { required, maxLength18, maxLength14, maxLength251 } from '../config/validation';
import renderField from '../config/renderField';
import CButton from '../components/CButton';
import common from '../config/genStyle';

const extraHeight = Platform.OS === 'ios' ? 0 : 300;

class BankDetailsForm extends Component {
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

      render() {
        const {
          handleSubmit,
          accountNumber,
          ConfirmaccountNumber,
          phoneNumber,
          bankName,
          AccountholderName,
          submitting,
          // comments,
          authActions: { trans },
        } = this.props;

        // console.log('validaccountNumber & ConfirmaccountNumber =========================>');
        // console.log(accountNumber);
        // console.log(ConfirmaccountNumber);
        // const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        // const uName = /^[a-z0-9_-]{3,15}$/;
        // const validUserName = _.isString(userName) && userName !== '' &&
        // (reg.test(userName) === true || uName.test(userName) === true);
        const validaccountNumber = _.isString(accountNumber) && accountNumber !== '' && accountNumber.length <= 18;
        const validConfirmaccountNumber = _.isString(ConfirmaccountNumber) && ConfirmaccountNumber !== '' && ConfirmaccountNumber.length <= 18;
        const validphoneNumber = _.isString(phoneNumber) && phoneNumber !== '' && phoneNumber.length <= 14;
        const validbankName = _.isString(bankName) && bankName !== '' ? bankName : '';
        const validAccountholderName = _.isString(AccountholderName) && AccountholderName !== '' && AccountholderName.length < 50;

        const buttonDisable = validaccountNumber && validConfirmaccountNumber && validphoneNumber && validbankName && validAccountholderName;

        // const buttonDisable = _.isString(videoDesc) && videoDesc !== '' && videoDesc.length <= 100 && checkTermCondition === true && _.isObject(categoryName) && !_.isEmpty(categoryName);
        return (
          <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            ref={(c) => { if (c != null) { this.scroll = c; } }}
          >
            <View>
              <Field
                bankdetails
                FleftIcon="bank"
                leftIcon
                name="bank_name"
                type="text"
                label=""
                component={renderField}
                placeholder={trans('BankDetailForm_field_1_placeholder')}
                validate={[required, maxLength18]}
                refField={this.setRefField}
                refName="bank_name"
                keyboardType="default"
                onEnter={() => this.setNextFocus('bank_account_no')}
                onFocus={() => this.onFocusScroll('bank_name')}
                mgBottom={10}
              />
              <Field
                leftIcon="Security"
                name="bank_account_no"
                type="number"
                label=""
                component={renderField}
                placeholder={trans('BankDetailForm_field_2_placeholder')}
                validate={[required, maxLength18]}
                refField={this.setRefField}
                refName="bank_account_no"
                keyboardType="default"
                onEnter={() => this.setNextFocus('bank_account_no_confirm')}
                onFocus={() => this.onFocusScroll('bank_account_no')}
                mgBottom={10}
              />
              <Field
                leftIcon="Security"
                name="bank_account_no_confirm"
                type="number"
                label=""
                component={renderField}
                placeholder={trans('BankDetailForm_field_3_placeholder')}
                validate={[required, maxLength18]}
                refField={this.setRefField}
                refName="bank_account_no_confirm"
                keyboardType="default"
                onEnter={() => this.setNextFocus('bank_holder_name')}
                onFocus={() => this.onFocusScroll('bank_account_no_confirm')}
                mgBottom={10}
              />
              <Field
                leftIcon="User"
                name="bank_holder_name"
                type="text"
                label=""
                component={renderField}
                placeholder={trans('BankDetailForm_field_4_placeholder')}
                validate={[required, maxLength18]}
                refField={this.setRefField}
                refName="bank_holder_name"
                keyboardType="default"
                onEnter={() => this.setNextFocus('phone')}
                onFocus={() => this.onFocusScroll('bank_holder_name')}
                mgBottom={10}
              />
              <Field
                bankdetails
                FleftIcon="phone-square"
                leftIcon
                name="phone"
                type="number"
                label=""
                component={renderField}
                placeholder={trans('BankDetailForm_field_5_placeholder')}
                validate={[required, maxLength14]}
                refField={this.setRefField}
                refName="phone"
                keyboardType="phone-pad"
                onEnter={() => this.setNextFocus('bank_other')}
                onFocus={() => this.onFocusScroll('phone')}
                mgBottom={10}
              />
              <View style={{ paddingLeft: 34 }}>
                <Field
                  // leftIcon="Comment-fill"
                  name="bank_other"
                  type="text"
                  label=""
                  textArea
                  component={renderField}
                  placeholder={trans('BankDetailForm_field_6_placeholder')}
                  validate={[maxLength251]}
                  refField={this.setRefField}
                  refName="bank_other"
                  keyboardType="default"
                  onEnter={handleSubmit}
                  onFocus={() => this.onFocusScroll('bank_other')}
                  mgBottom={10}
                />
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingVertical: 20 }}>
              <CButton
                disable={!buttonDisable}
                load={submitting}
                btnText={trans('BankDetailForm_btn_text')}
                btnStyle={{ padding: 0, margin: 0 }}
                textStyle={[common.textH3, common.semiBold, { color: '#FFF' }]}
                onPress={handleSubmit}
              />
            </View>
          </KeyboardAwareScrollView>
        );
      }
}

BankDetailsForm.propTypes = {
  handleSubmit: PropTypes.func,
  accountNumber: PropTypes.string,
  ConfirmaccountNumber: PropTypes.string,
  phoneNumber: PropTypes.string,
  bankName: PropTypes.string,
  AccountholderName: PropTypes.string,
  submitting: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

BankDetailsForm.defaultProps = {
  handleSubmit: () => null,
  accountNumber: '',
  ConfirmaccountNumber: '',
  phoneNumber: '',
  bankName: '',
  AccountholderName: '',
  submitting: false,
  authActions: {},
};

function mapStateToProps(state) {
  const selector = formValueSelector('Bank_DetailsForm');
  const bankName = selector(state, 'bank_name');
  const accountNumber = selector(state, 'bank_account_no');
  const ConfirmaccountNumber = selector(state, 'bank_account_no_confirm');
  const AccountholderName = selector(state, 'bank_holder_name');
  const phoneNumber = selector(state, 'phone');
  const comments = selector(state, 'bank_other');
  return {
    bankName,
    accountNumber,
    ConfirmaccountNumber,
    AccountholderName,
    phoneNumber,
    comments,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'Bank_DetailsForm',
})(BankDetailsForm));
