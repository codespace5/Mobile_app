/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Keyboard,
  BackHandler,
  AsyncStorage,
} from "react-native";
import _ from "lodash";
import { stopSubmit, startSubmit, reset } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CHeader from "../components/CHeader";
import { getReduxErrors } from "../components/CAlert";
import authActions from "../redux/reducers/auth/actions";
import OtpForm from "../reduxForm/OtpForm";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

class SigninOtp extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  };

  handleBackPress = () => {
    this.backToLogin();
    return true;
  };

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page, { load: true });
    // navigation.navigate(page, {
    //   load: true,
    // });
  };

  handleSubmit = (values) => {
    const {
      authActions: { setScreen, setTop100PlayIndex, setHomePlayIndex },
    } = this.props;
    Keyboard.dismiss();
    this.submitOTPForm(values);
  };

  submitOTPForm = (values) => {
    const {
      authActions: { setToken, trans },
      dispatch,
    } = this.props;

    const data = {
      code:
        _.isObject(values) && _.isString(values.OtpCode) ? values.OtpCode : "",
    };
    dispatch(startSubmit("sOtp_Form"));
    getApiDataProgress(settings.endpoints.verification, "post", data, {}, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          if (
            _.isObject(responseJson.data) &&
            responseJson.data.on_verification === 0 &&
            _.isString(responseJson.data.access_token) &&
            responseJson.data.access_token !== ""
          ) {
            const { country_code, country_name, country_img } =
              responseJson.data.country_data;
            setToken(responseJson.data.access_token);
            this.storeData(responseJson.data.access_token);
            this.setUserOtherData(
              responseJson.data.other_info,
              responseJson.data.email,
              country_code,
              country_name,
              country_img
            );
            this.goto("Home");
          }
          // this.backToLogin();
        } else {
          const ErrObj = getReduxErrors(responseJson);
          console.log(ErrObj);
          const e =
            _.isObject(ErrObj) && _.isString(ErrObj.errors)
              ? ErrObj.errors
              : "";
          dispatch(stopSubmit("sOtp_Form", { OtpCode: e }));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          stopSubmit("login_Form", {
            _error: trans("network_error_msg"),
          })
        );
      });
  };

  storeData = async (tokenData) => {
    try {
      await AsyncStorage.multiSet(
        [
          ["login", "true"],
          ["token", tokenData],
        ],
        (err) => {
          console.log(err);
        }
      ).then((r) => {
        console.log(r);
      });
    } catch (error) {
      // Error saving data
    }
  };

  setUser = (data, email, code, cName, cImg) => {
    if (_.isObject(data)) {
      let newData = (data.email = email);
      newData = data.code = code;
      newData = data.countryName = cName;
      newData = data.countryImg = cImg;
      console.log(newData);
      return newData;
    }
  };

  setUserOtherData = async (data, email, code, cName, cImg) => {
    console.log(cImg);
    const {
      authActions: { setUserOtherData },
    } = this.props;
    this.setUser(data, email, code, cName, cImg);
    const detail = JSON.stringify(data);
    setUserOtherData(detail);
    try {
      await AsyncStorage.multiSet(
        [
          ["userOtherData", "true"],
          ["userOtherData", detail],
        ],
        (err) => {
          console.log(err);
        }
      ).then((r) => {
        console.log(r);
      });
    } catch (error) {
      console.log(error);
    }
  };

  resendOtp = () => {
    const {
      form: { sName_Form, sEmail_Form, sPwd_Form, login_Form },
      dispatch,
    } = this.props;

    console.log(sName_Form);
    console.log(sEmail_Form);
    console.log(sPwd_Form);
    console.log(login_Form);
    // const userName = _.isObject(sName_Form) && _.isObject(sName_Form.values)
    // && _.isString(sName_Form.values.username) ? sName_Form.values.username : '';
    const userEmail =
      _.isObject(sEmail_Form) &&
      _.isObject(sEmail_Form.values) &&
      _.isString(sEmail_Form.values.userEmail)
        ? sEmail_Form.values.userEmail
        : "";
    // const userPwd = _.isObject(sPwd_Form) && _.isObject(sPwd_Form.values)
    // && _.isString(sPwd_Form.values.userPwd) ? sPwd_Form.values.userPwd : '';

    const LoginEmail =
      _.isObject(login_Form) &&
      _.isObject(login_Form.values) &&
      _.isString(login_Form.values.username)
        ? login_Form.values.username
        : "";

    const validEmail =
      _.isString(userEmail) && userEmail !== "" ? userEmail : LoginEmail;

    // const data = {
    //   'SignupForm[username]': userName,
    //   'SignupForm[email]': userEmail,
    //   'SignupForm[password]': userPwd,
    // };

    const data = {
      "ResendOTPForm[username]": validEmail,
    };
    dispatch(startSubmit("sOtp_Form"));
    this.setState({ loading: true }, () => {
      getApiDataProgress(settings.endpoints.resend_otp, "post", data, {}, null)
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            dispatch(reset("sOtp_Form"));
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ loading: false });
        });
    });
  };

  backToLogin = () => {
    const { dispatch } = this.props;
    dispatch(reset("login_Form"));
    dispatch(reset("sPwd_Form"));
    setTimeout(() => {
      this.goto("Login");
    }, 50);
  };

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText={false}
          showRightText={false}
          showBottomBorder={false}
          onBackAction={() => {
            this.backToLogin();
          }}
        />
        <OtpForm
          // {...this.props}
          onSubmit={this.handleSubmit}
          onResendOtp={() => {
            this.resendOtp();
          }}
          loading={loading}
        />
      </View>
    );
  }
}

SigninOtp.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.func),
  // auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  form: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
};

SigninOtp.defaultProps = {
  authActions: {},
  // auth: {},
  navigation: {},
  form: {},
  dispatch: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(SigninOtp);
