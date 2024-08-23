import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  formValueSelector,
} from 'redux-form';
import {
  View,
  StyleSheet,
  findNodeHandle,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import _ from 'lodash';
import { required, minLength6, addSpace } from '../config/validation';
import CHeader from '../components/CHeader';
import renderField from '../config/renderField';


const extraHeight = Platform.OS === 'ios' ? 0 : 300;

const styles = StyleSheet.create({

});

class ChangePwdForm extends Component {
  constructor(props) {
    super(props);
    this.refFields = [];
    this.state = {
    };
  }

  onFocusScroll = (refName) => {
    // const node = findNodeHandle(this.refFields[refName]);
    // this.scroll.scrollToFocusedInput(node, extraHeight, 0);
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
      // password,
      // reEnterPassword,
      navigation,
      authActions: { trans },
    } = this.props;

    // const passwordMatch = password !== reEnterPassword;
    return (
      <View style={{ flex: 1 }}>
        <CHeader
          showBackArrow
          showCenterTextr
          showRightText
          rightText={trans('ChangePasswordForm_right_btn_text')}
          centerText={trans('ChangePasswordForm_page_title')}
          onBackAction={() => { navigation.goBack(); }}
          onRightIconAction={handleSubmit}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
          keyboardShouldPersistTaps="handled"
          ref={(c) => { if (c != null) { this.scroll = c; } }}
        >
          <View>
            <Field
              leftIcon="Padlock"
              name="password"
              type="password"
              label=""
              component={renderField}
              placeholder={trans('ChangePasswordForm_field_1_placeholder')}
              validate={[required, minLength6, addSpace]}
              refField={this.setRefField}
              refName="password"
              keyboardType="default"
              onEnter={() => this.setNextFocus('confirm_password')}
              onFocus={() => this.onFocusScroll('password')}
            />
            <Field
              leftIcon="Padlock"
              name="confirm_password"
              type="password"
              label=""
              component={renderField}
              placeholder={trans('ChangePasswordForm_field_2_placeholder')}
              validate={[required, minLength6, addSpace]}
              refField={this.setRefField}
              refName="confirm_password"
              keyboardType="default"
              onEnter={handleSubmit}
              onFocus={() => this.onFocusScroll('confirm_password')}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

ChangePwdForm.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  handleSubmit: PropTypes.func,
};

ChangePwdForm.defaultProps = {
  navigation: {},
  authActions: {},
  handleSubmit: () => null,
};

function mapStateToProps(state) {
  const selector = formValueSelector('Change_PwdForm');
  const password = selector(state, 'password');
  const reEnterPassword = selector(state, 'confirm_password');
  return {
    password,
    reEnterPassword,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'Change_PwdForm',
})(ChangePwdForm));
