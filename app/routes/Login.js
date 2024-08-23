/* eslint-disable no-useless-escape */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Keyboard, AsyncStorage } from "react-native";
import _ from "lodash";
import { Client } from "bugsnag-react-native";
import { stopSubmit, startSubmit, reset } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CHeader from "../components/CHeader";
import { getReduxErrors } from "../components/CAlert";
import authActions from "../redux/reducers/auth/actions";
import homeActions from "../redux/reducers/home/actions";
import LForm from "../reduxForm/LoginForm";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

const bugsnag = new Client(settings.bugsnagKey);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

class Login extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
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
    setLeaveBreadcrumb(payload);
  };

  goto = (page) => {
    const {
      navigation,
      authActions: { setScreen, setTop100PlayIndex, setHomePlayIndex },
    } = this.props;
    if (page === "Home") {
      navigation.navigate("Home");
      // Use should manually play videos on focus back
      // playVideos(true);
      // navigation.navigate("Home", {
      //   load: true,
      // });
    } else {
      navigation.navigate(page);
    }
  };

  handleSubmit = (values) => {
    Keyboard.dismiss();
    this.submitLoginForm(values);
  };

  submitLoginForm = (values) => {
    const {
      authActions: { setToken, setCountry },
      navigation,
      dispatch,
    } = this.props;
    const data = {
      "LoginForm[username]":
        _.isObject(values) && _.isString(values.username)
          ? values.username
          : "",
      "LoginForm[password]":
        _.isObject(values) && _.isString(values.password)
          ? values.password
          : "",
    };
    dispatch(startSubmit("login_Form"));
    getApiDataProgress(settings.endpoints.Login, "post", data, {}, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          if (_.isObject(responseJson.data)) {
            if (responseJson.data.on_verification === 1) {
              this.goto("SigninOtp");
              setTimeout(() => {
                dispatch(reset("login_Form"));
              }, 100);
            } else if (
              responseJson.data.on_verification === 0 &&
              _.isString(responseJson.data.access_token) &&
              responseJson.data.access_token !== ""
            ) {
              const { country_code, country_name, country_img } =
                responseJson.data.country_data;
              setToken(responseJson.data.access_token);
              this.storeData(responseJson.data.access_token);
              this.storeId(_.toString(responseJson.data.id));

              this.setUserOtherData(
                responseJson.data.other_info,
                responseJson.data.email,
                country_code,
                country_name,
                country_img
              );
              // this.setUserOtherData(responseJson.data.other_info, responseJson.data.email);
              setCountry(country_code);
              this.goto("Home");
              // navigation.popToTop();
              setTimeout(() => {
                dispatch(reset("login_Form"));
              }, 100);
            }
          } else {
            console.log("responseJson.data is not an object");
          }
        } else {
          const errors = getReduxErrors(responseJson);
          dispatch(stopSubmit("login_Form", errors));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          stopSubmit("login_Form", {
            _error: "Network Error",
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

  storeId = async (id) => {
    const {
      authActions: { setUserId },
    } = this.props;
    setUserId(id);
    try {
      await AsyncStorage.multiSet(
        [
          ["uId", "true"],
          ["uId", id],
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
    let detail = {};
    // setTimeout(() => {
    setUserOtherData(data);
    detail = JSON.stringify(data);
    // }, 1000);
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

  BackToHome = () => {
    const { navigation } = this.props;
    console.log("Back to Home =======================>");
    // this.goto('Home');
    navigation.popToTop();
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

        <LForm {...this.props} onSubmit={this.handleSubmit} />
      </View>
    );
  }
}

Login.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.func),
  navigation: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.func),
  playVideos: PropTypes.objectOf(PropTypes.func),
  // auth: PropTypes.objectOf(PropTypes.any),
};

Login.defaultProps = {
  authActions: {},
  navigation: {},
  dispatch: () => null,
  playVideos: () => null,
  // auth: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  const { playVideos } = homeActions;
  return {
    authActions: bindActionCreators(authActions, dispatch),
    playVideos: bindActionCreators(playVideos, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
