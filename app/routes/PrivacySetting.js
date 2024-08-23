/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-multi-assign */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Share,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import _ from "lodash";
import { change } from "redux-form";
import firebase from "react-native-firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { Client } from "bugsnag-react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MIcon from "react-native-vector-icons/MaterialIcons";
import OIcon from "react-native-vector-icons/Octicons";
import CHeader from "../components/CHeader";
import common from "../config/genStyle";
import colors from "../config/styles";
import { Icon } from "../config/icons";
import CTermsCondition from "../components/CTermsCondition";
import CPrivacyModal from "../components/CPrivacyModal";
import CHelp from "../components/CHelp";
import { CAlert, EAlert } from "../components/CAlert";
import authActions from "../redux/reducers/auth/actions";
import videoActions from "../redux/reducers/video/actions";
import { getApiDataProgress, getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import CLoader from "../components/CLoader";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

const bugsnag = new Client(settings.bugsnagKey);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    position: "relative",
    paddingBottom: 500,
  },
  settingwrap: {
    paddingVertical: RFValue(15),
    borderBottomWidth: 1,
    borderBottomColor: "#8e8e93",
  },
  settingsty: {
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(8),
    flexDirection: "row",
    alignItems: "center",
  },
  BottomViewSty: {
    position: "absolute",
    bottom: RFValue(5),
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    marginTop: 20,
  },
});

class PrivacySetting extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      switch1Value: false,
      loading: true,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.setState({ loading: true });
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );
  };

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    const {
      auth: { userOtherData },
    } = this.props;
    // console.log(userOtherData);
    setLeaveBreadcrumb(payload);
    if (
      _.isObject(userOtherData) &&
      !_.isEmpty(userOtherData) &&
      userOtherData.notification_status === "1"
    ) {
      this.setState({ switch1Value: true, loading: false });
    } else {
      this.setState({ switch1Value: false, loading: false });
    }
    // let data;
    // try {
    //   if (_.isObject(userOtherData) && !_.isEmpty(userOtherData)) {
    //     data = JSON.parse(userOtherData);
    //   } else {
    //     data = JSON.parse(userOtherData);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

    // setTimeout(() => {
    //   if (_.isObject(data) && data.notification_status === '1') {
    //     this.setState({ switch1Value: true, loading: false });
    //   } else {
    //     this.setState({ switch1Value: false, loading: false });
    //   }
    // }, 500);
  };

  toggleSwitch1 = (value) => {
    console.log(value);
    // console.log(value);
    this.setState(
      {
        switch1Value: value,
      },
      () => {
        this.notificationStatus();
      }
    );
  };

  notificationStatus = () => {
    const {
      auth: { token },
      authActions: { trans },
    } = this.props;
    const { switch1Value } = this.state;
    let val;
    if (switch1Value === true) {
      val = 1;
    } else {
      val = 0;
    }
    console.log(token);
    getApiDataProgress(
      `${settings.endpoints.set_notification_status}?notification_status=${val}`,
      "get",
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      null
    )
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          if (_.isObject(responseJson.data) && !_.isEmpty(responseJson.data)) {
            console.log(responseJson.data);
            this.setUserOtherData(responseJson.data);
          }
          // CAlert(responseJson.message, 'Success', () => {
          // this.goto('Profile');
          // });
        } else {
          EAlert(responseJson.message, trans("error_msg_title"));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  logoutAction = (type) => {
    const {
      auth: { token, uuid, userId },
      authActions: {
        setToken,
        setUserOtherData,
        setUserId,
        setUserData,
        setUUid,
        setBadge,
        setCountry,
        trans,
        setForceLoad,
      },
      videoActions: { setUploadVideoData },
      dispatch,
      navigation,
    } = this.props;

    const data = type === "delete_account" ? {} : { uuid };

    console.log(data);
    const url =
      type === "delete_account"
        ? settings.endpoints.deleteAccount
        : settings.endpoints.logout;

    const method = type === "delete_account" ? "POST" : "get";

    getApiData(url, method, data, {
      Authorization: `Bearer ${token}`,
    })
      .then((responseJson) => {
        if (responseJson.success === true) {
          // remove user data in bugsnag..
          bugsnag.clearUser();

          console.log("Logout");
          firebase
            .analytics()
            .logEvent("user_logout", { message: "User logging out!", userId });
          setToken("");
          setUserOtherData("");
          setUserId("");
          setUserData("");
          setUploadVideoData("");
          setUUid("");
          setCountry({});
          setBadge(0);
          setForceLoad();
          dispatch(change("sPaypal_Form", "paypalEmail", ""));
          navigation.navigate("Home");
        } else {
          console.log("responseJson.success === false");
          EAlert(responseJson.message, trans("error_msg_title"));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  logoutProcess = async (type) => {
    const {
      authActions: {
        setToken,
        setUserOtherData,
        setUserId,
        setUserData,
        setBadge,
        setScreen,
        setTop100PlayIndex,
        setHomePlayIndex,
      },
      videoActions: { setUploadVideoData },
      navigation,
    } = this.props;

    try {
      await AsyncStorage.multiRemove(
        [
          "login",
          "token",
          "userOtherData",
          "countryData",
          "uId",
          "languageData",
        ],
        (err) => {
          if (err) {
            console.log(err);
            this.logoutAction(type);
          }
        }
      ).then((r) => {
        console.log(r);
        this.logoutAction(type);
      });
    } catch (error) {
      console.log(error);
    }
    setToken("");
    setUserOtherData("");
    setUserId("");
    setUserData("");
    setUploadVideoData("");
    // setUUid('');
    setBadge(0);
    // navigation.push('Home', { load: true });
    navigation.navigate("Home");
  };

  // deleteAccountApi = () => {
  //   const {
  //     auth: { token },
  //     authActions: { trans },
  //   } = this.props;
  //   console.log(token);
  //   getApiData(
  //     settings.endpoints.deleteAccount,
  //     'POST',
  //     {},
  //     {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   )
  //     .then((responseJson) => {
  //       console.log('PrivacySetting -> .then -> responseJson', responseJson);
  //       if (responseJson.success === true) {
  //         this.logoutProcess('delete_Account');
  //       } else {
  //         console.log('responseJson.success === false');
  //         EAlert(responseJson.message, trans('error_msg_title'));
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  setUser = (data, cData) => {
    if (_.isObject(data)) {
      // eslint-disable-next-line camelcase
      const { country_code, country_img, country_name } = cData;
      let newData = (data.code = country_code);
      newData = data.countryName = country_name;
      newData = data.countryImg = country_img;
      return newData;
    }
  };

  setUserOtherData = async (data) => {
    const {
      authActions: { setUserOtherData },
    } = this.props;
    this.setUser(data.other_info, data.country_data);
    let detail = {};
    setUserOtherData(data.other_info);
    detail = JSON.stringify(data.other_info);

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

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  openPrivacyModal = () => {
    if (this.CPrivacyModal) {
      this.CPrivacyModal.openModal();
    }
  };

  openTermConditionModal = () => {
    if (this.CTermsCondition) {
      this.CTermsCondition.openModal();
    }
  };

  openHelpcentreModal = () => {
    if (this.CHelp) {
      this.CHelp.openModal();
    }
  };

  render() {
    const { switch1Value, loading } = this.state;
    const {
      auth: { userData, editData },
      authActions: { trans },
      navigation,
    } = this.props;
    // console.log(this.props);
    // console.log(editData);
    const isEdit = !(_.isObject(editData) && editData.is_social === true);
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans("PrivacySetting_page_title")}
          onBackAction={() => {
            navigation.goBack();
          }}
        />
        {loading ? (
          <CLoader />
        ) : (
          <View style={{ paddingHorizontal: RFValue(20) }}>
            <View style={styles.settingwrap}>
              <Text style={[common.textH4, { color: "#0008" }]}>
                {trans("PrivacySetting_account_category_title")}
              </Text>
              {isEdit ? (
                <View style={styles.settingsty}>
                  <Icon
                    name="Padlock"
                    size={RFValue(15)}
                    style={[common.MR10, { color: "#0008" }]}
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.goto("ChangePwd");
                    }}
                    style={{ flex: 1, zIndex: 10 }}
                  >
                    <Text style={[common.textH4, { color: "#404040" }]}>
                      {trans("PrivacySetting_subtitle_1")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={styles.settingsty}>
                <Icon
                  name="Sharing-share"
                  size={RFValue(15)}
                  style={[common.MR10, { color: "#0008" }]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    Share.share({
                      title: "MTD",
                      message: userData.share_link ? userData.share_link : "",
                      // url: '',
                    });
                  }}
                  style={{ flex: 1, zIndex: 10 }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_subtitle_2")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingsty}>
                <MIcon
                  name="block"
                  size={RFValue(15)}
                  style={[common.MR10, { color: "#0008" }]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.goto("BlockedUser");
                  }}
                  style={{ flex: 1, zIndex: 10 }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_manage_block_users_title")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingwrap}>
              <Text style={[common.textH4, { color: "#0008" }]}>
                {trans("PrivacySetting_general_category_title")}
              </Text>
              <View style={[styles.settingsty, { justifyContent: "center" }]}>
                <Icon
                  name="Notification"
                  size={RFValue(15)}
                  style={[common.MR10, { color: "#0008" }]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 10,
                  }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_subtitle_3")}
                  </Text>
                  <Switch
                    value={switch1Value}
                    onTintColor={colors.brandAppBackColor}
                    thumbColor={
                      Platform.OS === "ios" ? "#FFF" : colors.brandAppBackColor
                    }
                    ios_backgroundColor="#D3D3D3"
                    onValueChange={this.toggleSwitch1}
                  />
                  {/* <Switch
                      onValueChange={this.toggleSwitch1}
                      value={switch1Value}
                      thumbColor={colors.brandAppBackColor}
                      onTintColor={colors.brandAppBackColor}
                      // thumbTintColor={colors.brandAppBackColor}
                      // onTintColor={colors.brandAppBackColor}
                    /> */}
                </TouchableOpacity>
              </View>
              <View style={styles.settingsty}>
                <Icon
                  name="File"
                  size={RFValue(15)}
                  style={[common.MR10, { color: "#0008" }]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.goto("Language");
                  }}
                  style={{ flex: 1, zIndex: 10 }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_subtitle_4")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingsty}>
                <OIcon
                  name="device-mobile"
                  size={RFValue(15)}
                  style={[
                    common.MR10,
                    {
                      color: "#0008",
                      marginLeft: RFValue(2),
                      marginRight: RFValue(12),
                    },
                  ]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.goto("ContactUs");
                  }}
                  style={{ flex: 1, zIndex: 10 }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_contactus")}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View style={styles.settingsty}>
                  <MIcon name="earth" size={18} style={[common.MR10, { color: '#0008' }]} />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { this.goto('Country'); }}
                    style={{ flex: 1, zIndex: 10 }}
                  >
                    <Text
                      style={[
                        common.textH4,
                        { color: '#404040' },
                      ]}
                    >
                      Country
                    </Text>
                  </TouchableOpacity>
                </View> */}
            </View>
            <View style={styles.settingwrap}>
              <Text style={[common.textH4, { color: "#0008" }]}>
                {trans("PrivacySetting_about_category_title")}
              </Text>
              <View style={styles.settingsty}>
                <Icon
                  name="Question"
                  size={RFValue(15)}
                  style={[common.MR10, { color: "#0008" }]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => {
                  //   this.setState({
                  //     privacyModalVisible: false,
                  //     termsModalVisible: false,
                  //     openHelpModal: true,
                  //   });
                  // }}
                  onPress={this.openHelpcentreModal}
                  style={{ flex: 1, zIndex: 10 }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_subtitle_5")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingsty}>
                <Icon
                  name="Term"
                  size={RFValue(15)}
                  style={[common.MR10, { color: "#0008" }]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => {
                  //   this.setState({
                  //     termsModalVisible: true,
                  //     privacyModalVisible: false,
                  //   });
                  // }}
                  onPress={this.openTermConditionModal}
                  style={{ flex: 1, zIndex: 10 }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_subtitle_6")}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingsty}>
                <Icon
                  name="File"
                  size={RFValue(15)}
                  style={[common.MR10, { color: "#0008" }]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => {
                  //   this.setState({
                  //     privacyModalVisible: true,
                  //     termsModalVisible: false,
                  //   });
                  // }}
                  onPress={this.openPrivacyModal}
                  style={{ flex: 1, zIndex: 10 }}
                >
                  <Text style={[common.textH4, { color: "#404040" }]}>
                    {trans("PrivacySetting_subtitle_7")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.settingsty,
                common.PT20,
                // styles.settingwrap
              ]}
            >
              <Icon
                name="Logout"
                size={RFValue(15)}
                style={[common.MR10, { color: "#0008" }]}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  CAlert(
                    "Are you sure you want to exit?",
                    "Confirm",
                    () => {
                      this.logoutProcess("logout");
                    },
                    () => {}
                  );
                }}
                style={{ flex: 1, zIndex: 10 }}
              >
                <Text style={[common.textH4, { color: "#404040" }]}>
                  {trans("PrivacySetting_subtitle_8")}
                </Text>
              </TouchableOpacity>
            </View>
            {/* {Platform.OS === 'ios' ? ( */}
            {/* <View
              style={[
                styles.settingsty,
                common.PT20,
                { paddingVertical: RFValue(15) },
              ]}
            >
              <AntDesign
                name="delete"
                size={RFValue(15)}
                color="red"
                style={[common.MR10, { color: 'red' }]}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  CAlert(
                    'Are you sure you want to Delete this account?',
                    'Confirm',
                    () => {
                      // this.deleteAccountApi();
                      this.logoutProcess('delete_account');
                    },
                    () => {},
                  );
                }}
                style={{ flex: 1, zIndex: 10 }}
              >
                <Text style={[common.textH4, { color: 'red' }]}>
                  {trans('PrivacySetting_subtitle_9')}
                </Text>
              </TouchableOpacity>
            </View> */}
            {/* ) : null} */}
            {/* <View style={styles.settingsty}>
            <Text style={[common.textH4, { color: '#404040' }]}>{trans('PrivacySetting_version_text')}</Text>
                <Text style={[common.textH4, { color: '#404040' }]}>{packageJson.version}</Text>
              </View> */}
          </View>
        )}
        <CPrivacyModal
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CPrivacyModal = o.getWrappedInstance();
            } else {
              this.CPrivacyModal = o;
            }
          }}
        />

        <CTermsCondition
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CTermsCondition = o.getWrappedInstance();
            } else {
              this.CTermsCondition = o;
            }
          }}
        />

        <CHelp
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CHelp = o.getWrappedInstance();
            } else {
              this.CHelp = o;
            }
          }}
        />

        <View style={styles.BottomViewSty}>
          <View
            style={[
              styles.settingsty,
              { justifyContent: "center", alignItems: "flex-end" },
            ]}
          >
            <Text style={[common.textH4, { color: "#404040" }]}>
              {trans("PrivacySetting_version_text")}
            </Text>
            <Text style={[common.textH4, { color: "#404040" }]}>0.0.8</Text>
          </View>

          <View
            style={[
              styles.settingsty,
              { justifyContent: "center", alignItems: "flex-end" },
            ]}
          >
            <Text style={[common.textH4, { color: "#404040" }]}>
              Build Version
            </Text>
            <Text style={[common.textH4, { color: "#404040" }]}> 17</Text>
          </View>
        </View>
      </View>
    );
  }
}

PrivacySetting.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.func),
  videoActions: PropTypes.objectOf(PropTypes.func),
  navigation: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
};

PrivacySetting.defaultProps = {
  authActions: {},
  videoActions: {},
  navigation: {},
  auth: {},
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
    videoActions: bindActionCreators(videoActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivacySetting);
