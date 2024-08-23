import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import getCmsData from "../redux/utils/getCmsData";
import CHeader from "../components/CHeader";
import common from "../config/genStyle";
import settings from "../config/settings";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import colors from "../config/styles";
import authActions from "../redux/reducers/auth/actions";
import videoActions from "../redux/reducers/video/actions";
import CLoader from "../components/CLoader";
import CButton from "../components/CButton";
import { CAlert } from "../components/CAlert";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  MainView: {
    padding: RFValue(20),
    flex: 1,
  },
  infoTextSty: {
    marginVertical: RFValue(10),
    color: "#000",
    letterSpacing: 0.3,
    lineHeight: 19,
    paddingBottom: RFValue(50),
  },
  BottomLoginViewSty: {
    paddingHorizontal: RFValue(20),
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#8e8e93",
  },
});

// create a component
class FreePostConfirmation extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pageContent: "",
    };
  }

  componentDidMount = async () => {
    const {
      navigation,
      videoActions: { setUploading, setUploadVideoData },
    } = this.props;
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );

    const videoData = navigation.getParam("data");
    console.log(videoData);

    try {
      const pageContent = await getCmsData("free-video-posting");
      console.log(pageContent);

      if (pageContent.success === true) {
        if (_.isObject(pageContent.data)) {
          if (
            _.isString(pageContent.data.app_body) &&
            pageContent.data.app_body !== ""
          ) {
            this.setState({
              pageContent: pageContent.data.app_body,
              loading: false,
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    /* Lets stop uploading */
    setUploading(false);

    /* clear video data from redux is set */
    const reduxVideoData = this.props.videoData;
    if (!_.isEmpty(reduxVideoData.videoFile)) {
      setUploadVideoData("");
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);

    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  };

  handleBackPress = async () => {
    try {
      const value = await AsyncStorage.getItem("activeScreen");
      if (value !== null) {
        if (value === "Home") {
          BackHandler.exitApp();
        } else {
          this.BackToHome();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  BackToHome = () => {
    const { navigation } = this.props;
    navigation.popToTop();
  };

  setUserOtherDatas = async (data, country) => {
    const {
      authActions: { setUserOtherData },
    } = this.props;
    const uData = { ...data, ...country };
    const detail = JSON.stringify(uData);
    try {
      setUserOtherData(uData);
    } catch (error) {
      console.log("error---", error);
    }
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

  postVideo = () => {
    const {
      auth: { token },
      authActions: { trans },
      navigation,
    } = this.props;
    const videoData = navigation.getParam("data");
    const takePartAgain =
      _.isObject(videoData) &&
      _.isNumber(videoData.able_to_part_again) &&
      videoData.able_to_part_again === 1
        ? 1
        : 0;
    const VideoId =
      _.isObject(videoData) && videoData.video_id ? videoData.video_id : "";
    const detail = {
      video_id: VideoId,
      take_part_again: takePartAgain,
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    this.setState({ loading: true }, () => {
      getApiDataProgress(
        settings.endpoints.free_video_post,
        "post",
        detail,
        headers,
        () => null
      )
        .then(async (response) => {
          if (response.success === true) {
            this.setUserOtherDatas(
              response.data.other_info,
              response.data.country_data,
            );
            CAlert(response.message, trans("success_alert_msg_title"), () => {
              this.success(true);
            });
          } else {
            if (response.data && response.data.ask_payment) {
              navigation.navigate("MakePayment", {
                data: videoData,
                type: "disclaimer",
              });
              return;
            }
            this.setState({ loading: false }, () => {
              CAlert(response.message, trans("error_msg_title"), () =>
                this.success(false)
              );
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  success = (bool) => {
    const {
      navigation,
      authActions: { setForceLoad },
    } = this.props;
    this.setState({ loading: false }, () => {
      if (bool) {
        setForceLoad();
        navigation.popToTop();
        navigation.navigate("Profile");
      }
    });
  };

  renderLoaderView = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        size="small"
        color={colors.brandAppBackColor}
        animating
      />
    </View>
  );

  render() {
    const { loading, pageContent } = this.state;
    const {
      authActions: { trans },
    } = this.props;
    // const videoData = navigation.getParam('data');

    if (loading && pageContent === "") {
      return <CLoader />;
    }

    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans("Free_Video_Posting_Title")}
          onBackAction={() => {
            this.BackToHome();
          }}
          otherMainViewSty={{ zIndex: 10 }}
        />

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.MainView}
        >
          <Text style={[common.textH4, styles.infoTextSty]}>
            {_.isString(pageContent) && pageContent !== "" ? pageContent : ""}
          </Text>
        </ScrollView>

        <View style={styles.BottomLoginViewSty}>
          <CButton
            btnText={trans("Free_Video_Posting_Button_Text")}
            load={loading}
            onPress={() => {
              this.postVideo();
            }}
          />
        </View>
      </View>
    );
  }
}

FreePostConfirmation.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  videoActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  videoData: PropTypes.objectOf(PropTypes.any),
};

FreePostConfirmation.defaultProps = {
  authActions: {},
  videoActions: {},
  auth: {},
  navigation: {},
  videoData: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
    videoData: state.video.videoData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    videoActions: bindActionCreators(videoActions, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FreePostConfirmation);
