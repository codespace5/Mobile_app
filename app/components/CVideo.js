/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable quotes */
/* eslint-disable no-nested-ternary */
// import liraries
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Share,
  Dimensions,
  TouchableOpacity,
  AppState,
  NativeModules,
  StatusBarIOS,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import _ from "lodash";
import ActionSheet from "react-native-actionsheet";
import MIcon from "react-native-vector-icons/MaterialIcons";
import FIcon from "react-native-vector-icons/FontAwesome5";
// import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import AntIcon from "react-native-vector-icons/AntDesign";
import { RFValue } from "react-native-responsive-fontsize";
import Video from "react-native-video";
import { Bubbles } from "react-native-loader";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Client } from "bugsnag-react-native";
import EIcon from "react-native-vector-icons/Entypo";
import TextTicker from "react-native-text-ticker";
import Device from "react-native-device-info";
import { isIphoneX } from "react-native-iphone-x-helper";
import Toast from "react-native-easy-toast";
import colors from "../config/styles";
import common from "../config/genStyle";
import { Icon } from "../config/icons";
import CDisclaimer from "./CDisclaimer";
import CComment from "./CComment";
import CUserView from "./CUserView";
import CVoteModal from "./CVoteModal";
import { CAlert } from "./CAlert";
import authActions from "../redux/reducers/auth/actions";
import homeActions from "../redux/reducers/home/actions";
// import { CAlert } from './CAlert';
import settings from "../config/settings";
import { getApiDataProgress, getApiData } from "../redux/utils/apiHelper";
import CButton from "./CButton";
import Loader from "./CContentLoader";
import { FORTAB } from "../config/MQ";
// import CVideoTab from './CVideoTab';

const { StatusBarManager } = NativeModules;

// define your styles
const styles = StyleSheet.create({
  MainViewSty: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  backgroundVideo: {
    flex: 1,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height - (colors.headerUnsafeHeight + colors.bottomSpace),
    backgroundColor: "#000",
    position: "relative",
    zIndex: 9,
  },
  absoluteViewSty: {
    position: "absolute",
    // bottom: 60,
    right: 0,
    // top: 140,
    backgroundColor: "#0000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    // maxWidth: 80,
  },
  otherViewSty: {
    padding: RFValue(8),
    alignItems: "center",
    justifyContent: "center",
  },
  ProfileViewSty: {
    borderWidth: 2,
    borderColor: "#FFF",
  },
  VoteImgSty: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 6,
    borderColor: colors.brandAppBackColor,
  },
  UserTextSty: {
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  AddIconViewSty: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandAppBackColor,
  },
  VideoInfoTextView: {
    position: "absolute",
    left: 10,
    // bottom: 70,
    right: Dimensions.get("window").width - 225,
    zIndex: 50,
  },
  videoPoster: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  // videoReloadPoster: {
  //   position: "absolute",
  //   top: "47%",
  //   backgroundColor: "rgba(0,0,0,0.5)",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   alignSelf: "center",
  //   zIndex: 80,
  //   width: 50,
  //   height: 50,
  //   borderRadius: 50,
  // },
  RankViewSty: {
    width: 35,
    height: 35,
    marginTop: 10,
    position: "relative",
  },
  UserSty: {
    width: "100%",
    height: "100%",
  },
  rankTextSty: {
    color: "#ef755b",
    fontSize: RFValue(14),
    position: "absolute",
    top: 4,
  },
  countryPickerStyle: {
    position: "absolute",
    right: 0,
    bottom: 50,
    zIndex: 10,
  },
  btnwrap: {
    width: "25%",
    // alignSelf: "center",
  },
  scrollingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  musicNoteIcon: {
    marginRight: 10,
  },
});

const actionSheetSty = {
  titleBox: {
    height: 50,
  },
  titleText: {
    color: "#000",
    fontSize: RFValue(12),
  },
  buttonText: {
    fontSize: RFValue(12),
    fontFamily: colors.fonts.proximaNova.regular,
  },
};

const bugsnag = new Client(settings.bugsnagKey);

// create a component
class CVideo extends Component {
  constructor(props) {
    super(props);
    const {
      authActions: { trans },
    } = this.props;
    this.state = {
      showModal: false,
      // commentModal: false,
      // userViewModal: false,
      // voteModal: false,
      muted: true,
      paused: true,
      videoDetail: {},
      getList: false,
      retried: false,
      showPoster: true,
      shouldBuffer: false,
      headerUnsafeHeight: colors.headerUnsafeHeight,
      // vote: 0,
      buttonLoad: false,
      buttonName: trans("OtherUserProfile_follow_btn_text"),
      spinValue: new Animated.Value(0),
      // likeText: "Like This Artist? Like the video",
      likeText: trans("Like_This_Artist_Like_the_video"),
      showText: false,
      // reload: false,
    };
    this.flag = 0;
    this.logDetails = {};
    this.ActionSheetOptions = {
      CANCEL_INDEX: 2,
      DESTRUCTIVE_INDEX: 2,
      options: [
        trans("CVideo_more_disclaimer_title"),
        // trans('CVideo_more_share_title'),
        trans("CVideo_more_report_title"),
        trans("Profile_cancel_option_text"),
      ],
      title: "",
    };
  }

  componentWillMount() {
    this.StartDiscRotateFunction();
  }

  componentDidMount() {
    const { type, pageIndex } = this.props;
    this.playPauseOnProps();
    // if (type === "top_100") {
    //   this.getVideoDetail();
    // }
    this.getProfileData();

    // this.onClick();
    // this.doFollow();
    /* Listen Statubar Height change */
    if (Platform.OS === "ios") {
      // eslint-disable-next-line arrow-parens
      StatusBarManager.getHeight((response) =>
        this.setState({ headerUnsafeHeight: response.height })
      );
      this.listener = StatusBarIOS.addListener(
        "statusBarFrameWillChange",
        (statusBarData) =>
          this.setState({ headerUnsafeHeight: statusBarData.frame.height })
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      isHomeFocused,
      currentTab,
      playVideos,
      pageIndex,
      isTop100Focused,
      playVideos2,
    } = this.props;

    if (
      !_.isEqual(nextProps.isHomeFocused, isHomeFocused) ||
      !_.isEqual(nextProps.isTop100Focused, isTop100Focused) ||
      !_.isEqual(nextProps.playVideos, playVideos) ||
      !_.isEqual(nextProps.playVideos2, playVideos2) ||
      !_.isEqual(nextProps.currentTab, currentTab)
    ) {
      this.playPauseOnProps(nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      getList,
      muted,
      paused,
      retried,
      showModal,
      showPoster,
      buffering,
      shouldBuffer,
      buttonName,
      spinValue,
    } = this.state;
    const { currentTab, playVideos, playVideos2 } = this.props;
    if (
      !_.isEqual(nextState.getList, getList) ||
      !_.isEqual(nextState.muted, muted) ||
      !_.isEqual(nextState.paused, paused) ||
      !_.isEqual(nextState.retried, retried) ||
      !_.isEqual(nextState.showModal, showModal) ||
      !_.isEqual(nextState.showPoster, showPoster) ||
      !_.isEqual(nextState.buffering, buffering) ||
      !_.isEqual(nextState.shouldBuffer, shouldBuffer) ||
      !_.isEqual(nextProps.currentTab, currentTab) ||
      !_.isEqual(nextProps.playVideos, playVideos) ||
      !_.isEqual(nextProps.playVideos2, playVideos2) ||
      !_.isEqual(nextProps.buttonName, buttonName) ||
      !_.isEqual(nextProps.spinValue, spinValue)
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.stopVideo(true);
    if (Platform.OS === "ios" && this.listener) {
      this.listener.remove();
    }
  }

  getVideoDetail = () => {
    const {
      data,
      auth: { token },
      setTabData,
      type,
    } = this.props;
    const detail = {
      video_id: data.video_id,
    };

    let url;
    if (token === "") {
      url = settings.endpoints.getGuestVideo;
    } else {
      url = settings.endpoints.getVideos;
    }

    const headers = {
      authorization: `Bearer ${token}`,
    };

    getApiData(url, "get", detail, headers)
      .then((response) => {
        if (response.success) {
          if (_.isObject(response.data) && _.isArray(response.data.rows)) {
            if (response.data.rows.length > 0) {
              setTabData(response.data.rows[0].live_category_price);
              this.setState({ videoDetail: response.data.rows[0] });
            } else {
              this.setState({ videoDetail: {} });
            }
          }
        } else {
          this.setState({ videoDetail: {} });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleModal = (type) => {
    const { data } = this.props;

    if (type === "userView") {
      if (data.video_view !== "0") {
        if (this.CUserView) {
          this.CUserView.openModal();
        }
        // this.setState({ userViewModal: true });
      }
    } else if (type === "comment") {
      if (this.CComment) {
        this.CComment.openModal();
      }
    }
  };

  stopVideo = () => {
    const nState = { paused: true, muted: true };
    this.setState(nState);
  };

  startVideo = (nextProps = null) => {
    const { type } = this.props;
    let { isHomeFocused, isTop100Focused } = this.props;

    if (nextProps !== null && nextProps.isHomeFocused) {
      isHomeFocused = nextProps.isHomeFocused;
    } else if (nextProps !== null && nextProps.isTop100Focused) {
      isTop100Focused = nextProps.isTop100Focused;
    }

    if (isHomeFocused === false && type === "home") {
      return false;
    }
    if (isTop100Focused === false && type === "top_100") {
      return false;
    }
    this.setState({ paused: false, muted: false, showText: true }, () => {
      setTimeout(() => {
        this.setState({
          showText: false,
        });
      }, 6000);
    });
  };

  startBuffer = () => {
    const { shouldBuffer } = this.state;
    console.log(
      "Buffer debug: Start buffer for video called ===> ",
      this.props.data.video_id,
      shouldBuffer
    );
    if (shouldBuffer === false) {
      this.setState({ shouldBuffer: true });
    }
  };

  initStartVideo = () => {
    this.setState({ paused: false, muted: false }, () => {
      // Ajax call to update video data
      if (this.videoTab) {
        this.videoTab.getVideos();
      }
    });
  };

  onProgress = (data) => {
    if (data.currentTime > 5 && this.flag === 0) {
      this.flag = 1;
      this.addView();
      this.logDetails.progress = data;
    }
  };

  onBuffer = (data) => {
    if (_.isObject(data)) {
      console.log(
        "Buffer debug: buffering ====> ",
        this.props.data.video_id,
        data.isBuffering
      );
      this.setState({ buffering: data.isBuffering });

      this.logDetails.onBuffer = data;
    }
  };

  // onReload = () => {
  //   const { bufferNextVideo, type, tabPageIds, currentTab } =
  //     this.props;
  //   const currentTabActivePage = tabPageIds[currentTab - 1];
  //   this.setState({
  //     reload: false,
  //     buffering: true,
  //   });
  //   this.stopVideo(false);
  //   // this.startVideo();
  //   // this.player.seek(0);
  //   this.logDetails.onLoad = "Called";
  //   if (type === "home" || type === "top_100")
  //     bufferNextVideo(currentTabActivePage, 'reload');
  // };

  // onSeek = (data) => {
  //   const {
  //     authActions: { trans },
  //   } = this.props;
  //   const { buffering } = this.state;
  //   setTimeout(() => {
  //     if (_.isObject(data) && data.currentTime === 0 && buffering) {
  //       Toast.show(`${trans("connectionIssueText")}`);
  //     }
  //   }, 5000);
  // };

  onLoad = () => {
    console.log(
      "Buffer debug: Video is loaded ",
      this.props.data.video_id,
      this.props.maxVideosLoad
    );
    const { bufferNextVideo, pageIndex, type } = this.props;
    this.logDetails.onLoad = "Called";
    if (type === "home" || type === "top_100")
      bufferNextVideo(pageIndex, "load");
  };

  onReadyForDisplay = () => {
    this.logDetails.onReadyForDisplay = "Called";
    this.setState({ showPoster: false });
  };

  addView = () => {
    const {
      auth: { token },
      authActions: { setVideoData },
      data,
    } = this.props;
    const headers = {
      authorization: `Bearer ${token}`,
    };

    const detail = {
      "VideoView[video_id]": data.video_id,
    };

    let url;

    if (token !== "" && token !== undefined && token !== null) {
      url = settings.endpoints.addViewAfterLogin;
    } else {
      url = settings.endpoints.addView;
    }

    getApiDataProgress(url, "post", detail, headers, () => null)
      .then((response) => {
        if (response.success) {
          if (_.isObject(response.data) && _.isArray(response.data.rows)) {
            setVideoData(response.data.rows);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  vote = () => {
    const {
      data,
      auth: { token },
      authActions: { setVideoData },
    } = this.props;
    const detail = {
      "VideoVote[video_id]": data.video_id,
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    getApiDataProgress(
      settings.endpoints.add_vote,
      "post",
      detail,
      headers,
      () => null
    )
      .then((response) => {
        console.log(response);
        if (response.success === true) {
          setVideoData(response.data);
          this.setState({ getList: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleVote = () => {
    const {
      auth: { token },
      retrieveData,
      data,
      type,
    } = this.props;

    if (type === "winner" || data.is_winner > 0) {
      if (this.CVoteModal) {
        this.CVoteModal.openModal();
      }
    } else if (_.isString(token) && token.length > 0) {
      if (data.voted === 0 || data.voted === "0") {
        this.vote();
      } else if (this.CVoteModal) {
        this.CVoteModal.openModal();
      }
    } else if (retrieveData) {
      retrieveData();
    }
  };

  renderPoster = () => {
    const { paused } = this.state;
    const {
      currentTab,
      tabPageIds,
      pageIndex,
      auth: { screen, isHomePlayIndex, isTop100PlayIndex },
    } = this.props;
    const currentTabActivePage = tabPageIds[currentTab - 1];

    if (_.toNumber(pageIndex) !== currentTabActivePage) return null;

    if (paused) {
      return (
        <View style={styles.videoPoster}>
          <FIcon name="play" style={{ color: "#FFF", fontSize: RFValue(40) }} />
        </View>
      );
    }
    return null;
  };

  renderVideoPoster = () => {
    const { data } = this.props;
    const { showPoster } = this.state;
    if (showPoster) {
      return (
        <View style={styles.videoPoster}>
          <Image
            source={{ uri: data.video_image }}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - colors.headerHeight,
            }}
          />
        </View>
      );
    }
    return null;
  };

  goto = (page, data) => {
    console.log(page);
    const { navigation, onFbAction, onGoogleAction } = this.props;
    this.stopVideo(true);
    if (page === "OtherUserProfile") {
      navigation.navigate(page, {
        data,
        onFbAction,
        onGoogleAction,
      });
    } else {
      navigation.navigate(page, {
        data,
        onFbAction,
        onGoogleAction,
      });
    }
  };

  showMoreActions = () => {
    if (this.ActionSheet) {
      this.ActionSheet.show();
    }
  };

  handleMoreAction = (i) => {
    const {
      authActions: { trans },
      auth: { token },
    } = this.props;
    // const { videoDetail } = this.state;

    const disclaimerIndex = 0;
    // const shareIndex = 1;
    const reportIndex = 1;

    // const { user_id } = this.getDataObj();
    // if (user_id === userId) {
    //   shareIndex = 0;
    //   blockIndex = -1;
    // }
    // if (i === shareIndex) {
    //   Share.share({
    //     title: 'MTC',
    //     message: videoDetail.video_share_link
    //       ? videoDetail.video_share_link
    //       : data.video_share_link,
    //   });
    // }

    if (i === disclaimerIndex) {
      this.setState({ showModal: true });
    }

    if (i === reportIndex) {
      if (token === "") {
        CAlert(
          trans("CVideo_report_login_error_text"),
          trans("CVideo_report_login_error_title")
        );
        return;
      }
      CAlert(
        trans("CVideo_report_confirmation_text"),
        trans("confirm_alert_msg_title"),
        () => {
          this.reportVideo();
        },
        () => {}
      );
    }
  };

  reportVideo = () => {
    const {
      data,
      auth: { token },
      authActions: { trans },
    } = this.props;
    const detail = {
      video_id: data.video_id,
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    getApiDataProgress(
      settings.endpoints.report,
      "post",
      detail,
      headers,
      () => null
    )
      .then((response) => {
        console.log(response);
        if (response.success === true) {
          CAlert(
            trans("CVideo_report_done_text"),
            trans("CVideo_report_done_title")
          );
        } else if (response.message) {
          CAlert(response.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  showOtherUserScreen = (type, obj) => {
    const { navigation } = this.props;

    console.log(obj);
    if (type === "comment") {
      if (this.CComment) {
        this.CComment.closeModal();
      }
    } else if (type === "user") {
      if (this.CUserView) {
        this.CUserView.closeModal();
      }
    } else if (type === "vote") {
      if (this.CVoteModal) {
        this.CVoteModal.closeModal();
      }
    }
    setTimeout(() => {
      navigation.navigate("OtherUserProfile", {
        data: obj,
      });
    }, 100);
  };

  // eslint-disable-next-line react/sort-comp
  playPauseOnProps(nextProps = null) {
    const { cTab, pageIndex, type } = this.props;

    let { currentTab, tabPageIds, playVideos, isHomeFocused, isTop100Focused } =
      this.props;

    if (!_.isNull(nextProps)) {
      // eslint-disable-next-line prefer-destructuring
      currentTab = nextProps.currentTab;
      // eslint-disable-next-line prefer-destructuring
      tabPageIds = nextProps.tabPageIds;
      playVideos = nextProps.playVideos;
      isHomeFocused = nextProps.isHomeFocused;
      isTop100Focused = nextProps.isTop100Focused;
    }
    const { paused, retried } = this.state;
    const currentTabActivePage = tabPageIds[currentTab - 1];

    if (
      type === "videoList" ||
      type === "profile" ||
      type === "otherUserVideo"
    ) {
      console.log("Video type is free");
      if (AppState.currentState === "active") {
        this.startVideo();
      }
    } else if (!playVideos) {
      this.stopVideo(true);
    } else if (
      _.toNumber(currentTab) === _.toNumber(cTab) &&
      _.toNumber(pageIndex) === _.toNumber(currentTabActivePage)
    ) {
      /* Stop - Start - Hot fix first video not playing */
      if (_.toNumber(pageIndex) === 0 && retried === false) {
        this.stopVideo(true);
        setTimeout(() => {
          this.setState(
            {
              retried: true,
            },
            () => {
              if (AppState.currentState === "active") {
                if (isHomeFocused === true || isTop100Focused === true) {
                  this.startVideo(nextProps);
                }
              }
              // this.initStartVideo();
            }
          );
        }, 10);
      } else if (paused) {
        if (AppState.currentState === "active") {
          if (isHomeFocused === true || isTop100Focused === true) {
            this.startVideo(nextProps);
          }
        }
      }
    } else if (!paused) {
      this.stopVideo(true);
    }
  }

  shouldDisplaytheVideo(checkIfCurrnet = false) {
    const {
      currentTab,
      tabPageIds,
      cTab,
      pageIndex,
      type,
      maxVideosLoad,
      auth: { screen, isHomePlayIndex, isTop100PlayIndex },
    } = this.props;
    const { shouldBuffer } = this.state;
    const currentTabActivePage = tabPageIds[currentTab - 1];

    if (type !== "home" || type !== "top_100") return true;

    // if (type === 'home' && isHomeFocused === false) return false;

    /* Old Logic of Buffering display videos
      if (_.toNumber(currentTab) === _.toNumber(cTab)
       && (
        (!checkIfCurrnet && (_.toNumber(pageIndex) >= (_.toNumber(currentTabActivePage) - 1)
        && _.toNumber(pageIndex) <= (_.toNumber(currentTabActivePage) + 1)))
        || (
          checkIfCurrnet && (_.toNumber(pageIndex) === (_.toNumber(currentTabActivePage)))
        )
        || (shouldBuffer && (_.toNumber(pageIndex) >= (_.toNumber(currentTabActivePage) - maxVideosLoad)
        && _.toNumber(pageIndex) <= (_.toNumber(currentTabActivePage) + maxVideosLoad)))
      )
    ) */

    if (
      _.toNumber(currentTab) === _.toNumber(cTab) &&
      ((!checkIfCurrnet &&
        _.toNumber(pageIndex) >= _.toNumber(currentTabActivePage) - 1 &&
        _.toNumber(pageIndex) <= _.toNumber(currentTabActivePage) + 1) ||
        (shouldBuffer &&
          _.toNumber(pageIndex) >=
            _.toNumber(currentTabActivePage) - maxVideosLoad &&
          _.toNumber(pageIndex) <=
            _.toNumber(currentTabActivePage) + maxVideosLoad))
    ) {
      return true;
    }
    return false;
  }

  updateButtonName = (newName) => {
    const {
      authActions: { trans },
    } = this.props;
    const FollowBtn = trans("OtherUserProfile_follow_btn_text");
    const FollowingBtn = trans("OtherUserProfile_following_btn_text");

    if (newName === true) {
      this.setState({
        buttonLoad: false,
        buttonName: FollowingBtn,
      });
      return;
    }
    if (newName === false) {
      this.setState({
        buttonLoad: false,
        buttonName: FollowBtn,
      });
      return;
    }
    this.setState({
      buttonLoad: false,
      buttonName: newName,
    });
  };

  doFollow = () => {
    const {
      onFollowStatusChange,
      auth: { token },
      authActions: { trans },
    } = this.props;
    const { buttonName } = this.state;
    const FollowBtn = trans("OtherUserProfile_follow_btn_text");
    const FollowingBtn = trans("OtherUserProfile_following_btn_text");
    const { user_id } = this.getDataObj();

    this.setState({ buttonLoad: true }, () => {
      getApiDataProgress(
        `${settings.endpoints.do_follow}?user_id=${user_id}`,
        "get",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
        .then((responseJson) => {
          if (responseJson.success === true) {
            onFollowStatusChange();
            this.updateButtonName(
              buttonName === FollowingBtn ? FollowBtn : FollowingBtn
            );
          } else {
            this.updateButtonName(FollowBtn);
          }
        })
        .catch((error) => {
          console.log(error);
          this.updateButtonName(FollowBtn);
        });
    });
  };

  getProfileData = () => {
    const {
      auth: { token },
      authActions: { trans },
      navigation,
    } = this.props;

    const FollowBtn = "Follow";
    const FollowingBtn = "Following";

    const data = this.getDataObj();

    let otherUserApi = "";
    let header = {};
    if (
      _.isString(token) &&
      token !== "" &&
      token !== undefined &&
      token !== null
    ) {
      otherUserApi = settings.endpoints.view_user_login;
      header = {
        Authorization: `Bearer ${token}`,
      };
    } else {
      otherUserApi = settings.endpoints.view_user;
      header = {};
    }
    this.setState({ buttonLoad: true }, () => {
      getApiData(otherUserApi, "get", data, header)
        .then((responseJson) => {
          console.log("cvideo response ===>", responseJson);
          if (responseJson.success) {
            const btnName =
              _.isObject(responseJson.data) &&
              responseJson.data.is_follower === false
                ? FollowBtn
                : FollowingBtn;
            this.updateButtonName(btnName);
            return btnName;
          }
          this.updateButtonName(FollowBtn);
        })
        .catch((error) => {
          this.updateButtonName(FollowBtn);
        });
    });
  };

  getDataObj = () => {
    const { data, navigation } = this.props;
    const userData = data;
    const FromWhereStr = navigation.getParam("FromWhereStr");

    let datas = {};
    if (_.isObject(userData)) {
      if (FromWhereStr === "NotificationList" && userData.from_user_id !== "") {
        datas = {
          user_id: userData.from_user_id,
        };
      } else if (!_.isEmpty(userData.user_id)) {
        datas = {
          user_id: userData.user_id,
        };
      } else if (!_.isEmpty(userData.id)) {
        datas = {
          user_id: userData.id,
        };
      }
    }

    return datas;
  };

  StartDiscRotateFunction = () => {
    const { buffering, paused } = this.state;
    this.state.spinValue.setValue(0);

    Animated.timing(this.state.spinValue, {
      toValue: buffering || paused ? 0 : 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => this.StartDiscRotateFunction());
  };

  render() {
    const {
      showModal,
      muted,
      paused,
      videoDetail,
      getList,
      buffering,
      showPoster,
      headerUnsafeHeight,
      buttonLoad,
      buttonName,
      spinValue,
      likeText,
      showText,
      // reload,
    } = this.state;
    const {
      data,
      vKey,
      type,
      authActions: { trans },
      auth: { token, userOtherData },
      countryName,
      flag,
      retrieveData,
      ShowFlagIcon,
      ShowSearchIcon,
      mainHeight,
      currentTab,
      cTab,
      tabPageIds,
    } = this.props;

    const videoUrl =
      _.isObject(data) && _.isString(data.video_url) && data.video_url !== ""
        ? data.video_url
        : "";
    const userName =
      _.isObject(data) && _.isString(data.username) && data.username !== ""
        ? data.username
        : "";
    const artistId =
      _.isObject(data) && _.isString(data.artist_id) && data.artist_id !== ""
        ? data.artist_id
        : "";
    const videoDesc =
      _.isObject(data) &&
      _.isString(data.description) &&
      data.description !== ""
        ? data.description
        : "";

    const videoWinnerView = videoDetail.video_view
      ? videoDetail.video_view
      : "0";
    const videoView = data.video_view ? data.video_view : "0";
    const videoWinnerComment = videoDetail.video_comment
      ? videoDetail.video_comment
      : "0";
    const videoComment = data.video_comment ? data.video_comment : "0";

    const videoArtist = _.has(data, "video_artist") ? data.video_artist : "";
    const videoTitle = _.has(data, "video_title") ? data.video_title : "";

    // let marqueTitleText = "Original Song - Song credit not available 🎶 🎵";
    let marqueTitleText = `${trans("marqueTitleText")} 🎶 🎵`;

    if (videoArtist && videoTitle) {
      marqueTitleText = `${videoTitle} 🎶 🎵 - ${videoArtist}`;
    }

    let dynamicGetHeight = 0;
    if (mainHeight === 0) {
      dynamicGetHeight =
        Dimensions.get("window").height -
        (headerUnsafeHeight + colors.bottomSpace);
    }

    const optsStyle = {
      iconFontSize: RFValue(32),
      textFontSize: RFValue(12),
      textLineHeight: RFValue(15),
      img: {
        height: RFValue(32),
        width: RFValue(32),
        borderRadius: RFValue(16),
      },
    };

    const showFollowUnFollowBtn = !!(
      _.isString(token) &&
      token !== "" &&
      token !== undefined &&
      token !== null &&
      userOtherData.email !== data.email
    );

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    const currentTabActivePage = tabPageIds[currentTab - 1];

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.setState({ paused: !paused, muted: !muted });
          }}
          style={[
            styles.MainViewSty,
            { height: mainHeight > 0 ? mainHeight : dynamicGetHeight },
          ]}
          key={`main_${vKey}`}
        >
          <View style={{ flex: 1 }}>
            {this.shouldDisplaytheVideo(false) && (
              <Video
                source={{ uri: videoUrl }}
                ref={(o) => {
                  if (o != null) {
                    this.player = o;
                  }
                }}
                bufferConfig={{
                  minBufferMs: 1000,
                  maxBufferMs: 4000,
                  bufferForPlaybackMs: 100,
                  bufferForPlaybackAfterRebufferMs: 1000,
                }}
                style={styles.backgroundVideo}
                repeat
                muted={muted}
                paused={paused}
                ignoreSilentSwitch="ignore"
                playInBackground={false}
                onProgress={this.onProgress}
                onBuffer={this.onBuffer}
                onLoad={this.onLoad}
                onReadyForDisplay={this.onReadyForDisplay}
                // onEnd={() => this.player.seek(0)}
                // onError={(e) => {
                //   this.logDetails.onError = e;
                //   bugsnag.notify(e, (report) => {
                //     report.metadata = { video: videoDetail };
                //   });
                // }}
                onError={(e) => {
                  console.log("CVideo -> render -> e", e);
                  setTimeout(() => {
                    this.toast.show(`${trans("connectionIssueText")}`, 5000);
                  }, 5000);
                }}
                resizeMode="contain"
                progressUpdateInterval={1000}
              />
            )}
            {/* {this.renderPoster()} */}
            {this.renderPoster()}
            {showPoster ? this.renderVideoPoster() : null}
            <Toast
              ref={(toast) => (this.toast = toast)}
              style={{ backgroundColor: "#000" }}
              position="center"
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
            />
          </View>
          {/* {buffering ? (
          <View style={styles.videoPoster}>
            <Bubbles size={6} color="#F8C63E" />
          </View>
        ) : null} */}
          {/* {reload ? (
            <TouchableOpacity
              style={styles.videoReloadPoster}
              onPress={() => this.onReload()}
            >
              <MCIcon
                name="reload"
                style={{ color: "#fff", fontSize: RFValue(40) }}
              />
            </TouchableOpacity>
          ) : null} */}
          <View
            style={{
              ...styles.VideoInfoTextView,
              bottom:
                type === "otherUserVideo" ||
                type === "profile" ||
                type === "videoList"
                  ? 8
                  : 80,
            }}
          >
            <Text
              numberOfLines={1}
              style={[
                common.textNBold,
                styles.UserTextSty,
                {
                  color: "#FFF",
                  marginVertical: 5,
                  zIndex: 10,
                },
              ]}
            >
              {showText ? likeText : ""}
            </Text>

            {/* <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            > */}
            <Text
              numberOfLines={1}
              style={[
                common.textNBold,
                styles.UserTextSty,
                {
                  color: "#FFF",
                  zIndex: 10,
                  paddingRight: 10,
                },
              ]}
            >
              {/* {`@${userName}`} */}
              {`Artist_ID # ${artistId}`}
            </Text>
            {showFollowUnFollowBtn ? (
              <View style={[styles.btnwrap, { zIndex: 10 }]}>
                <CButton
                  // load={buttonLoad}
                  btnText={buttonName}
                  textStyle={{ fontSize: 8 }}
                  btnStyle={{ height: 16, borderRadius: 3 }}
                  onPress={() => {
                    this.doFollow();
                  }}
                />
              </View>
            ) : null}
            {/* </View> */}
            <Text
              numberOfLines={2}
              style={[
                common.textNBold,
                styles.UserTextSty,
                {
                  color: "#FFF",
                  marginVertical: 5,
                  zIndex: 10,
                },
              ]}
            >
              {videoDesc}
            </Text>
            <View style={styles.scrollingTextContainer}>
              <FIcon
                name="music"
                size={14}
                color="#FFF"
                style={styles.musicNoteIcon}
              />
              <TextTicker
                style={[
                  common.textNBold,
                  styles.UserTextSty,
                  {
                    color: "#FFF",
                    marginVertical: 5,
                    zIndex: 10,
                  },
                ]}
                duration={8000}
                loop
                bounce
                shouldAnimateTreshold={Dimensions.get("window").width * 0.7}
                animationType="scroll"
                repeatSpacer={150}
                marqueeDelay={0}
                scrollSpeed={0}
                easing={Easing.linear}
              >
                {`${marqueTitleText}`}
                {/* {videoArtist && videoTitle ? (
                  <Text
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    {videoTitle}{" "}
                    <MIcon name="music-note" size={14} color="#4CC2FA" />
                    {"-"} {videoArtist}
                  </Text>
                ) : (
                  `Original Song - Song credit not available 🎶 🎵`
                )} */}
              </TextTicker>
            </View>
          </View>

          <View
            style={{
              position: "absolute",
              zIndex: 50,
              right: 6,
            }}
          >
            {ShowFlagIcon ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  retrieveData("Country");
                }}
                style={styles.otherViewSty}
                // style={{ position: "absolute", top: 0 }}
              >
                <Image
                  style={[
                    {
                      borderWidth: 2,
                      borderColor: "#FFF",
                    },
                    optsStyle.img,
                  ]}
                  source={{
                    uri: userOtherData.countryImg
                      ? userOtherData.countryImg
                      : flag,
                  }}
                />
                <Text
                  style={{ color: "#FFF", fontSize: optsStyle.textFontSize }}
                  numberOfLines={1}
                >
                  {userOtherData.code ? userOtherData.code : countryName}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View
            style={{
              ...styles.absoluteViewSty,
              bottom:
                type === "otherUserVideo" ||
                type === "profile" ||
                type === "videoList"
                  ? 8
                  : 70,
            }}
          >
            {ShowSearchIcon ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this.goto("SearchScreen");
                }}
                style={styles.otherViewSty}
              >
                <MIcon
                  name="search"
                  style={{ fontSize: optsStyle.iconFontSize, color: "#FFF" }}
                />
                <Text
                  style={{ color: "#FFF", fontSize: optsStyle.textFontSize }}
                  numberOfLines={1}
                >
                  {trans("discover")}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.otherViewSty, { position: "relative" }]}
              // onPress={gotoProfilePage}
              onPress={() => {
                this.goto("OtherUserProfile", data);
              }}
            >
              <Image
                style={[styles.ProfileViewSty, optsStyle.img]}
                source={{ uri: data.photo }}
              />
              {/* <View style={styles.AddIconViewSty}>
              <Icon name="Add" style={{ fontSize: RFValue(8), color: '#FFF' }} />
            </View> */}
            </TouchableOpacity>

            {data.ribbon_text === "Draft" ? null : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.otherViewSty}
                onPress={() => this.handleModal("userView")}
              >
                <Icon
                  name="View"
                  style={{ fontSize: optsStyle.iconFontSize, color: "#FFF" }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    common.textNBold,
                    styles.UserTextSty,
                    {
                      color: "#FFF",
                      fontSize: optsStyle.textFontSize,
                      lineHeight: optsStyle.textLineHeight,
                    },
                  ]}
                >
                  {videoView}
                </Text>
              </TouchableOpacity>
            )}

            {data.ribbon_text === "Draft" ? null : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.otherViewSty}
                onPress={() => this.handleModal("comment")}
              >
                <Icon
                  name="Speech-bubble-outline"
                  style={{ fontSize: optsStyle.iconFontSize, color: "#FFF" }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    common.textNBold,
                    styles.UserTextSty,
                    {
                      color: "#FFF",
                      fontSize: optsStyle.textFontSize,
                      lineHeight: optsStyle.textLineHeight,
                    },
                  ]}
                >
                  {videoComment}
                  {/* {data.video_comment ? data.video_comment : '0'} */}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.otherViewSty}
              onPress={this.handleVote}
            >
              <AntIcon
                // name="like2"
                name={data.voted !== "0" ? "like1" : "like2"}
                style={{ color: "#FFF", fontSize: optsStyle.iconFontSize }}
              />
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    common.textNBold,
                    styles.UserTextSty,
                    {
                      color: "#FFF",
                      fontSize: optsStyle.textFontSize,
                      lineHeight: optsStyle.textLineHeight,
                      textAlign: "center",
                    },
                  ]}
                >
                  {data.video_vote ? data.video_vote : "0"}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    common.textNBold,
                    styles.UserTextSty,
                    {
                      color: "#FFF",
                      fontSize: optsStyle.textFontSize,
                      lineHeight: optsStyle.textLineHeight,
                      textAlign: "center",
                    },
                  ]}
                >
                  {trans("CVideo_like_text")}
                </Text>
              </View>
            </TouchableOpacity>
            {data.ribbon_text === "Draft" ? null : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.otherViewSty}
                onPress={() => {
                  Share.share({
                    title: "MTD",
                    message: videoDetail.video_share_link
                      ? videoDetail.video_share_link
                      : data.video_share_link,
                    // url: data.video_share_link,
                  });
                }}
              >
                <Icon
                  name="share-outline"
                  style={{ fontSize: optsStyle.iconFontSize, color: "#FFF" }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    common.textNBold,
                    styles.UserTextSty,
                    {
                      color: "#FFF",
                      fontSize: optsStyle.textFontSize,
                      lineHeight: optsStyle.textLineHeight,
                    },
                  ]}
                >
                  {trans("CVideo_share_text")}
                </Text>
              </TouchableOpacity>
            )}
            {data.ribbon_text === "Draft" ? null : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.otherViewSty}
                onPress={this.showMoreActions}
              >
                <EIcon
                  name="dots-three-horizontal"
                  style={{ color: "#FFF", fontSize: optsStyle.iconFontSize }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    common.textNBold,
                    styles.UserTextSty,
                    {
                      color: "#FFF",
                      fontSize: optsStyle.textFontSize,
                      lineHeight: optsStyle.textLineHeight,
                    },
                  ]}
                >
                  {/* {"Report"} */}
                  {trans("CVideo_report_text")}
                </Text>
              </TouchableOpacity>
            )}

            <Animated.View
              style={{
                backgroundColor: "#f76131",
                width: 45,
                height: 45,
                borderRadius: 60,
                justifyContent: "center",
                marginRight: 0,
                marginTop: 15,
                transform: [{ rotate: spin }],
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 38,
                  height: 38,
                  borderRadius: 40,
                  zIndex: 1,
                  borderTopWidth: 2,
                  borderBottomWidth: 2,
                  borderColor: "rgba(0,0,0,0.5)",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 30,
                    height: 30,
                    borderRadius: 40,
                    backgroundColor: "rgba(0,0,0,0.9)",
                    zIndex: 1,
                  }}
                >
                  <Icon name="Mic-outline" color="#fff" size={14} />
                </View>
              </View>
            </Animated.View>
          </View>

          <CDisclaimer
            {...this.props}
            key={`CDisclaimer_${vKey}`}
            modalVisible={showModal}
            disclaimer={data.disclaimer}
            closeModal={() => {
              this.setState({ showModal: false });
            }}
          />

          <CComment
            {...this.props}
            ref={(o) => {
              if (o && o.getWrappedInstance) {
                this.CComment = o.getWrappedInstance();
              } else {
                this.CComment = o;
              }
            }}
            id={data.video_id}
            totalComments={
              type === "winner" ? videoWinnerComment : videoComment
            }
            gotoOtherUser={(obj) => {
              this.showOtherUserScreen("comment", obj);
            }}
          />

          <CUserView
            {...this.props}
            ref={(o) => {
              if (o && o.getWrappedInstance) {
                this.CUserView = o.getWrappedInstance();
              } else {
                this.CUserView = o;
              }
            }}
            id={data.video_id}
            totalView={type === "winner" ? videoWinnerView : videoView}
            // gotoOtherUser={(obj) => {
            //   this.showOtherUserScreen('user', obj);
            // }}
          />

          <CVoteModal
            {...this.props}
            ref={(o) => {
              if (o && o.getWrappedInstance) {
                this.CVoteModal = o.getWrappedInstance();
              } else {
                this.CVoteModal = o;
              }
            }}
            id={data.video_id}
            totalVote={data.video_vote ? data.video_vote : "0"}
            getList={getList}
            is_winner={data.is_winner}
            gotoOtherUser={(obj) => {
              this.showOtherUserScreen("vote", obj);
            }}
          />

          <ActionSheet
            styles={actionSheetSty}
            ref={(o) => {
              this.ActionSheet = o;
            }}
            title={this.ActionSheetOptions.title}
            options={this.ActionSheetOptions.options}
            cancelButtonIndex={this.ActionSheetOptions.CANCEL_INDEX}
            destructiveButtonIndex={this.ActionSheetOptions.DESTRUCTIVE_INDEX}
            tintColor="#000"
            onPress={this.handleMoreAction}
          />
        </TouchableOpacity>
        {buffering ? (
          <View
            style={{
              position: "absolute",
              zIndex: 9999,
              bottom:
                type === "otherUserVideo" ||
                type === "profile" ||
                type === "videoList"
                  ? 0
                  : 48,
            }}
          >
            <Loader />
          </View>
        ) : null}
      </>
    );
  }
}

CVideo.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  // gotoProfilePage: PropTypes.func,
  vKey: PropTypes.string.isRequired,
  auth: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  setTabData: PropTypes.func,
  bufferNextVideo: PropTypes.func,
  type: PropTypes.string,
  navigation: PropTypes.objectOf(PropTypes.any),
  cTab: PropTypes.number,
  pageIndex: PropTypes.number,
  playVideos: PropTypes.bool,
  playVideos2: PropTypes.bool,
  ShowFlagIcon: PropTypes.bool,
  ShowSearchIcon: PropTypes.bool,
  isHomeFocused: PropTypes.bool,
  isTop100Focused: PropTypes.bool,
  currentTab: PropTypes.number,
  maxVideosLoad: PropTypes.number,
  tabPageIds: PropTypes.arrayOf(PropTypes.number),
  Top100Play: PropTypes.func,
  HomePlay: PropTypes.func,
};

CVideo.defaultProps = {
  data: {},
  // gotoProfilePage: null,
  auth: {},
  authActions: {},
  setTabData: () => null,
  bufferNextVideo: () => null,
  type: "",
  navigation: {},
  cTab: null,
  pageIndex: null,
  playVideos: true,
  playVideos2: true,
  ShowFlagIcon: false,
  ShowSearchIcon: false,
  isHomeFocused: false,
  isTop100Focused: false,
  currentTab: 1,
  tabPageIds: [0, 0],
  maxVideosLoad: 2,
  Top100Play: () => {},
  HomePlay: () => {},
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    home: state.home,
    currentTab: state.home.currentTab,
    tabPageIds: state.home.tabPageIds,
    playVideos: state.home.playVideos,
    playVideos2: state.home.playVideos2,
    isHomeFocused: state.home.isHomeFocused,
    isTop100Focused: state.home.isTop100Focused,
  };
}

function mapDispatchToProps(dispatch) {
  const {
    setTabData,
    playVideos2: Top100Play,
    playVideos: HomePlay,
  } = homeActions;
  return {
    authActions: bindActionCreators(authActions, dispatch),
    setTabData: bindActionCreators(setTabData, dispatch),
    Top100Play: bindActionCreators(Top100Play, dispatch), // For Top 100
    HomePlay: bindActionCreators(HomePlay, dispatch), // for Home
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(CVideo);
