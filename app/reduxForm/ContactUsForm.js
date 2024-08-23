import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector, change } from "redux-form";
import { findNodeHandle, Keyboard, View, Platform } from "react-native";
import _ from "lodash";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ConfirmGoogleCaptcha from "react-native-google-recaptcha-v2";
import { required, maxLength251, singleDropDown } from "../config/validation";
import renderField from "../config/renderField";
import CButton from "../components/CButton";
import common from "../config/genStyle";
import settings from "../config/settings";

const extraHeight = Platform.OS === "ios" ? 0 : 300;

const dropdownData = [
  {
    id: 1,
    value: "General Inquiry",
  },
  {
    id: 2,
    value: "Advertisement",
  },
  {
    id: 3,
    value: "Sponsorship",
  },
];

class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.captchaFormRef = createRef();
    this.refFields = [];
    this.state = {};
  }

  onFocusScroll = (refName) => {
    const node = findNodeHandle(this.refFields[refName]);
    this.scroll.scrollToFocusedInput(node, extraHeight, 0);
  };

  setNextFocus = (refName) => {
    if (this.refFields[refName]) {
      this.refFields[refName].focus();
    } else {
      Keyboard.dismiss();
    }
  };

  setRefField = (ref, refName) => {
    this.refFields[refName] = ref;
  };

  handleCaptchaResult = (event) => {
    const { change, handleSubmit } = this.props;

    try {
      if (event && event.nativeEvent.data) {
        if (["cancel", "error", "expired"].includes(event.nativeEvent.data)) {
          this.captchaFormRef.hide();
        } else {
          this.captchaFormRef.hide();
          change("captchaToken", event.nativeEvent.data);
          setTimeout(() => {
            handleSubmit();
          }, 50);
        }
      }
    } catch (error) {
      console.log('ContactUsForm -> error', error);
      
    }
  };

  render() {
    const {
      handleSubmit,
      phonenumber,
      email,
      name,
      subject,
      submitting,
      body,
      authActions: { trans },
    } = this.props;

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    const uName = /^[a-z0-9_-]{3,15}$/;
    const validphonenumber =
      _.isString(phonenumber) && phonenumber !== "" && phonenumber.length <= 10 && phonenumber.length >= 10;
    const validemail =
      _.isString(email) &&
      email !== "" &&
      (reg.test(email) === true);
    const validname = _.isString(name) && name !== "" ? name : "";
    const validBodyText = _.isString(body) && body !== "" ? body : "";
    const validSubject = _.isObject(subject) && !_.isEmpty(subject);

    const buttonDisable =
      validphonenumber && validemail && validname && validSubject && validBodyText;

    // const buttonDisable = _.isString(videoDesc) && videoDesc !== '' && videoDesc.length <= 100 && checkTermCondition === true && _.isObject(categoryName) && !_.isEmpty(categoryName);
    return (
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        ref={(c) => {
          if (c != null) {
            this.scroll = c;
          }
        }}
      >
        <View>
          <Field
            inputStyle={{ paddingLeft: 8, marginLeft: 5, marginRight: 4 }}
            name="name"
            type="text"
            label=""
            component={renderField}
            // placeholder={trans('Contact_Name')}
            placeholder="Name"
            validate={[required]}
            refField={this.setRefField}
            refName="contact_name"
            keyboardType="default"
            onEnter={() => this.setNextFocus("conatct_phone")}
            onFocus={() => this.onFocusScroll("contact_name")}
            mgBottom={10}
          />
          <Field
            inputStyle={{ paddingLeft: 8, marginLeft: 5, marginRight: 4 }}
            name="phone_number"
            type="number"
            label=""
            component={renderField}
            // placeholder={trans('Contact_Phone')}
            placeholder="Phone Number"
            validate={[required]}
            refField={this.setRefField}
            refName="conatct_phone"
            keyboardType="phone-pad"
            onEnter={() => this.setNextFocus("conatct_email")}
            onFocus={() => this.onFocusScroll("conatct_phone")}
            mgBottom={10}
          />
          <Field
            inputStyle={{ paddingLeft: 8, marginLeft: 5, marginRight: 4 }}
            name="email"
            type="text"
            label=""
            component={renderField}
            // placeholder={trans('Contact_email')}
            placeholder="Email"
            validate={[required]}
            refField={this.setRefField}
            refName="conatct_email"
            keyboardType="email-address"
            onEnter={() => Keyboard.dismiss()}
            onFocus={() => this.onFocusScroll("conatct_email")}
            mgBottom={10}
          />
          <Field
            name="subject"
            type="select"
            component={renderField}
            dropdownData={dropdownData}
            label=""
            defaultText={trans("ContactForm_select_category_text")}
            firstLabel={trans("ContactForm_select_category_text")}
            // isDisable={update}
            validate={[required, singleDropDown]}
            refField={this.setRefField}
            refName="contact_subject"
            // pickerStyle={{
            //   height: 200,
            // }}
          />
          <View>
            <Field
              inputStyle={{ paddingLeft: 8, marginLeft: 5, marginRight: 4 }}
              name="body"
              type="text"
              label=""
              textArea
              component={renderField}
              // placeholder={trans('Body')}
              placeholder="Body"
              validate={[required, maxLength251]}
              refField={this.setRefField}
              refName="contact_body"
              keyboardType="default"
              onEnter={this.handleCaptchaResult}
              onFocus={() => this.onFocusScroll("contact_body")}
              mgBottom={10}
            />
          </View>

          <ConfirmGoogleCaptcha
            ref={(ref) => (this.captchaFormRef = ref)}
            siteKey={settings.captchaSiteKey}
            baseUrl={settings.baseUrl}
            onMessage={this.handleCaptchaResult}
          />
        </View>
        <View
          style={{ flex: 1, justifyContent: "flex-end", paddingVertical: 20 }}
        >
          <CButton
            disable={!buttonDisable}
            load={submitting}
            // btnText={trans("BankDetailForm_btn_text")}
            btnText="Send"
            btnStyle={{ padding: 0, margin: 0 }}
            textStyle={[common.textH3, common.semiBold, { color: "#FFF" }]}
            onPress={() => this.captchaFormRef?.show()}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

ContactUsForm.propTypes = {
  handleSubmit: PropTypes.func,
  phonenumber: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string,
  subject: PropTypes.string,
  submitting: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
  change: PropTypes.func,
};

ContactUsForm.defaultProps = {
  handleSubmit: () => null,
  phonenumber: "",
  email: "",
  name: "",
  subject: "",
  submitting: false,
  authActions: {},
  change: () => null,
};

function mapStateToProps(state) {
  const selector = formValueSelector("ContactUs_Form");
  const name = selector(state, "name");
  const phonenumber = selector(state, "phone_number");
  const email = selector(state, "email");
  const subject = selector(state, "subject");
  const body = selector(state, "body");
  const captchaToken = selector(state, "captchaToken");
  return {
    name,
    phonenumber,
    email,
    subject,
    body,
    captchaToken,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ change }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(
  reduxForm({
    form: "ContactUs_Form",
    enableReinitialize: true,
    initialValues: {
      subject: __DEV__ ? { id: 1, value: "General Inquiry" } : {},
      captchaToken: "",
    },
  })(ContactUsForm)
);
