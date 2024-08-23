import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "react-native-firebase";
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  BackHandler,
  AsyncStorage,
  Platform,
  Dimensions,
  DeviceEventEmitter,
} from "react-native";
import _ from "lodash";
import Upload from "react-native-background-upload";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Client } from "bugsnag-react-native";
import { stopSubmit, startSubmit, reset } from "redux-form";
import AIcon from "react-native-vector-icons/AntDesign";
import { RNFFprobe, RNFFmpegConfig } from "react-native-ffmpeg";
import CButton from "../components/CButton";
import CHeader from "../components/CHeader";
import authActions from "../redux/reducers/auth/actions";
import videoActions from "../redux/reducers/video/actions";
import DisclaimerForm from "../reduxForm/DisclaimerForm";
import settings from "../config/settings";
import { getReduxErrors, CAlert } from "../components/CAlert";
import CLoader from "../components/CLoader";
import colors from "../config/styles";
import VideoTrim, { ProcessingManager } from "../libs/react-native-video-trim";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

RNFFmpegConfig.disableLogs();
const bugsnag = new Client(settings.bugsnagKey);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  ModalMainView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: RFValue(25),
  },
  OtherMainView: {
    height: RFValue(200),
    // backgroundColor: '#FFF',
    borderRadius: 5,
    overflow: "hidden",
  },
  uploadSuccessText: {
    color: "#FFF",
    fontSize: RFValue(14),
    width: 200,
    textAlign: "center",
    marginTop: 8,
  },
  processTextStyle: {
    color: "#FFF",
    fontSize: RFValue(14),
    width: 200,
    textAlign: "center",
    marginTop: 8,
  },
});

class Disclaimer extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      success: false,
      isCancellable: true,
      uploadProgress: 0,
      compressProgress: null,
      screenFocused: false,
      readytoPublish: false,
    };

    this.uploadResult = null;
    this.cancel = false;
  }

  componentDidMount() {
    const {
      navigation,
      auth: { userOtherData },
    } = this.props;
    this.willBlurSubscription = navigation.addListener(
      "willBlur",
      this.onWillBlur
    );
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );
    this.submitVideoData();
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);

    DeviceEventEmitter.addListener("compressProgress", ({ progress }) => {
      this.setState({
        compressProgress: progress,
      });
    });
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }

    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  onWillFocus = (payload) => {
    this.setState({
      screenFocused: true,
    });
    setLeaveBreadcrumb(payload);
  };

  onWillBlur = () => {
    this.setState({
      screenFocused: false,
    });
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
    const {
      dispatch,
      navigation,
      videoActions: { setUploadVideoData },
    } = this.props;
    const { loading, visible, success } = this.state;
    if ((loading || success) && visible) {
      navigation.navigate("Home");
    } else {
      setUploadVideoData("");
      dispatch(stopSubmit("disclaimer_Form"));
      navigation.goBack();
    }
    // this.goto('post');
  };

  handleSubmit = (values) => {
    Keyboard.dismiss();
    this.submitDisclaimer(values);
  };

  submitDisclaimer = (values) => {
    const {
      form: { post_Form },
    } = this.props;
    Keyboard.dismiss();
    if (
      _.isObject(values) &&
      _.isObject(post_Form) &&
      _.isObject(post_Form.values) &&
      !_.isEmpty(post_Form.values)
    ) {
      this.submitVideoData(values);
    }
  };

  onProgressUpload = (e) => {
    const {
      video: { isUploading },
      videoActions: { setUploadProgress },
    } = this.props;
    const { isCancellable } = this.state;

    /* Set progress to Redux object */
    if (isUploading) {
      setUploadProgress(e);
      this.setState({ uploadProgress: e });

      if (e > 90 && isCancellable === true) {
        this.setState({
          isCancellable: false,
        });
      }
    }
  };

  getVideoDetails = () => {
    const {
      video: { videoData },
    } = this.props;
    const iosFile =
      _.isObject(videoData) &&
      _.isObject(videoData.videoFile) &&
      _.isString(videoData.videoFile.sourceURL) &&
      videoData.videoFile.sourceURL !== ""
        ? videoData.videoFile.sourceURL
        : "";
    const androidFile =
      _.isObject(videoData) &&
      _.isObject(videoData.videoFile) &&
      _.isString(videoData.videoFile.path) &&
      videoData.videoFile.path !== ""
        ? videoData.videoFile.path
        : "";
    const videoPath =
      Platform.OS === "ios" ? iosFile : androidFile.replace("file:///", "/");

    console.log(videoPath);
    const file = {
      uri: videoPath,
      name: videoPath.substr(videoPath.lastIndexOf("/") + 1),
      type:
        _.isObject(videoData) &&
        _.isObject(videoData.videoFile) &&
        _.isString(videoData.videoFile.mime) &&
        videoData.videoFile.mime !== ""
          ? videoData.videoFile.mime
          : "",
    };
    return file;
  };

  submitVideoData = async (values) => {
    // const { navigation } = this.props;
    // navigation.push('MakePayment', { type: 'disclaimer' });
    const {
      form: { post_Form },
      auth: { token },
      authActions: { trans },
      video: { videoData },
      videoActions: { setUploadVideoData, setUploading, setCompressing },
      dispatch,
    } = this.props;
    const { isCancellable } = this.state;
    const iosFile =
      _.isObject(videoData) &&
      _.isObject(videoData.videoFile) &&
      _.isString(videoData.videoFile.sourceURL) &&
      videoData.videoFile.sourceURL !== ""
        ? videoData.videoFile.sourceURL
        : "";
    const androidFile =
      _.isObject(videoData) &&
      _.isObject(videoData.videoFile) &&
      _.isString(videoData.videoFile.path) &&
      videoData.videoFile.path !== ""
        ? videoData.videoFile.path
        : "";
    const videoPath =
      Platform.OS === "ios" ? iosFile : androidFile.replace("file:///", "/");
    let videoTitle = "";
    let videoArtist = "";
    console.log(videoPath);
    const file = {
      uri: videoPath,
      name: videoPath.substr(videoPath.lastIndexOf("/") + 1),
      type:
        _.isObject(videoData) &&
        _.isObject(videoData.videoFile) &&
        _.isString(videoData.videoFile.mime) &&
        videoData.videoFile.mime !== ""
          ? videoData.videoFile.mime
          : "",
    };
    // const catId = _.isObject(post_Form) && _.isObject(post_Form.values)
    //   && _.isObject(post_Form.values.categoryName)
    //   && post_Form.values.categoryName.id ? post_Form.values.categoryName.id : 0;
    // const videoDesc = _.isObject(post_Form) && _.isObject(post_Form.values) && _.isString(post_Form.values.videoDesc) && post_Form.values.videoDesc !== '' ? post_Form.values.videoDesc : '';
    // const videoDisclaimer = _.isObject(values) && _.isString(values.disclaimer) && values.disclaimer !== '' ? values.disclaimer : '';
    //! CHANGE -  Adding Extra Artist Name and Title From FFMPEG
    if (videoPath) {
      await RNFFprobe.getMediaInformation(
        Platform.select({ ios: iosFile, android: androidFile })
      ).then((info) => {
        const vInfo = info.getMediaProperties();
        if (_.has(vInfo, "tags") && _.has(vInfo.tags, "title")) {
          videoTitle = vInfo.tags.title || "";
        }
        if (_.has(vInfo, "tags") && _.has(vInfo.tags, "artist")) {
          videoArtist = vInfo.tags.artist || "";
        }
      });
    }

    const videoDesc =
      _.isObject(post_Form) &&
      _.isObject(post_Form.values) &&
      _.isString(post_Form.values.videoDesc) &&
      post_Form.values.videoDesc !== ""
        ? post_Form.values.videoDesc
        : "";
    const videoDisclaimer =
      _.isObject(values) &&
      _.isString(values.disclaimer) &&
      values.disclaimer !== ""
        ? values.disclaimer
        : "";

    const data = {
      "Video[video_url]": file,
      "Video[description]": videoDesc,
      "Video[disclaimer]": videoDisclaimer,
      "Video[video_artist]": videoArtist,
      "Video[video_title]": videoTitle,
      // "Video[category_id]": "1",
    };

    /* Reset Is cancellable */
    if (!isCancellable) {
      this.setState({
        isCancellable: true,
      });
    }

    /* Set Analytics event about video processing */
    firebase.analytics().logEvent("Video_processing_start", data);

    /* Set Video data to Redux object */
    let newVideoData = videoData;
    newVideoData.videoDesc = videoDesc;
    newVideoData.videoDisclaimer = videoDisclaimer;
    newVideoData.videoArtist = videoArtist;
    newVideoData.videoTitle = videoTitle;
    // newVideoData.videoCat = catId;
    setUploadVideoData(newVideoData);
    setUploading(true);

    let isTrimmed = false;
    let isCompressed = false;
    let videoSrc = videoPath;

    this.setState({ visible: true, loading: true }, async () => {
      try {
        if (Platform.OS === "android") {
          console.log("=============> COMPRESS START <================");
          const compressResult = await this.compressVideo();
          console.log("Compress Result ===> ", compressResult);
          if (this.cancel) {
            this.cancel = false;
            return;
          }
          console.log(
            "=============> COMPRESS END <================",
            compressResult
          );
          if (compressResult.path) {
            isCompressed = true;
            isTrimmed = true;
            videoSrc = compressResult.path.replace("file:///", "/");
            firebase
              .analytics()
              .logEvent("Android_compress_success", compressResult);
          } else {
            firebase
              .analytics()
              .logEvent("Android_compress_failed", compressResult);
          }
        } else {
          console.log("=============> IOS TRIM START <================");
          setCompressing(true);
          const trimmedResultIOS = await VideoTrim.trim(videoPath, "medium");
          console.log(
            "IOS Video Trim and compress done ====> :D",
            trimmedResultIOS
          );
          if (this.cancel) {
            this.cancel = false;
            return;
          }
          if (trimmedResultIOS.path) {
            isTrimmed = true;
            isCompressed = true;
            videoSrc = trimmedResultIOS.path;
            firebase
              .analytics()
              .logEvent("IOS_compress_success", trimmedResultIOS);
          } else {
            firebase
              .analytics()
              .logEvent("IOS_compress_failed", trimmedResultIOS);
          }
          setCompressing(false);
          console.log("=============> IOS TRIM END <================");
        }
      } catch (err) {
        console.log(err);
      }

      if (this.cancel) {
        this.cancel = false;
        return;
      }

      console.log(`Bearer ${token}`, isTrimmed.toString());
      const options = {
        url: settings.uploadVideoApi + settings.endpoints.add_video,
        path: videoSrc,
        method: "POST",
        type: "multipart",
        maxRetries: 2, // set retry count (Android only). Default 2
        field: "Video[video_url]",
        parameters: {
          "Video[description]": videoDesc,
          "Video[disclaimer]": videoDisclaimer,
          "Video[video_artist]": videoArtist,
          "Video[video_title]": videoTitle,
          // "Video[category_id]": "1",
          trimmed: isTrimmed.toString(),
          compressed: isCompressed.toString(),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        notification: {
          enabled: true,
          autoClear: true,
          onProgressTitle: trans("Disclaimer_onProgressTitle"),
          onProgressMessage: trans("Disclaimer_onProgressMessage"),
          onCompleteTitle: trans("Disclaimer_onCompleteTitle"),
          onCompleteMessage: trans("Disclaimer_onCompleteMessage"),
          onErrorTitle: trans("Disclaimer_onErrorTitle"),
          onErrorMessage: trans("Disclaimer_onErrorMessage"),
        },
      };

      console.log("POST DATA ===> ", options);

      dispatch(startSubmit("disclaimer_Form"));
      Upload.startUpload(options)
        .then((uploadId) => {
          console.log("Upload started");
          /* Update uploadID to Video data to Redux object */
          newVideoData = this.props.video.videoData;
          newVideoData.uploadId = uploadId;
          setUploadVideoData(newVideoData);

          Upload.addListener("progress", uploadId, (uploadData) => {
            console.log(`Progress: ${uploadData.progress}%`);
            this.onProgressUpload(uploadData.progress);
          });
          Upload.addListener("error", uploadId, (uploadData) => {
            console.log("Error: ", uploadData);

            /* Set Analytics event about video processing */
            firebase
              .analytics()
              .logEvent("Video_processing_failure", uploadData);

            CAlert(uploadData.error, trans("error_msg_title"), () => {
              this.setStateOfCancel();
            });
            // bugsnag.notify(uploadData.error, (report) => {
            //   report.metadata = { uploadData: data };
            // });
          });
          Upload.addListener("cancelled", uploadId, (uploadData) => {
            console.log("Cancelled!", uploadData);
          });
          Upload.addListener("completed", uploadId, (uploadData) => {
            // data includes responseCode: number and responseBody: Object
            console.log("Completed!", uploadData);
            const responseJson = JSON.parse(uploadData.responseBody);
            this.uploadResult = responseJson;
            if (responseJson.success === true) {
              this.setState({ loading: false, success: true }, () => {
                this.handleModal(responseJson);
              });
            } else {
              /* Set Analytics event about video processing */
              firebase
                .analytics()
                .logEvent("Video_processing_failure", responseJson);

              if (
                _.isObject(responseJson) &&
                _.isObject(responseJson.message) &&
                _.isArray(responseJson.message.errors) &&
                responseJson.message.errors[0]
              ) {
                CAlert(
                  responseJson.message.errors[0],
                  trans("error_msg_title"),
                  () => this.setStateOfCancel()
                );
              } else if (
                _.isObject(responseJson) &&
                _.isObject(responseJson.message) &&
                _.isArray(responseJson.message.disclaimer) &&
                responseJson.message.disclaimer[0]
              ) {
                CAlert(
                  responseJson.message.disclaimer[0],
                  trans("error_msg_title"),
                  () => this.setStateOfCancel()
                );
              }
              // else if (_.isObject(responseJson)
              // && _.isObject(responseJson.message)
              // // && _.isArray(responseJson.message.category_id)
              // && responseJson.message.category_id[0]) {
              //   CAlert(responseJson.message.category_id[0], trans('error_msg_title'), () => this.setStateOfCancel());
              // }
              else {
                CAlert(responseJson.message, trans("error_msg_title"), () => {
                  this.setStateOfCancel();
                });
              }
              const ErrObj = getReduxErrors(responseJson);
              dispatch(stopSubmit("disclaimer_Form", ErrObj));
            }
          });
        })
        .catch((err) => {
          console.log("Upload error!", err);
          // bugsnag.notify(err, (report) => {
          //   report.metadata = { uploadData: data };
          // });
        });
    });
  };

  setStateOfCancel = async () => {
    const {
      videoActions: { setUploading, setUploadVideoData },
      navigation,
    } = this.props;
    setUploading(false);
    setUploadVideoData("");
    this.setState({ loading: false, success: false, visible: false }, () => {
      navigation.popToTop();
      navigation.navigate("Home");
    });
  };

  continuePublish = () => {
    const {
      navigation,
      authActions: { trans },
      auth: { userOtherData },
      videoActions: { setUploadVideoData },
    } = this.props;
    let screenToDisplay = "MakePayment";
    if (
      _.lowerCase(trans("Free_Video_Posting")) === "yes" ||
      userOtherData?.video_payment === "0"
    ) {
      screenToDisplay = "FreePostConfirmation";
    }

    setUploadVideoData("");
    navigation.navigate(screenToDisplay, {
      data:
        _.isObject(this.uploadResult) &&
        _.isObject(this.uploadResult.data) &&
        !_.isEmpty(this.uploadResult.data)
          ? this.uploadResult.data
          : {},
      type: "disclaimer",
    });
  };

  handleModal = (response) => {
    const {
      navigation,
      dispatch,
      authActions: { trans },
      auth: { userOtherData },
      videoActions: { setUploading, setUploadVideoData },
    } = this.props;
    const { screenFocused } = this.state;

    /* Set Analytics event about video processing */
    firebase.analytics().logEvent("Video_processing_success", response.data);

    setTimeout(() => {
      dispatch(reset("post_Form"));
      setUploading(false);
      if (screenFocused) {
        this.setState({ visible: false, success: false }, () => {
          setUploadVideoData("");
          let screenToDisplay = "MakePayment";
          if (
            _.lowerCase(trans("Free_Video_Posting")) === "yes" ||
            userOtherData?.video_payment === "0"
          ) {
            screenToDisplay = "FreePostConfirmation";
          }
          navigation.navigate(screenToDisplay, {
            data:
              _.isObject(response) &&
              _.isObject(response.data) &&
              !_.isEmpty(response.data)
                ? response.data
                : {},
            type: "disclaimer",
          });
        });
      } else {
        this.setState({
          readytoPublish: true,
        });
      }
    }, 2000);
  };

  cancelVideo = () => {
    const {
      dispatch,
      navigation,
      video: { videoData },
      authActions: { trans },
      videoActions: {
        setUploadVideoData,
        setUploading,
        setCompressing,
        setTrimming,
      },
    } = this.props;
    CAlert(
      trans("Disclaimer_cancel_upload_video_text"),
      trans("confirm_alert_msg_title"),
      () => {
        dispatch(stopSubmit("disclaimer_Form"));
        this.setState({ visible: false, loading: false }, () => {
          /* Set Analytics event about video processing */
          firebase
            .analytics()
            .logEvent("Video_processing_cancelled", videoData);

          setCompressing(false);
          setTrimming(false);
          setUploading(false);
          setUploadVideoData("");
          this.cancel = true;

          /* Lets cancel trimming or compressing */
          console.log("Cancelling the compressing");
          const cancelResponse = VideoTrim.cancel((done) => {
            console.log("Cancel result is ===> ", done);
          });
          console.log(cancelResponse);

          if (videoData.uploadId) {
            Upload.cancelUpload(videoData.uploadId);
            setUploadVideoData("");
            setUploading(false);
          }
          navigation.popToTop();
          navigation.navigate("Home");
        });
      },
      () => null
    );
  };

  compressVideo = () =>
    new Promise(async (resolve) => {
      const {
        videoActions: { setCompressing },
      } = this.props;
      try {
        const videoData = this.getVideoDetails();
        console.log("Compressing the video ==> ", videoData.uri);
        setCompressing(true);
        /* New code testing */
        VideoTrim.compress(videoData.uri, {}).then((file) => {
          setCompressing(false);
          console.log(file);
          this.setState(
            {
              compressProgress: null,
            },
            () => {
              resolve(file);
            }
          );
        });
      } catch (error) {
        // bugsnag.notify(error, (report) => {
        //   report.metadata = { type: 'Compressing the video' };
        // });
        console.log(error);
        setCompressing(false);
        this.setState(
          {
            compressProgress: null,
          },
          () => {
            resolve({
              success: false,
              error,
            });
          }
        );
      }
    });

  render() {
    const {
      visible,
      loading,
      success,
      uploadProgress,
      readytoPublish,
      isCancellable,
      compressProgress,
    } = this.state;
    const {
      authActions: { trans },
      video: { isTrimming, isCompressing },
    } = this.props;

    let currentStatus = `Uploading ${uploadProgress.toFixed(0)}%`;
    if (uploadProgress === 100)
      currentStatus = trans("Disclaimer_Video_processing");
    if (isTrimming) currentStatus = trans("Disclaimer_Video_Trimming");
    if (isCompressing) {
      currentStatus = `${trans("Disclaimer_Video_Compressing")} ${
        Platform.OS === "android" && compressProgress != null
          ? ` ${compressProgress} %`
          : ""
      }`;
    }

    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans("Disclaimer_page_title")}
          onBackAction={this.BackToHome}
        />

        {visible && loading ? (
          <View
            style={{
              flex: 1,
              marginVertical: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CLoader
              text={`${currentStatus} \n \n ${trans(
                "Disclaimer_background_upload_video_text"
              )}`}
              contentStyle={{ backgroundColor: "transparent" }}
              textStyle={{
                color: "#000",
                width: Dimensions.get("window").width * 0.8,
              }}
            />
            <CButton
              btnText={trans("Disclaimer_background_watch_btn_text")}
              btnStyle={{
                padding: 0,
                margin: 0,
                width: Dimensions.get("window").width * 0.8,
              }}
              onPress={this.BackToHome}
            />
            {isCancellable && (
              <CButton
                btnText={trans("Disclaimer_background_cancel_btn_text")}
                btnStyle={{
                  padding: 0,
                  margin: 0,
                  width: Dimensions.get("window").width * 0.8,
                }}
                onPress={this.cancelVideo}
              />
            )}
          </View>
        ) : null}
        {visible && success ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <AIcon
              name="checkcircle"
              style={{ fontSize: RFValue(40), color: colors.brandAppBackColor }}
            />
            <Text
              style={[
                styles.uploadSuccessText,
                readytoPublish ? { color: "#000" } : null,
              ]}
            >
              {trans("Disclaimer_video_upload_successfully")}
            </Text>
            {readytoPublish && (
              <CButton
                btnText={trans("Disclaimer_background_conitinue_btn_text")}
                btnStyle={{
                  padding: 0,
                  marginTop: 30,
                  width: Dimensions.get("window").width * 0.8,
                }}
                onPress={this.continuePublish}
              />
            )}
          </View>
        ) : null}
        {/* {!visible && (
          <DisclaimerForm
            // {...this.props}
            onSubmit={this.handleSubmit}
          />
        )} */}
      </View>
    );
  }
}

Disclaimer.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  videoActions: PropTypes.objectOf(PropTypes.any),
  video: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  form: PropTypes.objectOf(PropTypes.any),
};

Disclaimer.defaultProps = {
  authActions: {},
  auth: {},
  videoActions: {},
  video: {},
  navigation: {},
  dispatch: () => null,
  form: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
    form: state.form,
    video: state.video,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    videoActions: bindActionCreators(videoActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer);
