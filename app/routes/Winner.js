/* eslint-disable quotes */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
// import liraries
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Linking,
  NetInfo,
  StyleSheet,
  AsyncStorage,
  BackHandler,
  AppState,
  Image,
  TouchableOpacity,
  // RefreshControl,
  // FlatList,
  Platform,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import _, { isEmpty, map } from "lodash";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from "react-native-google-signin";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DeviceInfo from "react-native-device-info";
import I18n from "react-native-i18n";
import { Client } from "bugsnag-react-native";
import { withInAppNotification } from "../libs/react-native-in-app-notification/src/index";
import CVideo from "../components/CVideo";
import colors from "../config/styles";
import { Icon } from "../config/icons";
import common from "../config/genStyle";
import CLogin from "../components/CLogin";
import TopBar from "../components/Home/TopBar";
import authActions from "../redux/reducers/auth/actions";
import homeActions from "../redux/reducers/home/actions";
import socketActions from "../redux/reducers/socket/actions";
// import getCmsData from '../redux/utils/getCmsData';
import { getApiDataProgress, getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import { CAlert, EAlert } from "../components/CAlert";
import CVideoTab from "../components/CVideoTab";
// import CButton from '../components/CButton';
import CPrivacyModal from "../components/CPrivacyModal";
import CTermsCondition from "../components/CTermsCondition";
import { Label, TabIcon } from "../components/Navigation";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";
import CSponsorAd from "../components/CSponsorAd";
import CInterstitialAd from "../components/CInterstitialAd";

const bugsnag = new Client(settings.bugsnagKey);
const logo = require("../images/mtdlogo.png");

GoogleSignin.configure({
  iosClientId: settings.iosClientId, // only for iOS
  webClientId: settings.webClientId,
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: "", // specifies a hosted domain restriction
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
  accountName: "", // [Android] specifies an account name on the device that should be used
});

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  tempSty: {
    flexGrow: 1,
  },
  BottomTabViewSty: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0000",
    flexDirection: "row",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderTopColor: "#8e8e93",
    paddingVertical: 5,
  },
  BottomTabView: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
  },
  TabIconSty: {
    fontSize: RFValue(18),
    color: "#FFF",
  },
  BottomTabTitle: {
    fontSize: RFValue(10),
    fontFamily: colors.fonts.proximaNova.semiBold,
    color: "#FFF",
    marginTop: RFValue(4),
  },
  addIconSty: {
    fontSize: RFValue(10),
    color: "#FFF",
  },
  AddViewSty: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(5),
    backgroundColor: colors.brandAppBackColor,
    width: "75%",
    paddingVertical: RFValue(5),
  },
  countryPickerStyle: {
    position: "absolute",
    right: 0,
    bottom: RFValue(50),
    zIndex: 10,
  },
});

// create a component
class Winner extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.videoList = [];
    this.cIndex = [];
    this.isMoreLoading = false;
    this.state = {
      appState: AppState.currentState,
      modalVisible: false,
      privacyModalVisible: false,
      termsModalVisible: false,
      setPrivacyData: "",
      setTermsanduseData: "",
      fbLoad: false,
      googleLoad: false,
      spinValue: new Animated.Value(0),
      flag: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png", // Default Flag image to display if no country set
      countryName: "US", // Default Country code to use if no country set
      displayInterstitialAd: true,
      showInterAd: false,
    };

    /* Video tabs reference */
    this.videoTabRefs = null;
    this.bufferedVideoIndexs = [];
    this.waitingNewToBuffer = false;

    /* Calculate device efficiency */
    this.maxVideosLoad = 2;

    /* Tricky get and set height to cvideo */
    this.mainHeight = 0;
  }

  async componentWillMount() {
    const {
      authActions: { onConnectionChange },
    } = this.props;
    AsyncStorage.multiGet(["fcmToken"], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const fcmToken = results[0][1];
        console.log(fcmToken);
        if (fcmToken !== null) {
          setTimeout(() => {
            this.handleFcmToken(fcmToken);
          }, 100);
        }
      }
    });
    NetInfo.isConnected.fetch().then((isConnected) => {
      onConnectionChange(isConnected);
    });
    // this.getData();
  }

  componentDidMount = () => {
    const {
      authActions: { onConnectionChange },
      navigation,
    } = this.props;

    // Linking.addEventListener('url', this.handleOpenURL);

    /* Handle Deep linking */
    Linking.getInitialURL()
      .then((url) => {
        this.handleOpenURL(url);
      })
      .catch((err) => {
        console.warn("Deeplinking error", err);
      });

    Linking.addListener("url", (e) => {
      this.handleOpenURL(e.url);
    });

    /* Handle App State change */
    AppState.addEventListener("change", this.handleAppStateChange);

    /* Handle Internet */
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      onConnectionChange
    );

    /* Handle Back button */
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

    /* Handle Navigation events */
    this.didFocusSubscription = navigation.addListener(
      "didFocus",
      this.onDidFocus
    );
    this.willBlurSubscription = navigation.addListener(
      "willBlur",
      this.onWillBlur
    );
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );

    /* Get initial data */
    this.userOtherData();
    this.getTabs();
    this.checkAuthorizedToken();

    /* Calculate max videos to buffer based on device ram */
    // this.maxVideosLoad
    const maxMemory = DeviceInfo.getMaxMemory();
    const maxinMB = this.bytesToSize(maxMemory);
    console.log(
      "Buffer debug: Max Memory :: => ",
      maxMemory,
      "Max in MB: ==> ",
      maxinMB
    );
    // this.maxVideosLoad = Math.round(maxinMB / 100);
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
    AppState.removeEventListener("change", this.handleAppStateChange);
    // Linking.removeEventListener('url', this.handleOpenURL);

    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }

    if (this.willBlurSubscription) {
      this.willBlurSubscription.remove();
    }

    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }

    if (this.onTokenRefreshListener) {
      this.onTokenRefreshListener();
    }

    if (this.notificationListener) {
      this.notificationListener();
    }

    if (this.messageListener) {
      this.messageListener();
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const {
      authActions: { setBadge },
      auth,
      currentTab,
    } = this.props;
    if (
      !_.isEqual(auth.notification, nextProps.auth.notification) &&
      !_.isEmpty(nextProps.auth.notification)
    ) {
      this.displayNotification(nextProps);
      if (
        !_.isEqual(
          auth.badge,
          _.toNumber(nextProps.auth.notification.data.badge)
        )
      ) {
        const badgeNo = _.toNumber(nextProps.auth.notification.data.badge);
        firebase.notifications().setBadge(badgeNo);
        setBadge(badgeNo > 0 ? badgeNo : 0);
      } else {
        const badgeNo = _.toNumber(nextProps.auth.notification.data.badge);
        firebase.notifications().setBadge(badgeNo);
      }
    }

    if (!_.isEqual(auth.connected, nextProps.auth.connected)) {
      this.handleConnectionChange(nextProps.auth.connected);
    }

    /* On Top tab change */
    if (!_.isEqual(currentTab, nextProps.currentTab)) {
      this.bufferedVideoIndexs = [];
    }
  };

  onWillFocus = (payload) => {
    const {
      setCurrentTabPage,
      auth: { adType },
      setCurrentVideoTab,
    } = this.props;
    // setTimeout(() => {
    setLeaveBreadcrumb(payload);
    setTimeout(() => {
      this.setState({ showInterAd: true });
    }, _.toInteger(adType.Intertial_timeOut));
    setCurrentVideoTab(2);

    // }, 1000);
    // if (!tabLoaded) {
    //   this.setState({
    //     tabLoaded: true,
    //   },
    //   () => {
    //     this.getTabs();
    //     this.checkAuthorizedToken();
    //   });
    // }
  };

  getData = async () => {
    let detail = {};
    try {
      const value = await AsyncStorage.getItem("languageData");
      if (value !== null && value !== "") {
        try {
          detail = JSON.parse(value);
          this.getLanguage(detail);
        } catch (error) {
          console.log(error);
        }
        console.log(detail);
      } else {
        this.getLanguage(detail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getLanguage = (detail) => {
    console.log(detail);

    let param = "";

    if (_.isObject(detail) && detail.language_id) {
      param = detail.language_id;
    } else {
      param = "en-US";
    }

    const data = {
      lang_id: param,
    };
    getApiData(settings.endpoints.getLanguage, "get", data, {})
      .then(async (response) => {
        if (response.success) {
          if (_.isObject(response.data)) {
            console.log(response.data);
            I18n.translations.en = response.data;
            await AsyncStorage.setItem(
              "transData",
              JSON.stringify(response.data)
            );
            // navigation.navigate('Home');
          }
        } else {
          // navigation.navigate('Home');
          console.log("language get data success false ====");
        }
      })
      .catch((err) => {
        // navigation.navigate('Home');
        console.log(err);
      });
  };

  handleAppStateChange = async (nextAppState) => {
    const {
      authActions: { setBadge },
      playVideos,
    } = this.props;

    try {
      const value = await AsyncStorage.getItem("activeScreen");
      if (value !== null) {
        if (value === "Notification") {
          setBadge(0);
        } else if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App has come to the foreground!");
          this.setNotificationBadge();
        }
      }
    } catch (error) {
      console.log(error);
    }

    if (nextAppState !== "active") {
      this.stopCurrentvideo();
      playVideos(false);
    } else if (nextAppState === "active") {
      playVideos(true);
    }

    // this.setState({ appState: nextAppState });
  };

  handleConnectionChange = (isConnected) => {
    const {
      navigation,
      playVideos,
      playVideos2,
      auth: { screen },
    } = this.props;

    if (!isConnected) {
      console.log("Go to Offline screen =======>");
      playVideos(false);
      navigation.navigate("OfflineScreen");
    } else if (isConnected) {
      console.log("Back to home screen =======>");
      navigation.pop();
    }
  };

  handleFcmToken = async (token) => {
    if (_.isString(token)) {
      try {
        await AsyncStorage.setItem("fcmToken", token);
        this.sendFcmToken(token);
      } catch (error) {
        console.log(error);
      }
    }
  };

  getFCMToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      this.sendFcmToken(fcmToken);
      // user has a device token
    }
    this.setFCMListeners();
  };

  setWinningPrice = (prices) => {
    /* This function updates Winning price */
    const { setTabData } = this.props;
    console.log("setwin price ==> ", prices);
    setTabData(prices);
  };

  getTabs = (id) => {
    const {
      auth: { token },
      authActions: { setToken },
      setTabData,
    } = this.props;

    let setUrl = "";

    if (token !== "" && token !== null && token !== undefined) {
      setUrl = settings.endpoints.live_wining_prices_after_login;
    } else {
      setUrl = settings.endpoints.live_wining_prices;
    }

    const headers = {
      authorization: `Bearer ${token}`,
    };

    getApiDataProgress(setUrl, "get", {}, headers)
      .then((response) => {
        if (response.success) {
          if (_.isArray(response.data)) {
            setTabData(response.data);
          }
          this.setId();
        } else if (
          _.isObject(response) &&
          _.isObject(response.data) &&
          _.isString(response.data.name) &&
          response.data.name === "Unauthorized" &&
          response.status === 401
        ) {
          setToken("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setId = async () => {
    const {
      authActions: { setUserId },
    } = this.props;
    try {
      const value = await AsyncStorage.getItem("uId");
      if (value !== null && value !== "") {
        setUserId(value);
      } else {
        console.log("id already set or not set yet.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  setNotificationBadge = () => {
    const {
      authActions: { setBadge },
      auth: { token },
    } = this.props;

    if (_.isString(token) && token !== "" && token !== null) {
      getApiData(settings.endpoints.badge_count, "get", null, {
        authorization: `Bearer ${token}`,
      })
        .then((responseJson) => {
          if (responseJson.success === true) {
            if (
              _.isObject(responseJson.data) &&
              _.isString(responseJson.data.badge)
            ) {
              const badgeNo = _.toNumber(responseJson.data.badge);
              firebase.notifications().setBadge(badgeNo);
              setBadge(badgeNo > 0 ? badgeNo : 0);
            } else {
              console.log("Data is not Objcet or badge count is not string.");
            }
          } else {
            console.log("ResponseJson False");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  userOtherData = async () => {
    console.log("in user other data =====>>>");
    const {
      authActions: { setUserOtherData },
    } = this.props;
    try {
      const value = await AsyncStorage.getItem("userOtherData");
      console.log(value);
      if (value !== null && value !== "" && value !== true) {
        let data;
        try {
          if (!_.isEmpty(value)) {
            data = JSON.parse(value);
          } else {
            data = JSON.parse(value);
          }
        } catch (error) {
          console.log(error);
        }
        setUserOtherData(data);
      } else {
        console.log("userOtherData already set or not set yet.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  configFCM = async () => {
    const enabled = await firebase.messaging().hasPermission();
    try {
      if (!enabled) {
        await firebase.messaging().requestPermission();
      }
      this.getFCMToken();
    } catch (error) {
      console.log(error);
    }
  };

  sendFcmToken = (fcmToken) => {
    const {
      auth: { token },
      authActions: { setUUid },
    } = this.props;

    const data = {
      "UserToken[uuid]": fcmToken,
      "UserToken[platform]": Platform.OS === "android" ? "Android" : "Ios",
    };

    getApiDataProgress(
      settings.endpoints.add_token,
      "post",
      data,
      {
        Authorization: `Bearer ${token}`,
      },
      null
    )
      .then((responseJson) => {
        if (responseJson.success === true) {
          setUUid(fcmToken);
        } else {
          console.log("responseJson.success === false");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setFCMListeners = async () => {
    const {
      authActions: { onNewNotification },
    } = this.props;
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();

    if (notificationOpen) {
      const { action, notification } = notificationOpen;
      console.log(action);
      console.log(notification);
      const { data } = notification;
      if (_.isObject(data) && !_.isEmpty(data)) {
        notification.isInitial = true;
        if (data.type === "view_winner" && data.video_id !== "") {
          this.handleDeepLink("VideoList", { video_id: data.video_id });
        } else {
          this.handleDeepLink("Notification", {});
        }
      } else {
        // onNewNotification(notification);
      }
    }

    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh((fcmToken) => {
        if (fcmToken) {
          this.sendFcmToken(fcmToken);
        }
      });
    this.messageListener = firebase.messaging().onMessage((message) => {
      // Process your message as required
      console.log(message);
    });
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        // Process your notification as required
        console.log(notification);
        onNewNotification(notification);
      });
    /* eslint-disable max-len */
    /* eslint-disable no-shadow */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        // Get the action triggered by the notification being opened
        /* eslint-disable prefer-destructuring */
        const action = notificationOpen.action;
        console.log(action);
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        console.log(notification.data);
        if (_.isObject(notification.data) && !_.isEmpty(notification.data)) {
          this.handleDeepLink("Notification", {});
        }
        /* eslint-disable prefer-destructuring */
      });
  };

  // eslint-disable-next-line no-unused-vars
  onDidFocus = (payload) => {
    const {
      playVideos,
      isTop100Focused,
      authActions: { setScreen },
    } = this.props;
    playVideos(true);
    isTop100Focused(true, true);
    this.updateFollowstatus();
    setTimeout(() => {
      this.setNotificationBadge();
      this.checkAuthorizedToken();
      // Use should manually play videos on focus back
      if (this.videoList) {
        /* Scroll again */
        if (this.videoTabRefs) {
          this.videoTabRefs.setScrollPosition();
        }
      }
    }, 50);
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {
    const { isHomeFocused, isTop100Focused } = this.props;
    this.stopCurrentvideo();
    isTop100Focused(false, false);
  };

  updateFollowstatus = async () => {
    const { currentTab, tabPageIds } = this.props;
    try {
      //! FIX - This code to update follow Button status After Follow/Unfollow from Profile
      const videNow = this.videoList[currentTab][tabPageIds[currentTab - 1]];
      if (videNow) {
        await videNow.getProfileData();
        setTimeout(() => {
          _.map(this.videoList[currentTab], (v, k) => {
            if (videNow?.props?.data?.user_id === v?.props?.data?.user_id) {
              this.videoList[currentTab][k].updateButtonName(
                videNow.state.buttonName
              );
            }
          });
        }, 50);
      }
    } catch (error) {
      console.log("ERROR in Updating Follow status", error);
    }
  };

  handleBackPress = async () => {
    const { navigation } = this.props;
    try {
      const value = await AsyncStorage.getItem("activeScreen");
      if (value !== null) {
        if (value === "Home") {
          BackHandler.exitApp();
        } else if (value === "OfflineScreen") {
          return null;
        }
        navigation.goBack(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeepLink = (page, data) => {
    const {
      auth: { screen },
      navigation,
    } = this.props;
    if (page === "Notification" && screen !== "Notification") {
      navigation.navigate("Notification");
      // this.props.navigator.switchToTab({
      //   tabIndex: 2,
      // });
    }

    if (page === "VideoList" && screen !== "VideoList") {
      navigation.navigate(page, {
        data,
      });
    }
  };

  displayNotification = async (nextProps) => {
    const { showNotification } = this.props;
    console.log(nextProps.auth.notification.data);
    const notificationTitle =
      _.isObject(nextProps) &&
      _.isObject(nextProps.auth) &&
      _.isObject(nextProps.auth.notification) &&
      _.isObject(nextProps.auth.notification.data) &&
      _.isString(nextProps.auth.notification.data.title)
        ? nextProps.auth.notification.data.title
        : "";

    const notificationMessage =
      _.isObject(nextProps) &&
      _.isObject(nextProps.auth) &&
      _.isObject(nextProps.auth.notification) &&
      _.isObject(nextProps.auth.notification.data) &&
      _.isString(nextProps.auth.notification.data.message)
        ? nextProps.auth.notification.data.message
        : "";

    const notificationType =
      _.isObject(nextProps) &&
      _.isObject(nextProps.auth) &&
      _.isObject(nextProps.auth.notification) &&
      _.isObject(nextProps.auth.notification.data) &&
      _.isString(nextProps.auth.notification.data.type)
        ? nextProps.auth.notification.data.type
        : "";

    const notificationData =
      _.isObject(nextProps) &&
      _.isObject(nextProps.auth) &&
      _.isObject(nextProps.auth.notification) &&
      _.isObject(nextProps.auth.notification.data)
        ? nextProps.auth.notification.data
        : "";

    console.log(notificationType);
    console.log(notificationData);

    try {
      const CurrentScreen = await AsyncStorage.getItem("activeScreen");
      console.log(CurrentScreen);
      if (
        _.isString(CurrentScreen) &&
        CurrentScreen !== "" &&
        CurrentScreen !== "Notification"
      ) {
        showNotification({
          // eslint-disable-next-line global-require
          icon: require("../images/mtdlogo.png"),
          title: notificationTitle,
          message: notificationMessage,
          onPress: () => this.routeScreen(notificationType, notificationData),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  routeScreen = (sType, data) => {
    const {
      authActions: { setBadge, trans },
    } = this.props;
    setBadge(0);

    if (sType === "view_user") {
      this.goto("OtherUserProfile", data);
    } else if (sType === "view_video" || sType === "view_winner") {
      this.props.navigation.navigate("VideoList", {
        data,
      });
      // this.props.navigation.navigate('Winner');
    } else if (sType === "continue_publish") {
      let screenToDisplay = "MakePayment";
      if (
        _.lowerCase(trans("Free_Video_Posting")) === "yes" ||
        data.video_payment === "0"
      ) {
        screenToDisplay = "FreePostConfirmation";
      }
      this.props.navigation.navigate(screenToDisplay, {
        data: { video_id: data.video_id },
        type: "disclaimer",
      });
    } else {
      this.goto("Notification");
    }
  };

  handleOpenURL = (event) => {
    if (_.isNull(event)) return false;
    const route = event.replace(/.*?:\/\//g, "");

    if (route.includes("video/view?video_id")) {
      this.routeTo(route, "VideoList");
    } else if (route.includes("profile")) {
      this.routeTo(route, "OtherUserProfile");
    }
  };

  routeTo = (route, type) => {
    const {
      navigation,
      playVideos,
      auth: { screen },
    } = this.props;

    if (type === "VideoList") {
      const ary = route.split("=");
      const video_id =
        _.isArray(ary) && ary.length > 0 ? ary[ary.length - 1] : 0;
      const data = { video_id, retrieveData: this.retrieveData };
      this.stopCurrentvideo();
      playVideos(false);
      navigation.navigate("VideoList", {
        data,
      });
    } else if (type === "OtherUserProfile") {
      const ary = route.split("/");
      const user_id =
        _.isArray(ary) && ary.length > 0 ? ary[ary.length - 1] : "0";
      const data = { user_id };
      playVideos(false);
      navigation.navigate("OtherUserProfile", {
        data,
      });
    }
  };

  FbLoginProcess = () => {
    LoginManager.logOut();
    this.setState({ modalVisible: false }, () => {
      setTimeout(() => {
        this.setState({ fbLoad: true }, () => {
          LoginManager.logInWithPermissions(["public_profile", "email"])
            .then(
              (result1) => {
                if (result1.isCancelled) {
                  this.handleFacebookError(null);
                } else {
                  AccessToken.getCurrentAccessToken().then((data) => {
                    this.handleLogin("facebook", data);
                  });
                }
              },
              (error) => {
                console.log(error);
                this.handleFacebookError(error);
              }
            )
            .catch((err) => {
              console.log(err);
            });
        });
      }, 50);
    });
  };

  GoogleLogin = async () => {
    const {
      authActions: { trans },
    } = this.props;
    try {
      await GoogleSignin.hasPlayServices();
      const isSignedIn = await GoogleSignin.isSignedIn();
      let userInfo = {};
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      userInfo = await GoogleSignin.signIn();
      const tData = await GoogleSignin.getTokens();
      if (tData && tData.accessToken) {
        userInfo.accessToken = tData.accessToken;
      }
      this.setState({ googleLoad: true }, () => {
        this.handleLogin("google", userInfo);
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.setState({ googleLoad: false }, () => {
          // setTimeout(() => {
          this.setState({ modalVisible: true });
          // }, 50);
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.setState({ googleLoad: false }, () => {
          setTimeout(() => {
            CAlert(
              trans("Home_google_process_running_text"),
              trans("error_msg_title"),
              () => {
                // setTimeout(() => {
                this.setState({ modalVisible: true });
                // }, 50);
              }
            );
          }, 50);
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState({ googleLoad: false }, () => {
          setTimeout(() => {
            CAlert(
              trans("Home_play_service_not_available_text"),
              trans("error_msg_title"),
              () => {
                // setTimeout(() => {
                this.setState({ modalVisible: true });
                // }, 50);
              }
            );
          }, 50);
        });
      } else {
        this.setState({ googleLoad: false }, () => {
          setTimeout(() => {
            CAlert(
              trans("something_wrong_alert_msg"),
              trans("error_msg_title"),
              () => {
                setTimeout(() => {
                  this.setState({ modalVisible: true });
                }, 50);
              }
            );
          }, 50);
        });
        console.log(error);
      }
    }
  };

  setAfterLogin = (responseJson) => {
    const {
      authActions: { setToken, setCountry, setForceLoad },
      playVideos,
      currentTab,
    } = this.props;
    playVideos(false);
    if (
      _.isObject(responseJson.data) &&
      responseJson.data.on_verification === 0 &&
      _.isString(responseJson.data.access_token) &&
      responseJson.data.access_token !== ""
    ) {
      // eslint-disable-next-line camelcase
      const { country_code, country_name, country_img } =
        responseJson.data.country_data;
      setToken(responseJson.data.access_token);
      this.storeData(responseJson.data.access_token);
      // this.setUserOtherData(responseJson.data.other_info, responseJson.data.email);
      this.setUserOtherData(
        responseJson.data.other_info,
        responseJson.data.email,
        country_code,
        country_name,
        country_img
      );
      setCountry(country_code);
    } else {
      console.log("responseJson.data is not an object");
    }

    setForceLoad();
    setTimeout(() => {
      playVideos(true);
    }, 500);
    console.log("video tab ===");
    // if (this.videoTab) {
    //   console.log('video tab ref ===');
    //   // this.videoTab.getVideos();
    //   // if (this.videoTabRefs[currentTab]) {
    //   //   this.videoTabRefs[currentTab].getVideos();
    //   //   console.log('SETCOUNTRY Home videos ==>');
    //   //   // Use should manually play videos on focus back
    //   //   this.handlePlayState(true);
    //   //   // this.videoTabRefs[currentTab].setVideoData();
    //   // }
    // }

    // this.getTabs(responseJson.data.access_token);
    this.checkAuthorizedToken(responseJson.data.access_token);
  };

  handleLogin = (type, userInfo) => {
    console.log("Home -> type", type, userInfo);
    const {
      authActions: { trans },
    } = this.props;
    const accessToken =
      type === "apple" && !_.isUndefined(userInfo?.identityToken)
        ? userInfo?.identityToken
        : userInfo?.accessToken.toString();
    const deviceCountry = DeviceInfo.getDeviceCountry()
      ? DeviceInfo.getDeviceCountry()
      : "";
    const mac_address = this.state.macAddress;

    if (type === "facebook") {
      this.setState({ modalVisible: false });
      setTimeout(() => {
        this.setState({ fbLoad: true }, () => {
          getApiDataProgress(
            `${settings.endpoints.social_login}?Token=${accessToken}&Provider=facebook&country_id=${deviceCountry}&mac_address=${mac_address}`,
            "get",
            null,
            {},
            null
          )
            .then((responseJson) => {
              if (responseJson.success === true) {
                this.setState({ fbLoad: false, modalVisible: false }, () =>
                  this.setAfterLogin(responseJson)
                );
              } else {
                this.setState({ fbLoad: false }, () => {
                  setTimeout(() => {
                    EAlert(
                      responseJson.message,
                      trans("error_msg_title"),
                      () => {
                        setTimeout(() => {
                          this.setState({ modalVisible: true });
                        }, 50);
                      }
                    );
                  }, 50);
                });
              }
            })
            .catch((err) => {
              console.log(err);
              this.setState({ fbLoad: false }, () => {
                setTimeout(() => {
                  CAlert(
                    trans("something_wrong_alert_msg"),
                    trans("error_msg_title"),
                    () => {
                      setTimeout(() => {
                        this.setState({ modalVisible: true });
                      }, 50);
                    }
                  );
                }, 50);
              });
            });
        });
      }, 50);
    } else if (type === "google") {
      this.setState({ modalVisible: false }, () => {
        setTimeout(() => {
          this.setState({ googleLoad: true }, () => {
            getApiDataProgress(
              `${settings.endpoints.social_login}?Token=${accessToken}&Provider=google&country_id=${deviceCountry}&mac_address=${mac_address}`,
              "get",
              null,
              {},
              null
            )
              .then((responseJson) => {
                if (responseJson.success === true) {
                  this.setState(
                    { googleLoad: false, modalVisible: false },
                    () => this.setAfterLogin(responseJson)
                  );
                } else {
                  this.setState({ googleLoad: false }, () => {
                    setTimeout(() => {
                      EAlert(
                        responseJson.message,
                        trans("error_msg_title"),
                        () => {
                          setTimeout(() => {
                            this.setState({ modalVisible: true });
                          }, 50);
                        }
                      );
                    }, 50);
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                this.setState({ googleLoad: false }, () => {
                  setTimeout(() => {
                    CAlert(
                      trans("something_wrong_alert_msg"),
                      trans("warning_alert_msg_title"),
                      () => {
                        setTimeout(() => {
                          this.setState({ modalVisible: true });
                        }, 50);
                      }
                    );
                  }, 50);
                });
              });
          });
        }, 50);
      });
    } else if (type === "apple" && !_.isUndefined(userInfo?.identityToken)) {
      this.setState(() => {
        setTimeout(() => {
          this.setState(() => {
            getApiDataProgress(
              `${settings.endpoints.social_login}?Token=${accessToken}&Provider=apple&country_id=${deviceCountry}&mac_address=${mac_address}`,
              "get",
              null,
              {},
              null
            )
              .then((responseJson) => {
                if (responseJson.success === true) {
                  this.setState({ modalVisible: false }, () =>
                    this.setAfterLogin(responseJson)
                  );
                } else {
                  this.setState(() => {
                    this.setState({ modalVisible: false });
                    setTimeout(() => {
                      EAlert(responseJson.message, trans("error_msg_title"));
                    }, 50);
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                this.setState(() => {
                  setTimeout(() => {
                    CAlert(
                      trans("something_wrong_alert_msg"),
                      trans("warning_alert_msg_title")
                    );
                  }, 50);
                });
              });
          });
        }, 50);
      });
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
    const {
      authActions: { setUserOtherData },
    } = this.props;
    this.setUser(data, email, code, cName, cImg);
    setUserOtherData(data);
    const detail = JSON.stringify(data);
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

  googleAction = () => {
    this.setState({ modalVisible: false }, () => {
      setTimeout(() => {
        this.GoogleLogin();
      }, 50);
    });
  };

  appleLogin = (data) => {
    console.log("Winner -> data", data);
  };

  onTabVideoChange = (e) => {
    const { setCurrentTabPage, currentTab, tabPageIds } = this.props;

    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const pageNum = Math.round(contentOffset.y / viewSize.height);
    const currentTabActivePage = tabPageIds[currentTab - 1];

    // console.log("On Tab video change ====> ", currentTabActivePage, pageNum, currentTab);
    if (currentTabActivePage !== pageNum) {
      this.stopCurrentvideo(pageNum);
      setCurrentTabPage(currentTab, pageNum);
      this.shouldOpenSponsorAd(currentTab, pageNum);
    }
  };

  shouldOpenSponsorAd = (currentTab, pageNum) => {
    try {
      const videNow = this.videoList[currentTab][pageNum];
      if (videNow && _.has(videNow.props.data, "advertise")) {
        if (videNow.props.data.advertise.ad_show) {
          this.openSponsorAdModal(
            videNow.props.data.advertise,
            videNow.props.data.video_id,
            pageNum
          );
        }
      }
    } catch (error) {
      console.log("error while opening sponsor ad");
    }
  };

  openPrivacyModal = async () => {
    const {
      playVideos,
      playVideos2,
      auth: { screen },
    } = this.props;
    playVideos(false);
    if (this.CPrivacyModal) {
      this.setState({ modalVisible: false }, () => {
        this.CPrivacyModal.openModal();
      });
    }
  };

  openTermConditionModal = async () => {
    const {
      playVideos,
      playVideos2,
      auth: { screen },
    } = this.props;
    playVideos(false);
    if (this.CTermsCondition) {
      this.setState({ modalVisible: false }, () => {
        this.CTermsCondition.openModal();
      });
    }
  };

  openSponsorAdModal = (item, vId, pageNum) => {
    const { playVideos } = this.props;
    playVideos(false);
    if (this.CSponsorAd) {
      this.CSponsorAd.openModal(item, vId);
    }
  };

  closeSponsorAdModal = () => {
    const { playVideos } = this.props;
    playVideos(true);
    if (this.CSponsorAd) {
      this.CSponsorAd.closeModal();
    }
  };

  handleSeenAd = (id) => {
    this.videoTab.setSeenAd(id);
  };

  closeAllModal = () => {
    const { playVideos } = this.props;
    // Use should manually play videos on focus back
    playVideos(true);
    this.setState({
      modalVisible: false,
      privacyModalVisible: false,
      termsModalVisible: false,
    });
  };

  closePrivacyModal = () => {
    this.setState({ privacyModalVisible: false }, () => {
      setTimeout(() => {
        this.setState({ modalVisible: true });
      }, 100);
    });
  };

  closeTermsConditionModal = () => {
    this.setState({ termsModalVisible: false }, () => {
      setTimeout(() => {
        this.setState({ modalVisible: true });
      }, 100);
    });
  };

  goto = (page, data) => {
    const { navigation } = this.props;
    if (
      page === "Notification" ||
      page === "Profile" ||
      page === "UploadVideo"
    ) {
      this.retrieveData(page);
    } else {
      navigation.navigate(page, { data });
    }
  };

  checkAuthorizedToken = async (cToken) => {
    const {
      auth: { token, uuid, userOtherData },
    } = this.props;

    if (_.isObject(userOtherData) && !_.isEmpty(userOtherData)) {
      const uName = `${userOtherData.firstname} ${userOtherData.lastname}`;

      // add user data in bugsnag..
      bugsnag.setUser(userOtherData.user_id, uName, userOtherData.email);
      firebase.analytics().setUserId(userOtherData.user_id);
      firebase.analytics().setUserProperty("email", userOtherData.email);
      firebase
        .analytics()
        .setUserProperty("firstname", userOtherData.firstname);
      firebase.analytics().setUserProperty("lastname", userOtherData.lastname);
    }

    const mToken = cToken || token;
    if (mToken !== "" && uuid === "") {
      setTimeout(() => {
        this.configFCM();
      }, 50);
    }

    // Moved below logic to the main App.js
    // try {
    //   const value = await AsyncStorage.getItem('token');
    //   if (value !== null && value !== '' && token === '') {
    //     setToken(value);
    //     setTimeout(() => {
    //       // initialize();
    //     }, 2000);
    //   } else {
    //     console.log('Token already set or not set yet.');
    //     // initialize();
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

    // setTimeout(() => {
    //   this.getTabs();
    // }, 50);
  };

  retrieveData = async (page) => {
    const { navigation, playVideos } = this.props;
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null && value !== "") {
        playVideos(false);
        if (page === "UploadVideo") {
          const upload = true;
          navigation.navigate(page, { upload });
        } else {
          navigation.navigate(page);
        }
      } else {
        playVideos(false);
        this.setState({ modalVisible: true });
      }
    } catch (error) {
      console.log(error);
    }
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
      console.log(error);
    }
  };

  // onClick = () => {
  //   const wasRotated = this.state.spinValue._value === 1;
  //   Animated.timing(this.state.spinValue, {
  //     toValue: wasRotated ? 0 : 1,
  //     duration: 250,
  //     easing: Easing.linear,
  //   }).start();
  // };

  renderBottomTabBar = () => {
    const {
      auth: { badge },
      videoData,
      authActions: { trans, setScreen },
      isUploading,
    } = this.props;

    // const isHomeTab = routeName === "Home";
    // const isTop100Tab = routeName === "Winner";

    return (
      <View style={[styles.BottomTabViewSty]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setScreen("Home");
            // if (isHomeTab) return;
            this.goto("Home");
          }}
          style={styles.BottomTabView}
        >
          <Icon name="Home" style={styles.TabIconSty} />
          <Text numberOfLines={1} style={styles.BottomTabTitle}>
            {trans("Home_bottom_tab1_text")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.BottomTabView}>
          <Icon name="Trophy-fill" style={styles.TabIconSty} />
          <Text numberOfLines={1} style={styles.BottomTabTitle}>
            {trans("Home_bottom_tab2_text")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.BottomTabView}
          // onPress={() => { this.goto('Post'); }}
          onPress={() => {
            if (_.isEmpty(videoData.videoFile)) {
              this.goto("UploadVideo");
            } else {
              this.props.navigation.navigate("Disclaimer");
            }
          }}
        >
          <View
            style={[styles.AddViewSty, isUploading ? { width: "100%" } : null]}
          >
            <TabIcon routeName="post" needView={false} />
            <Label routeName="post" isHome />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.goto("Notification");
          }}
          style={styles.BottomTabView}
        >
          {badge > 0 ? (
            <View style={{ position: "relative" }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "red",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: -5,
                  right: -9,
                  zIndex: 10,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[common.textNBold, { color: "#FFF" }]}
                >
                  {badge}
                </Text>
              </View>
              <Icon name="Comment-outline" style={styles.TabIconSty} />
            </View>
          ) : (
            <Icon name="Comment-outline" style={styles.TabIconSty} />
          )}

          <Text numberOfLines={1} style={styles.BottomTabTitle}>
            {trans("Home_bottom_tab3_text")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.goto("Profile");
          }}
          style={styles.BottomTabView}
        >
          <Icon name="Users-outline" style={styles.TabIconSty} />
          <Text numberOfLines={1} style={styles.BottomTabTitle}>
            {trans("Home_bottom_tab4_text")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderInterstitialAd = () => {
    const {
      auth: { adType },
      authActions: { setAdType },
    } = this.props;

    const { admobUnitIdList, InterstitialAd } = adType;
    if (
      InterstitialAd === true &&
      admobUnitIdList &&
      admobUnitIdList.Interstitial_Top100_id[Platform.OS]
    ) {
      return (
        <CInterstitialAd
          {...this.props}
          onCloseAd={() => {
            this.setState({ displayInterstitialAd: false });
            setAdType({ ...adType, InterstitialAd: false });
          }}
          showAds={this.state.displayInterstitialAd}
          AdUnit={admobUnitIdList.Interstitial_Top100_id[Platform.OS]}
          // AdUnit="ca-app-pub-3940256099942544/1033173712"
        />
      );
    }
  };

  setVideoRef = (item, index, cTab) => (o) => {
    // if (_.isNull(o)) return;
    if (!this.videoList) {
      this.videoList = {};
    }
    if (!this.videoList[cTab]) {
      this.videoList[cTab] = {};
    }
    this.videoList[cTab][index] = o;

    if (this.waitingNewToBuffer === true) {
      console.log(
        "Buffer debug: On Set Video Ref if Waiting for New to Buffer true Yes."
      );
      this.waitingNewToBuffer = false;
      this.bufferNextVideo();
    }
  };

  bufferNextVideo = (currentIndex = -1) => {
    const { currentTab } = this.props;
    this.bufferedVideoIndexs.push(currentIndex);
    const currentMaxVideoIndex = _.max(this.bufferedVideoIndexs);
    console.log(
      "Buffer debug: Buffer max video : ===> ",
      currentMaxVideoIndex,
      currentMaxVideoIndex + 1,
      "CD => ",
      currentIndex
    );

    const nextToBuffer = currentMaxVideoIndex + 1;
    const videoAryLength = this.videoList[currentTab]
      ? Object.keys(this.videoList[currentTab]).length - 1
      : 0;
    if (
      !_.isUndefined(this.videoList) &&
      _.isObject(this.videoList[currentTab]) &&
      this.videoList[currentTab][nextToBuffer] &&
      videoAryLength >= nextToBuffer
    ) {
      // console.log(this.videoList[currentTab][nextToBuffer]);
      this.videoList[currentTab][nextToBuffer].startBuffer(true);
    } else if (videoAryLength < nextToBuffer) {
      console.log("Buffer debug: Next to buffer is not available in the list");
      // this.waitingNewToBuffer = true;
    }
    //   console.log('Buffer debug: Next video to buffer not found :: ==> ', this.videoList, currentTab, nextToBuffer);
  };

  bytesToSize = (bytes) => (bytes / 1048576).toFixed(3);

  stopCurrentvideo(startNext = false) {
    const { currentTab, tabPageIds } = this.props;
    const currentTabActivePage = tabPageIds[currentTab - 1];
    if (
      !_.isUndefined(this.videoList) &&
      !_.isUndefined(this.videoList[currentTab]) &&
      !_.isUndefined(this.videoList[currentTab][currentTabActivePage]) &&
      !_.isNull(this.videoList[currentTab][currentTabActivePage])
    ) {
      console.log(
        "stopping video ===> ",
        currentTabActivePage,
        "stat next ===> ",
        startNext
      );
      this.videoList[currentTab][currentTabActivePage].stopVideo(true);
      if (startNext !== false) {
        // console.log('Starting the next video ==> ', startNext);
        // console.log(this.videoList[currentTab]);
        if (
          !_.isUndefined(this.videoList[currentTab][startNext]) &&
          !_.isNull(this.videoList[currentTab][startNext])
        ) {
          this.videoList[currentTab][startNext].startVideo(true);
        }
      }
    }
  }

  handleFacebookError(error) {
    const {
      authActions: { trans },
    } = this.props;
    console.log(error);
    this.setState({ fbLoad: false }, () => {
      setTimeout(() => {
        CAlert(
          trans("Home_unable_login_text"),
          trans("warning_alert_msg_title"),
          () => {
            setTimeout(() => {
              this.setState({ modalVisible: true });
            }, 50);
          }
        );
      }, 50);
    });
  }

  renderItem = ({ item, index }, cTab) => {
    const { countryName, flag } = this.state;
    return (
      <CVideo
        vKey={`id_${item.video_id}`}
        pageIndex={index}
        ref={this.setVideoRef(item, index, cTab)}
        data={item}
        cTab={_.toInteger(cTab)}
        // gotoProfilePage={() => { this.goto('OtherUserProfile'); }}
        closeModal={this.closeAllModal}
        setWinningPrice={this.setWinningPrice}
        countryName={countryName}
        flag={flag}
        retrieveData={this.retrieveData}
        ShowFlagIcon
        ShowSearchIcon
        type="top_100"
        bufferNextVideo={this.bufferNextVideo}
        maxVideosLoad={this.maxVideosLoad}
        navigation={this.props.navigation}
        mainHeight={this.mainHeight}
        onFollowStatusChange={this.updateFollowstatus}
      />
    );
  };

  renderError = () => {};

  renderLoading = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <ActivityIndicator size="large" color="#FFF" />
    </View>
  );

  renderModal = () => {
    const { fbLoad, googleLoad } = this.state;

    return (
      <Modal
        transparent
        animationType="fade"
        visible={fbLoad || googleLoad}
        supportedOrientations={["portrait", "landscape"]}
        // onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={colors.brandAppBackColor} />
        </View>
      </Modal>
    );
  };

  render() {
    const {
      modalVisible,
      privacyModalVisible,
      termsModalVisible,
      setPrivacyData,
      setTermsanduseData,
      spinValue,
      showInterAd,
    } = this.state;
    const {
      authActions: { trans },
    } = this.props;
    // const {
    //   authActions: { setBadge, trans },
    // } = this.props;
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <View
        style={styles.container}
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout;
          if (height > 0) {
            this.mainHeight = height;
          }
        }}
      >
        {/* <TopBar /> */}
        {showInterAd ? this.renderInterstitialAd() : null}
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            zIndex: 1,
            alignSelf: "center",
            // flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={logo}
            style={{
              width: 60,
              height: 60,
            }}
          />
        </View>
        <CVideoTab
          ref={(o) => {
            if (o != null) {
              this.videoTab = o;
              this.videoTabRefs = o;
            }
          }}
          key={`tabArray${2}`}
          tabID={_.toInteger(2)}
          renderItem={this.renderItem}
          active
          onTabVideoChange={this.onTabVideoChange}
          setWinningPrice={this.setWinningPrice}
          bufferNextVideo={this.bufferNextVideo}
          retrieveData={this.retrieveData}
          type="top_100"
        />

        {/*
        //!----------NOTE REMOVED CATEGORAY TABS----------------!
        {_.isArray(tabData) &&
          tabData.map((ele) => ( */}
        {/* <CVideoTab
              ref={(o) => {
                if (o != null) {
                  this.videoTab = o;
                  this.videoTabRefs = o;
                }
              }}
              key={`tabArray${3}`}
              tabID={_.toInteger(3)}
              renderItem={this.renderItem}
              active={currentTab === 3}
              onTabVideoChange={this.onTabVideoChange}
              setWinningPrice={this.setWinningPrice}
              bufferNextVideo={this.bufferNextVideo}
              retrieveData={this.retrieveData}
              type="Home"
            /> */}
        {/* ))} */}
        {this.renderBottomTabBar()}
        <CLogin
          {...this.props}
          modalVisible={modalVisible}
          closeModal={this.closeAllModal}
          privacyModal={privacyModalVisible}
          closePrivacyModal={this.closePrivacyModal}
          termsModal={termsModalVisible}
          closeTermsModal={this.closeTermsConditionModal}
          openTermsConditionModal={this.openTermConditionModal}
          openPrivacyModal={this.openPrivacyModal}
          setPrivacyData={setPrivacyData}
          setTermsanduseData={setTermsanduseData}
          handleLogin={(type, userInfo) => this.handleLogin(type, userInfo)}
          onFbAction={() => {
            this.FbLoginProcess();
          }}
          onGoogleAction={() => {
            this.googleAction();
          }}
          onAppleAction={() => {
            this.appleLogin();
          }}
        />
        {this.renderModal()}
        <CPrivacyModal
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CPrivacyModal = o.getWrappedInstance();
            } else {
              this.CPrivacyModal = o;
            }
          }}
          visible
          loginModal={this.retrieveData}
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
          visible
          loginModal={this.retrieveData}
        />
        <CSponsorAd
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CSponsorAd = o.getWrappedInstance();
            } else {
              this.CSponsorAd = o;
            }
          }}
          closeAdModal={this.closeSponsorAdModal}
          handleSeenAd={this.handleSeenAd}
        />
      </View>
    );
  }
}

Winner.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.func),
  auth: PropTypes.objectOf(PropTypes.any),
  showNotification: PropTypes.func,
  setCurrentTabPage: PropTypes.func,
  playVideos: PropTypes.func,
  playVideos2: PropTypes.func,
  setTabData: PropTypes.func,
  isHomeFocused: PropTypes.func,
  isTop100Focused: PropTypes.func,
  currentTab: PropTypes.number,
  tabPageIds: PropTypes.arrayOf(PropTypes.number),
  tabData: PropTypes.arrayOf(PropTypes.object),
  videoData: PropTypes.objectOf(PropTypes.any),
  screenName: PropTypes.string,
};

Winner.defaultProps = {
  navigation: {},
  authActions: {},
  auth: {},
  videoData: {},
  showNotification: () => null,
  setCurrentTabPage: () => null,
  playVideos: () => null,
  playVideos2: () => null,
  isHomeFocused: () => null,
  isTop100Focused: () => null,
  setTabData: () => null,
  currentTab: 2,
  tabPageIds: [0, 0],
  tabData: [],
  screenName: "Top_100",
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
    currentTab: state.home.currentTab,
    tabPageIds: state.home.tabPageIds,
    tabData: state.home.tabData,
    home: state.home,
    videoData: state.video.videoData,
    isUploading: state.video.isUploading,
    screenName: "Top_100",
  };
}

function mapDispatchToProps(dispatch) {
  const {
    setCurrentTabPage,
    setTabData,
    playVideos,
    playVideos2,
    isHomeFocused,
    force,
    isTop100Focused,
    setCurrentVideoTab,
  } = homeActions;
  return {
    authActions: bindActionCreators(authActions, dispatch),
    socketActions: bindActionCreators(socketActions, dispatch),
    setCurrentTabPage: bindActionCreators(setCurrentTabPage, dispatch),
    setTabData: bindActionCreators(setTabData, dispatch),
    playVideos: bindActionCreators(playVideos, dispatch), // For Home
    playVideos2: bindActionCreators(playVideos2, dispatch), // For top 100
    isHomeFocused: bindActionCreators(isHomeFocused, dispatch),
    isTop100Focused: bindActionCreators(isTop100Focused, dispatch),
    setCurrentVideoTab: bindActionCreators(setCurrentVideoTab, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withInAppNotification(Winner));
