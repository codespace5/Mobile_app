import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Keyboard } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { stopSubmit, startSubmit, reset } from "redux-form";
import { bindActionCreators } from "redux";
import DeviceInfo from "react-native-device-info";
import CHeader from "../components/CHeader";
import { getReduxErrors } from "../components/CAlert";
import authActions from "../redux/reducers/auth/actions";
import SignPwdForm from "../reduxForm/SignPwdForm";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

class SigninPassword extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      macAddress: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    DeviceInfo.getMACAddress().then((mac) =>
      this.setState({ macAddress: mac })
    );
    setLeaveBreadcrumb(payload);
  };

  goto = (page) => {
    const { dispatch, navigation } = this.props;
    // dispatch(reset('sName_Form'));
    // dispatch(reset('sEmail_Form'));
    navigation.navigate(page);
  };

  handleSubmit = (values) => {
    // const { authActions: setScreen, setTop100PlayIndex, setHomePlayIndex } = this.props;
    Keyboard.dismiss();
    this.submitSignUpForm(values);
  };

  submitSignUpForm = (values) => {
    const {
      form: { sName_Form, sEmail_Form, sPhone_Form },
      authActions: { trans },
      dispatch,
      auth,
    } = this.props;

    const deviceCountry = DeviceInfo.getDeviceCountry();
    const userName =
      _.isObject(sName_Form) &&
      _.isObject(sName_Form.values) &&
      _.isString(sName_Form.values.username)
        ? sName_Form.values.username
        : "";
    const userEmail =
      _.isObject(sEmail_Form) &&
      _.isObject(sEmail_Form.values) &&
      _.isString(sEmail_Form.values.userEmail)
        ? sEmail_Form.values.userEmail
        : "";
    const userPhone =
      _.isObject(sPhone_Form) &&
      _.isObject(sPhone_Form.values) &&
      _.isString(sPhone_Form.values.phone)
        ? sPhone_Form.values.phone
        : "";
    const signup_answer =
      _.isObject(auth) && _.isObject(auth.signup_answer)
        ? auth.signup_answer
        : {};

    const data = {
      "SignupForm[username]": userName,
      "SignupForm[email]": userEmail,
      "SignupForm[phone]": userPhone,
      "SignupForm[password]":
        _.isObject(values) && _.isString(values.userPwd) ? values.userPwd : "",
      "SignupForm[country_id]": deviceCountry || "",
      "SignupForm[signed_artist]": signup_answer.answer1,
      "SignupForm[music_company]": signup_answer.answer2,
      "SignupForm[mac_address]": this.state.macAddress || "",
    };
    dispatch(startSubmit("sPwd_Form"));
    getApiDataProgress(settings.endpoints.signup, "post", data, {}, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          this.goto("SigninOtp");
        } else {
          const ErrObj = getReduxErrors(responseJson);
          console.log(ErrObj);
          const e =
            _.isObject(ErrObj) && _.isString(ErrObj.errors)
              ? ErrObj.errors
              : "";
          dispatch(stopSubmit("sPwd_Form", { userPwd: e }));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          stopSubmit("sPwd_Form", {
            _error: trans("network_error_msg"),
          })
        );
      });
  };

  BackToHome = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText={false}
          showRightText={false}
          showBottomBorder={false}
          onBackAction={() => {
            this.BackToHome();
          }}
        />
        <SignPwdForm
          // {...this.props}
          onSubmit={this.handleSubmit}
        />
      </View>
    );
  }
}

SigninPassword.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  form: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  authActions: PropTypes.objectOf(PropTypes.any),
  // auth: PropTypes.objectOf(PropTypes.any),
};

SigninPassword.defaultProps = {
  navigation: {},
  form: {},
  dispatch: () => null,
  authActions: {},
  // auth: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
    form: state.form,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SigninPassword);
