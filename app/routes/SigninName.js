/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Keyboard, Alert } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { stopSubmit, startSubmit, reset } from "redux-form";
import CHeader from "../components/CHeader";
import authActions from "../redux/reducers/auth/actions";
import SignNameForm from "../reduxForm/SignNameForm";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import { CAlert, getReduxErrors } from "../components/CAlert";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";
import Screen1 from "./IntroScreen/Screen1";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

class SigninName extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageLoad: false,
      answer1: "",
      answer2: "",
      valid: false,
    };
    this.signup = null;
  }

  componentDidMount() {
    const { navigation, auth } = this.props;
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
    setLeaveBreadcrumb(payload);
  };

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  BackToHome = () => {
    const { navigation, dispatch } = this.props;
    if (this.state.answer2 === "Yes") {
      this.signup.doSlide();
    } else {
      navigation.goBack();
      dispatch(reset("sName_Form"));
      dispatch(reset("sEmail_Form"));
    }
  };

  handleSubmit = (values) => {
    Keyboard.dismiss();
    this.submitName(values);
  };

  submitName = (values) => {
    const {
      dispatch,
      authActions: { trans },
    } = this.props;
    const data = {
      username:
        _.isObject(values) && _.isString(values.username)
          ? values.username
          : "",
    };
    dispatch(startSubmit("sName_Form"));
    this.setState({ pageLoad: true }, () => {
      getApiDataProgress(
        settings.endpoints.validate_data,
        "post",
        data,
        {},
        null
      )
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            this.setState({ pageLoad: false }, () => {
              this.goto("SigninEmail");
            });
          } else {
            const ErrObj = getReduxErrors(responseJson);
            console.log(ErrObj);
            const e =
              _.isObject(ErrObj) && _.isString(ErrObj.errors)
                ? ErrObj.errors
                : "";
            dispatch(stopSubmit("sName_Form", { username: e }));
            this.setState({ pageLoad: false });
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(
            stopSubmit("sName_Form", {
              _error: trans("network_error_msg"),
            })
          );
          this.setState({ pageLoad: false });
        });
    });
  };

  question = (val) => {
    const { auth } = this.props;
    if (val === "Yes") {
      this.setState({
        answer1: "Yes",
      });
      auth.signup_answer.answer1 = "Yes";
    } else if (val === "No") {
      this.setState({
        answer1: "No",
      });
      auth.signup_answer.answer1 = "No";
    } else if (val === "que2Yes") {
      this.setState({
        answer2: "Yes",
      });
      auth.signup_answer.answer2 = "Yes";
    } else {
      this.setState({
        answer2: "No",
      });
      auth.signup_answer.answer2 = "No";
    }
  };

  render() {
    const { pageLoad, answer1, answer2 } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        {/* {navigation?.state?.params?.data?.type === "google" ||
        navigation?.state?.params?.data?.type === "facebook" ? null : ( */}
        <CHeader
          showBackArrow={
            navigation?.state?.params?.data?.type === "google" ||
            navigation?.state?.params?.data?.type === "facebook"
              ? false
              : true
          }
          showCenterText={false}
          showRightText={false}
          showBottomBorder={false}
          onBackAction={() => {
            this.BackToHome();
          }}
        />
        {/* )} */}
        <Screen1
          {...this.props}
          ref={(o) => (this.signup = o)}
          onSubmit={this.handleSubmit}
          loading={pageLoad}
          question1={this.question}
          answer1={answer1}
          answer2={answer2}
        />
      </View>
    );
  }
}

SigninName.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

SigninName.defaultProps = {
  authActions: {},
  auth: {},
  navigation: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SigninName);
