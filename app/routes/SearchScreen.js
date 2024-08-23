// import liraries
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import _ from "lodash";
import { RFValue } from "react-native-responsive-fontsize";
import IoIcon from "react-native-vector-icons/Ionicons";
import AIcon from "react-native-vector-icons/AntDesign";
import MIcon from "react-native-vector-icons/MaterialIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Column as Col, Row } from "react-native-flexbox-grid";
import FIcon from "react-native-vector-icons/FontAwesome";
import CHeader from "../components/CHeader";
import authActions from "../redux/reducers/auth/actions";
import { FORTAB } from "../config/MQ";
import CInput from "../components/CInput";
import colors from "../config/styles";
import CButton from "../components/CButton";
import common from "../config/genStyle";
import CListView from "../components/CListView";
import CError from "../components/CError";
import { getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import CLogin from "../components/CLogin";
import CPrivacyModal from "../components/CPrivacyModal";
import CTermsCondition from "../components/CTermsCondition";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

const iosWinnerText = Platform.OS === "ios" ? 25 : 23;

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  MainHeaderView: {
    width: "100%",
    height: FORTAB ? RFValue(70) : RFValue(55),
    backgroundColor: "#FFF",
    borderBottomColor: "#DCDCDC",
    borderBottomWidth: 1,
    marginBottom: RFValue(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(5),
    marginTop: 0,
  },
  InputViewSty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: RFValue(5),
    backgroundColor: "#FFF",
    // borderBottomColor: '#DCDCDC',
    // borderBottomWidth: 1,
    // borderWidth: 1,
    // borderColor: '#DCDCDC',
    // borderRadius: 5,
  },
  OtherViewSty: {
    width: "15%",
    marginLeft: RFValue(10),
    alignItems: "center",
    justifyContent: "center",
  },
  OtherIconSty: {
    fontSize: RFValue(20),
    color: colors.brandAppBackColor,
  },
  UserSty: {
    width: Dimensions.get("window").width / 2 - 10,
    height: Dimensions.get("window").width / 2 - 10,
    marginHorizontal: 1,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  WinnerTextViewSty: {
    position: "absolute",
    backgroundColor: "#0000",
    top: FORTAB ? 5 : -4,
    left: FORTAB ? -RFValue(40) : -RFValue(30),
    borderBottomColor: colors.brandAppBackColor,
    borderRightColor: "#0000",
    borderLeftColor: "#0000",
    borderLeftWidth: FORTAB ? RFValue(30) : RFValue(20),
    borderRightWidth: FORTAB ? RFValue(30) : RFValue(20),
    borderBottomWidth: FORTAB ? RFValue(30) : RFValue(20),
    paddingVertical: RFValue(10),
    paddingHorizontal: FORTAB ? RFValue(35) : RFValue(24),
    transform: [{ rotate: "315deg" }],
    zIndex: 10,
  },
  winnerTextSty: {
    position: "absolute",
    top: FORTAB ? RFValue(26) : RFValue(iosWinnerText),
    left: -1,
    color: "#FFF",
    width: FORTAB ? RFValue(80) : RFValue(52),
    textAlign: "center",
    flexWrap: "wrap",
    letterSpacing: 0.5,
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: RFValue(10),
  },
  imgSty: {
    width: "100%",
    height: "100%",
  },
  oViewSty: {
    flexDirection: "row",
    position: "absolute",
    bottom: 3,
    left: 3,
    alignItems: "center",
  },
  AIconSty: {
    fontSize: RFValue(15),
    color: "#FFF",
  },
  voteNoText: {
    color: "#FFF",
    marginLeft: 3,
    marginBottom: -3,
  },
  RowStyle: {
    flex: 1,
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
  },
});

// create a component
class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      showUser: true,
      pageLoad: true,
      refreshing: false,
      searchBtnLoad: false,
      moreItems: true,
      page: 1,
      userList: [],
      videoList: [],
      moreVideoItems: true,
      videoPage: 1,
      visible: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );
    this.getUserData();
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  };

  onRefresh = () => {
    console.log("Start Refresh =====>");
    this.setState({ refreshing: true }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false }, () => {});
      }, 100);
    });
  };

  getVideoList = (bool) => {
    const {
      auth: { token },
    } = this.props;
    const { searchText } = this.state;

    let url;
    if (token === "") {
      url = settings.endpoints.getGuestVideo;
    } else {
      url = settings.endpoints.getVideos;
    }

    let { videoPage, moreVideoItems, videoList } = this.state;

    if (bool === true) {
      this.setState({
        pageLoad: true,
        moreVideoItems: true,
        videoPage: 1,
        videoList: [],
        searchBtnLoad: true,
      });
      videoPage = 1;
      moreVideoItems = true;
      videoList = [];
    }

    const sText =
      _.isString(searchText) && searchText !== "" ? searchText : null;
    console.log(sText);

    getApiData(
      url,
      "get",
      {
        q: sText,
        per_page: 20,
        page: videoPage,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
      .then((responseJson) => {
        console.log(responseJson);
        if (this.VideoCListView && this.VideoCListView.loadingpage === true) {
          this.VideoCListView.removeLoader();
        }
        if (responseJson.success === true) {
          let pageNo = videoPage;
          let nMoreItems = moreVideoItems;
          let nDummyData = videoList;

          if (
            _.isObject(responseJson.data) &&
            _.isArray(responseJson.data.rows)
          ) {
            nDummyData = nDummyData.concat(responseJson.data.rows);
          }

          if (
            _.isObject(responseJson.data) &&
            _.isObject(responseJson.data.pagination) &&
            responseJson.data.pagination.totalPage > 0
          ) {
            if (responseJson.data.pagination.totalPage > videoPage) {
              nMoreItems = true;
              pageNo = videoPage + 1;
            } else {
              nMoreItems = false;
            }
          }

          this.setState({
            videoList: nDummyData,
            videoPage: pageNo,
            moreVideoItems: nMoreItems,
            pageLoad: false,
            searchBtnLoad: false,
          });
        } else {
          if (this.VideoCListView && this.VideoCListView.loadingpage === true) {
            this.VideoCListView.removeLoader();
          }
          this.setState(
            { pageLoad: false, videoList: [], searchBtnLoad: false },
            () => {
              console.log(responseJson.errors);
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        if (this.VideoCListView && this.VideoCListView.loadingpage === true) {
          this.VideoCListView.removeLoader();
        }
        this.setState(
          { pageLoad: false, videoList: [], searchBtnLoad: false },
          () => {
            console.log("Something Went wrong");
          }
        );
      });
  };

  getUserData = (bool) => {
    const {
      auth: { token },
    } = this.props;
    const { searchText } = this.state;

    let { page, moreItems, userList } = this.state;

    if (bool === true) {
      this.setState({
        pageLoad: true,
        moreItems: true,
        page: 1,
        userList: [],
        searchBtnLoad: true,
      });
      page = 1;
      moreItems = true;
      userList = [];
    }

    const sText = _.isString(searchText) && searchText !== "" ? searchText : "";
    // console.log(sText);

    getApiData(
      settings.endpoints.getSearch,
      "get",
      {
        page,
        q: sText,
      },
      null
    )
      .then((responseJson) => {
        console.log(responseJson);
        if (this.CListView && this.CListView.loadingpage === true) {
          this.CListView.removeLoader();
        }
        if (responseJson.success === true) {
          let pageNo = page;
          let nMoreItems = moreItems;
          let nDummyData = userList;

          if (
            _.isObject(responseJson.data) &&
            _.isArray(responseJson.data.rows)
          ) {
            nDummyData = nDummyData.concat(responseJson.data.rows);
          }

          if (
            _.isObject(responseJson.data) &&
            _.isObject(responseJson.data.pagination) &&
            responseJson.data.pagination.totalPage > 0
          ) {
            if (responseJson.data.pagination.totalPage > page) {
              nMoreItems = true;
              pageNo = page + 1;
            } else {
              nMoreItems = false;
            }
          }

          this.setState({
            userList: nDummyData,
            page: pageNo,
            moreItems: nMoreItems,
            pageLoad: false,
            searchBtnLoad: false,
          });
        } else {
          if (this.CListView && this.CListView.loadingpage === true) {
            this.CListView.removeLoader();
          }
          this.setState(
            { pageLoad: false, userList: [], searchBtnLoad: false },
            () => {
              console.log(responseJson.errors);
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        if (this.CListView && this.CListView.loadingpage === true) {
          this.CListView.removeLoader();
        }
        this.setState(
          { searchBtnLoad: false, pageLoad: false, userList: [] },
          () => {
            console.log("Something Went wrong");
          }
        );
      });
  };

  getDataList = () => {
    const { showUser } = this.state;
    Keyboard.dismiss();

    if (showUser) {
      this.getUserData(true);
    } else {
      this.getVideoList(true);
    }
  };

  changeSearchText = (val) => {
    const { showUser } = this.state;

    this.setState({ searchText: val }, () => {
      if (this.state.searchText === "") {
        if (showUser) {
          this.getUserData(true);
        } else {
          this.getVideoList(true);
        }
      } else if (showUser) {
        this.getUserData(true);
      } else {
        this.getVideoList(true);
      }
    });
  };

  backAction = () => {
    const {
      navigation,
    } = this.props;
    navigation.pop();
  };

  renderHeaderView = () => {
    const {
      authActions: { trans },
    } = this.props;
    const { searchText, showUser, searchBtnLoad } = this.state;
    return (
      <View style={styles.MainHeaderView}>
        {/* <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
          keyboardShouldPersistTaps="handled"
        > */}

        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            width: "10%",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={this.backAction}
        >
          <IoIcon
            name="ios-arrow-round-back"
            style={{ fontSize: RFValue(FORTAB ? 35 : 30), color: "#000" }}
          />
        </TouchableOpacity>

        <View style={styles.InputViewSty}>
          <CInput
            // leftIcon
            // searchIcon
            placeholder={
              showUser
                ? trans("search_user_placeholder")
                : trans("search_video_placeholder")
            }
            ref={(o) => {
              this.searchInput = o;
            }}
            onChangeText={(t) => {
              this.changeSearchText(t);
            }}
            value={searchText}
            onSubmitEditing={this.getDataList}
            returnKeyType="go"
            selectionColor="#0009"
            blurOnSubmit={false}
            inputStyle={{ borderBottomWidth: 0 }}
          />
        </View>

        <View style={[styles.OtherViewSty, { width: "12%" }]}>
          {searchText.length > 0 ? (
            <CButton
              // btnText="GO"
              showSearchIcon
              textStyle={{ fontSize: RFValue(14) }}
              onPress={this.getDataList}
              load={searchBtnLoad}
            />
          ) : showUser ? (
            <FIcon
              name="video-camera"
              style={styles.OtherIconSty}
              onPress={() => {
                this.setState({ showUser: false });
              }}
            />
          ) : (
            <FIcon
              name="user"
              style={styles.OtherIconSty}
              onPress={() => {
                this.setState({ showUser: true });
              }}
            />
          )}
        </View>
        {/* </KeyboardAwareScrollView> */}
      </View>
    );
  };

  renderUserListView = () => {
    const { userList, refreshing, moreItems } = this.state;
    const {
      navigation,
      authActions: { trans },
    } = this.props;
    const onFbAction = navigation.getParam("onFbAction");
    const onGoogleAction = navigation.getParam("onGoogleAction");

    if (_.isArray(userList) && userList.length > 0) {
      return (
        <View
          style={{
            flex: 1,
            paddingBottom: RFValue(5),
            paddingHorizontal: RFValue(8),
          }}
        >
          <CListView
            {...this.props}
            ref={(o) => {
              this.CListView = o;
            }}
            type="SearchUserList"
            ErrorViewText="user list not available"
            refresh
            data={userList}
            onRefresh={() => {
              this.getUserData(true);
            }}
            more={moreItems}
            onLoadMore={this.getUserData}
            getNotification={() => this.getUserData(true)}
            onFbAction={onFbAction}
            onGoogleAction={onGoogleAction}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <MIcon name="search" style={{ fontSize: 50, color: "#D3D3D3" }} />
        <Text
          style={[
            common.textH1,
            common.semiBold,
            { marginVertical: RFValue(8), textAlign: "center" },
          ]}
        >
          {"Discover"}
        </Text>
        <Text style={[common.textNormal, { textAlign: "center" }]}>
          {trans("search_user_subtitle")}
        </Text>
      </View>
    );
  };

  renderVideoListView = () => {
    const { videoList, refreshing, moreVideoItems } = this.state;
    const {
      navigation,
      authActions: { trans },
    } = this.props;
    const onFbAction = navigation.getParam("onFbAction");
    const onGoogleAction = navigation.getParam("onGoogleAction");

    if (_.isArray(videoList) && videoList.length > 0) {
      return (
        <View
          style={{ flex: 1, paddingBottom: RFValue(5), paddingHorizontal: 8 }}
        >
          <CListView
            {...this.props}
            ref={(o) => {
              this.VideoCListView = o;
            }}
            type="SearchVideoList"
            // ErrorViewText={'Video list not available'}
            refresh
            data={videoList}
            onRefresh={() => {
              this.getVideoList(true);
            }}
            more={moreVideoItems}
            colNo={2}
            onLoadMore={this.getVideoList}
            getNotification={() => this.getVideoList(true)}
            onFbAction={onFbAction}
            onGoogleAction={onGoogleAction}
            openModal={this.openModal}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <MIcon
          name="search"
          style={{ fontSize: RFValue(50), color: "#D3D3D3" }}
        />
        <Text
          style={[
            common.textH1,
            common.semiBold,
            { marginVertical: RFValue(8), textAlign: "center" },
          ]}
        >
          {"Discover"}
        </Text>
        <Text style={[common.textNormal, { textAlign: "center" }]}>
          {trans("search_video_subtitle")}
        </Text>
      </View>
    );
  };

  openModal = () => {
    this.setState({ visible: true });
  };

  handleModal = (type) => {
    if (type === "login") {
      this.setState({ visible: false });
    } else if (type === "privacy") {
      this.setState({ visible: false }, () => {
        if (this.CPrivacyModal) {
          this.CPrivacyModal.openModal();
        }
      });
    } else if (type === "terms") {
      this.setState({ visible: false }, () => {
        if (this.CTermsCondition) {
          this.CTermsCondition.openModal();
        }
      });
    }
  };

  handleSocial = (type) => {
    const { navigation } = this.props;
    const {
      state: { params },
    } = navigation;
    if (type === "fb") {
      this.setState({ visible: false }, () => {
        params.onFbAction();
      });
    } else {
      this.setState({ visible: false }, () => {
        params.onGoogleAction();
      });
    }
  };

  render() {
    const { showUser, pageLoad, visible } = this.state;

    if (pageLoad) {
      return (
        <View style={styles.container}>
          {this.renderHeaderView()}
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator
              size="small"
              color={colors.brandAppBackColor}
              animating
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderHeaderView()}
        {showUser ? this.renderUserListView() : this.renderVideoListView()}

        <CLogin
          {...this.props}
          modalVisible={visible}
          closeModal={() => this.handleModal("login")}
          openTermsConditionModal={() => this.handleModal("terms")}
          openPrivacyModal={() => this.handleModal("privacy")}
          onFbAction={() => this.handleSocial("fb")}
          onGoogleAction={() => this.handleSocial("google")}
        />

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
          loginModal={this.openModal}
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
          loginModal={this.openModal}
        />
      </View>
    );
  }
}

SearchScreen.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.func),
  navigation: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
};

SearchScreen.defaultProps = {
  authActions: {},
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
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
