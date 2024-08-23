import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { change } from "redux-form";
import { RFValue } from "react-native-responsive-fontsize";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ActionSheet from "react-native-actionsheet";
import { Column as Col, Row } from "react-native-flexbox-grid";
import FIcon from "react-native-vector-icons/FontAwesome";
import Slideshow from "../libs/react-native-slideshow/Slideshow";
import { CAlert } from "../components/CAlert";
import CHeader from "../components/CHeader";
import CButton from "../components/CButton";
import common from "../config/genStyle";
import colors from "../config/styles";
import authActions from "../redux/reducers/auth/actions";
import { getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import CProfileVideo from "../components/CProfileVideo";
import CError from "../components/CError";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";
import CRewardAd from "../components/CRewardAd";
import CBannerAd from "../components/CBannerAd";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  imgSty: {
    height: RFValue(100),
    width: RFValue(100),
    borderRadius: RFValue(50),
    overflow: "hidden",
  },
  profileSty: {
    paddingTop: RFValue(20),
    paddingBottom: RFValue(15),
    justifyContent: "center",
    alignItems: "center",
  },
  followerswrap: {
    paddingVertical: RFValue(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  followingsty: {
    paddingHorizontal: RFValue(20),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  btnwrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bankIcon: {
    padding: RFValue(8),
    color: "#000",
    borderWidth: 1,
    borderColor: "#8e8e93",
    textAlign: "center",
    borderRadius: RFValue(5),
    marginTop: RFValue(15),
    marginBottom: RFValue(20),
  },
  iconwrap: {
    width: "100%",
    paddingVertical: RFValue(5),
    justifyContent: "center",
    alignItems: "center",
  },
  commonRightBorder: {
    borderRightColor: colors.brandAppTextGrayColor,
    borderRightWidth: 1,
  },
  RowStyle: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  CommonLoaderErrorViewSty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const actionSheetSty = {
  titleBox: {
    height: RFValue(50),
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

class Profile extends Component {
  static navigationOptions = {
    header: null,
  };
  // eslint-disable-next-line lines-between-class-members
  constructor(props) {
    super(props);
    const {
      authActions: { trans },
    } = this.props;
    this.ActionSheetOptions = {
      CANCEL_INDEX: 3,
      DESTRUCTIVE_INDEX: 3,
      options: [
        trans("Profile_view_option_text"),
        trans("Profile_payment_option_text"),
        trans("Profile_delete_option_text"),
        trans("Profile_cancel_option_text"),
      ],
      title: "",
    };
    this.state = {
      pageLoad: true,
      videoListLoad: true,
      selectVideoData: {},
      // moreItems: true,
      refreshing: false,
      // page: 1,
      data: {},
      videoList: [],
      position: 0,
      dataSource: [],
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );
    // this.getProfileData();
    const {
      authActions: { trans },
    } = this.props;
    const bannersString = trans("promo_banners");
    if (!_.isEmpty(bannersString)) {
      try {
        const bannersObj = JSON.parse(bannersString);
        const slideImages = bannersObj.banners.map((obj, key) => ({
          url: obj.image,
          link: Platform.OS === "ios" ? obj.ioslink : obj.androidlink,
        }));
        this.setState(
          {
            dataSource: slideImages,
          },
          () => {
            this.interval = setInterval(() => {
              this.setState({
                position:
                  this.state.position === this.state.dataSource.length
                    ? 0
                    : this.state.position + 1,
              });
            }, 6000);
          }
        );
      } catch (e) {
        return false;
      }
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
    this.getProfileData();
  };

  onRefresh = () => {
    console.log("Start Refresh =====>");
    this.setState({ refreshing: true }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false }, () => {
          this.getProfileData();
        });
      }, 100);
    });
  };

  openActionSheet = (data) => {
    this.setState({ selectVideoData: data }, () => {
      if (this.ActionSheet) {
        this.ActionSheet.show();
      }
    });
  };

  getProfileData = () => {
    const {
      auth: { token },
      authActions: { setUserData, setEditdata, setToken },
      dispatch,
    } = this.props;
    if (token !== null && token !== undefined && token !== "") {
      this.setState({ pageLoad: true }, () => {
        getApiData(settings.endpoints.Me, "post", null, {
          Authorization: `Bearer ${token}`,
        })
          .then((responseJson) => {
            if (responseJson.success === true) {
              setEditdata(responseJson.data);

              if (responseJson.data && responseJson.data.paypalEmail) {
                dispatch(
                  change(
                    "sPaypal_Form",
                    "paypalEmail",
                    responseJson.data.paypalEmail
                  )
                );
              } else {
                dispatch(change("sPaypal_Form", "paypalEmail", ""));
              }

              this.setState(
                {
                  pageLoad: false,
                  data:
                    _.isObject(responseJson.data) &&
                    !_.isEmpty(responseJson.data)
                      ? responseJson.data
                      : {},
                },
                () => {
                  this.getVideoList();
                  setUserData(responseJson.data);
                  // this.getVideoList(true);
                }
              );
            } else if (
              _.isObject(responseJson) &&
              _.isObject(responseJson.data) &&
              _.isString(responseJson.data.name) &&
              responseJson.data.name === "Unauthorized" &&
              responseJson.status === 401
            ) {
              setToken("");
              dispatch(change("sPaypal_Form", "paypalEmail", ""));
              this.setState({ pageLoad: false, videoListLoad: false });
            } else {
              console.log("responseJson.success === false");
              this.setState({ pageLoad: false, videoListLoad: false });
            }
          })
          .catch((error) => {
            console.log(error);
            this.setState({ pageLoad: false, videoListLoad: false });
          });
      });
    } else {
      console.log("Token not set");
    }
  };

  goto = (page, data) => {
    const { navigation } = this.props;
    if (page === "Followers" || page === "Following") {
      navigation.navigate(page, { data: data.follower });
    } else {
      navigation.navigate(page);
    }
  };

  getVideoList = () => {
    const {
      auth: { token },
      authActions: { setToken },
    } = this.props;
    this.setState({ videoListLoad: true }, () => {
      getApiData(settings.endpoints.user_videos, "get", null, {
        Authorization: `Bearer ${token}`,
      })
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            this.setState({
              videoList:
                _.isObject(responseJson.data) &&
                _.isArray(responseJson.data.rows) &&
                responseJson.data.rows.length > 0
                  ? responseJson.data.rows
                  : [],
              videoListLoad: false,
            });
          } else if (
            _.isObject(responseJson) &&
            _.isObject(responseJson.data) &&
            _.isString(responseJson.data.name) &&
            responseJson.data.name === "Unauthorized" &&
            responseJson.status === 401
          ) {
            setToken("");
            this.setState({ videoListLoad: false, videoList: [] });
          } else {
            console.log("responseJson.success === false");
            this.setState({ videoListLoad: false, videoList: [] });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ videoListLoad: false, videoList: [] });
        });
    });
  };

  deleteVideo = () => {
    const {
      auth: { token },
      authActions: { setToken },
    } = this.props;
    const { selectVideoData } = this.state;
    const deleteVideoId = {
      video_id:
        _.isObject(selectVideoData) &&
        _.isString(selectVideoData.video_id) &&
        selectVideoData.video_id !== ""
          ? selectVideoData.video_id
          : "0",
    };

    console.log(token);
    console.log(deleteVideoId);
    this.setState({ videoListLoad: true }, () => {
      getApiData(settings.endpoints.delete_Video, "get", deleteVideoId, {
        Authorization: `Bearer ${token}`,
      })
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            this.getVideoList();
          } else if (
            _.isObject(responseJson) &&
            _.isObject(responseJson.data) &&
            _.isString(responseJson.data.name) &&
            responseJson.data.name === "Unauthorized" &&
            responseJson.status === 401
          ) {
            setToken("");
            this.setState({ videoListLoad: false });
          } else {
            console.log("responseJson.success === false");
            this.setState({ videoListLoad: false });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ videoListLoad: false });
        });
    });
  };

  renderMainSubView = () => {
    const { data, refreshing, videoListLoad } = this.state;
    const {
      authActions: { trans },
    } = this.props;

    const validUserName =
      _.isObject(data) && _.isString(data.username) && data.username !== ""
        ? data.username
        : "";
    const validFollowing =
      _.isObject(data) &&
      _.isObject(data.follower) &&
      _.isString(data.follower.following) &&
      data.follower.following !== ""
        ? data.follower.following
        : "";
    const validFollowers =
      _.isObject(data) &&
      _.isObject(data.follower) &&
      _.isString(data.follower.followers) &&
      data.follower.followers !== ""
        ? data.follower.followers
        : "";
    const validImage =
      _.isObject(data) && _.isString(data.photo) && data.photo !== ""
        ? data.photo
        : "";

    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: RFValue(5) }}
        refreshControl={
          <RefreshControl
            // tintColor={colors.brandDarkOrange} FOR IOS
            size={25}
            colors={[colors.brandAppBackColor]}
            onRefresh={this.onRefresh}
            refreshing={refreshing}
          />
        }
      >
        <View style={styles.profileSty}>
          <View style={styles.imgSty}>
            <Image
              source={{ uri: validImage }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[common.textH3, common.PT10, common.semiBold]}
          >
            {/* {validEmail} */}
            {validUserName}
          </Text>
        </View>
        <View style={styles.followerswrap}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.followingsty, styles.commonRightBorder]}
            onPress={() => {
              this.goto("Following", data);
            }}
          >
            <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>
              {validFollowing}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                common.textNormal,
                { color: "#0008", lineHeight: RFValue(20) },
              ]}
            >
              {trans("Profile_following_text")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.followingsty,
              // styles.commonRightBorder,
            ]}
            onPress={() => {
              this.goto("Followers", data);
            }}
          >
            <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>
              {validFollowers}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                common.textNormal,
                { color: "#0008", lineHeight: RFValue(20) },
              ]}
            >
              {trans("Profile_followers_text")}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={styles.followingsty}
            // onPress={() => { this.goto('UserWinner'); }}
          >
            <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>
            {validWinner}
            </Text>
            <Text numberOfLines={1} style={[common.textNormal, { color: '#0008', lineHeight: 20 }]}>Winner</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.btnwrap}>
          <View
            style={{
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CButton
              btnText={trans("Profile_edit_profile_btn_text")}
              btnStyle={{
                marginTop: RFValue(15),
                marginBottom: RFValue(20),
                // marginRight: RFValue(10),
              }}
              onPress={() => {
                this.goto("EditProfile");
              }}
            />
          </View>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.goto("AddBank");
            }}
          >
            <FIcon name="bank" size={20} style={styles.bankIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.goto("AddPaypal", data);
            }}
            style={{ marginLeft: 4 }}
          >
            <FIcon name="paypal" size={20} style={styles.bankIcon} />
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.iconwrap}>
        <Text
          numberOfLines={1}
          style={[common.textH4, common.semiBold, { color: colors.brandAppBackColor }]}
        >
          {'10 Videos'}
        </Text>
      </View> */}
        <View style={{ flex: 1 }}>
          {videoListLoad ? this.renderLoaderView() : this.renderVideoList()}
        </View>
      </ScrollView>
    );
  };

  renderLoaderView = () => (
    <View style={styles.CommonLoaderErrorViewSty}>
      <ActivityIndicator
        size="small"
        color={colors.brandAppBackColor}
        animating
      />
    </View>
  );

  renderErrorView = () => {
    const {
      authActions: { trans },
    } = this.props;
    return <CError errorText={trans("Profile_no_upload_video_text")} />;
  };

  renderVideoList = () => {
    const { videoList } = this.state;

    // if (_.isArray(videoList)) {
    return (
      <Row size={12} style={styles.RowStyle}>
        {_.isArray(videoList) && videoList.length > 0
          ? videoList.map((item, index) => (
              <Col
                key={`id_${index}`}
                sm={6}
                md={6}
                lg={6}
                style={{ paddingTop: RFValue(3) }}
              >
                <CProfileVideo
                  {...this.props}
                  data={item}
                  openActionSheet={(data) => {
                    this.openActionSheet(data);
                  }}
                />
              </Col>
            ))
          : this.renderErrorView()}
      </Row>

      // <CListView
      //   {...this.props}
      //   ref={(o) => {
      //     if (o && o.getWrappedInstance) {
      //       this.CListView = o.getWrappedInstance();
      //     }
      //   }}
      //   type="ProfileVideoList"
      //   colNo={3}
      //   key="Massager_List_listView_1"
      //   ErrorViewText="you haven\'t uploaded any video yet."
      //   refresh
      //   data={videoList}
      //   more={moreItems}
      //   onLoadMore={this.getVideoList}
      // />
    );
    // }
  };

  handleAction = (i) => {
    const { selectVideoData } = this.state;
    const {
      navigation,
      authActions: { trans },
    } = this.props;
    console.log("selectVideoData ==================>");
    console.log(selectVideoData);
    if (i === 0) {
      navigation.navigate("VideoList", {
        data: selectVideoData,
        type: "profile",
      });
    }
    if (i === 1) {
      if (_.isObject(selectVideoData) && !_.isEmpty(selectVideoData)) {
        let screenToDisplay = "MakePayment";
        if (
          _.lowerCase(trans("Free_Video_Posting")) === "yes" ||
          selectVideoData.video_payment === "0"
        ) {
          screenToDisplay = "FreePostConfirmation";
        }

        if (selectVideoData.able_to_part_again === 1) {
          CAlert(
            trans("Profile_re_add_confirmation_msg_text"),
            trans("confirm_alert_msg_title"),
            () => {
              navigation.navigate(screenToDisplay, {
                data: selectVideoData,
              });
            },
            () => {}
          );
        } else if (selectVideoData.video_status === "0") {
          navigation.navigate(screenToDisplay, {
            data: selectVideoData,
          });
        } else {
          CAlert(
            trans("Profile_already_added_video_msg_text"),
            trans("error_msg_title")
          );
        }
      } else {
        console.log("Not Object or Blank Object");
      }
    }
    if (i === 2) {
      CAlert(
        trans("Profile_delete_video_confirmation_msg_text"),
        trans("confirm_alert_msg_title"),
        () => {
          this.deleteVideo();
        },
        () => {}
      );
    }
    if (i === 3) {
      this.setState({ selectVideoData: {} }, () => {
        console.log(this.state.selectVideoData);
      });
    }
  };

  renderHeader = () => {
    const { pageLoad, data } = this.state;
    const {
      auth: { token },
      authActions: { trans },
    } = this.props;
    const validUserName =
      _.isObject(data) && _.isString(data.username) && data.username !== ""
        ? data.username
        : "";
    const headerName =
      token !== "" && token !== null
        ? validUserName
        : trans("Profile_page_title");
    const rightIconName = token !== "" && token !== null;

    if (!pageLoad) {
      return (
        <CHeader
          showBackArrow={false}
          showCenterText
          centerText={headerName}
          profileTab
          profileTabIcon="dots-three-horizontal"
          showRightText={rightIconName}
          ShowRightIcon
          // onBackAction={() => { }}
          // QrCodeAction={() => { }}
          onRightIconAction={() => {
            this.goto("PrivacySetting");
          }}
        />
      );
    }

    return null;
  };

  renderPromoBanners = () => {
    const {
      authActions: { trans },
    } = this.props;
    const { position, dataSource } = this.state;

    return (
      <Slideshow
        width={320}
        height={100}
        dataSource={dataSource}
        containerStyle={{
          alignItems: "center",
          justifyContent: "center",
          marginVertical: RFValue(10),
        }}
        position={position}
        onPositionChanged={(p) => this.setState({ position: p })}
        onPress={(imgObj) => {
          console.log(imgObj);
          Linking.openURL(imgObj.image.link);
        }}
      />
    );
  };

  render() {
    const { pageLoad } = this.state;
    const {
      auth: {
        adType: { admobUnitIdList },
      },
    } = this.props;
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {admobUnitIdList &&
          admobUnitIdList["banner_Profile_Id"][Platform.OS] && (
            <CBannerAd
              bannerId={admobUnitIdList["banner_Profile_Id"][Platform.OS]}
            />
          )}
        {this.renderPromoBanners()}
        {pageLoad ? this.renderLoaderView() : this.renderMainSubView()}
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
          onPress={this.handleAction}
        />
      </View>
    );
  }
}

Profile.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.func),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
};

Profile.defaultProps = {
  authActions: {},
  auth: {},
  navigation: {},
  dispatch: () => {},
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
