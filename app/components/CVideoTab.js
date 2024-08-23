import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import IoIcon from "react-native-vector-icons/Ionicons";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import colors from "../config/styles";
import { getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import CButton from "./CButton";
import authActions from "../redux/reducers/auth/actions";
import homeActions from "../redux/reducers/home/actions";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  noDataText: {
    // flex: 1,
    height,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // backgroundColor: '#808080',
  },
  noVideoText: {
    fontSize: RFValue(20),
    color: "#FFF",
  },
  loaderView: {
    height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  nullView: {
    height: 0,
    width: 0,
  },
});

class CVideoTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      videoList: [],
      page: 1,
      refreshing: false,
    };
    this.initialLoaded = false;
  }

  componentDidMount() {
    const { currentTab, tabID } = this.props;
    if (tabID === currentTab) {
      this.getVideos();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      auth: { videoDetails },
      currentTab,
      tabID,
    } = this.props;
    if (!_.isEqual(nextProps.auth.videoDetails, videoDetails)) {
      this.replaceVideoData(nextProps.auth.videoDetails);
      // this.setData(currentTabActivePage, currentTab);
      // this.videoListRef.scrollToIndex({animated: true, index: currentTabActivePage });
    }

    if (
      !_.isEqual(this.props.auth.country, nextProps.auth.country) ||
      !_.isEqual(this.props.auth.forceLoad, nextProps.auth.forceLoad)
    ) {
      console.log("apiHelper Country is not same so call getvideos ==> ");
      this.stopCurrentVideo();
      this.setState({ videoList: [], loading: true }, () => {
        this.getVideos();
      });
    } else if (!this.initialLoaded) {
      if (
        !_.isEqual(currentTab, nextProps.currentTab) &&
        tabID === nextProps.currentTab
      ) {
        this.getVideos();
      }
    }

    // if (!_.isEqual(nextProps.auth.userOtherData, auth.userOtherData)) {
    //   console.log('in cvideo tab blank state');
    //   this.blankVideoState();
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { active } = this.props;
    if (
      !_.isEqual(nextProps.active, active) ||
      !_.isEqual(this.state, nextState)
    ) {
      return true;
    }
    return false;
  }

  stopCurrentVideo = () => {
    const {
      currentTab,
      tabPageIds,
      tabID,
      type,
      auth: { isHomePlayIndex, isTop100PlayIndex },
    } = this.props;
    if (currentTab === tabID) {
      if (_.isArray(this.videoList) && _.isArray(this.videoList[currentTab])) {
        const currentTabActivePage = tabPageIds[currentTab - 1];
        if (
          !_.isUndefined(this.videoList[currentTab][currentTabActivePage]) &&
          !_.isNull(this.videoList[currentTab][currentTabActivePage])
        ) {
          this.videoList[currentTab][currentTabActivePage].stopVideo(true);
        }
      }
    }
  };

  setScrollPosition = () => {
    const { currentTab, tabPageIds } = this.props;
    // console.log(`setScrollPosition ==> ${sTab} = ${currentTab}`);
    // if (_.toNumber(sTab) === _.toNumber(currentTab)) {
    // console.log('Resetting scroll To index ====> ');
    const currentTabActivePage = tabPageIds[currentTab - 1];
    // console.log(`Resetting scroll To index ====> ${currentTabActivePage}`);
    if (_.toNumber(currentTabActivePage) > 0) {
      // setTimeout(() => {
      try {
        this.videoListRef.scrollToIndex({
          animated: false,
          index: _.toNumber(currentTabActivePage),
          viewPosition: 0.5,
        });
      } catch (error) {
        console.log(error);
      }
      // }, 1000);
    }
    // }
  };

  replaceVideoData = (videoDetails) => {
    // console.log('in is not equal ===>>>');
    const { videoList } = this.state;
    // const nVideoList = JSON.parse(JSON.stringify(videoList));
    if (
      _.isArray(videoList) &&
      _.isArray(videoDetails) &&
      _.isObject(videoDetails[0])
    ) {
      // eslint-disable-next-line
      const nVideoList = videoList.map((ele) => {
        if (ele.video_id === videoDetails[0].video_id) {
          return videoDetails[0];
        }
        return ele;
      });

      this.setState({ videoList: nVideoList });
    }
  };

  onRefresh = () => {
    console.log("Start Refresh =====>");
    this.stopCurrentVideo();
    this.setState({ refreshing: true, videoList: [], page: 1 }, () => {
      this.getVideos();
    });
  };

  // setVideoData = () => {
  //   this.onRefresh();
  // }

  getVideos = (loadMore) => {
    const {
      auth: { token },
      tabID,
      setTabData,
      type,
    } = this.props;

    this.initialLoaded = true;
    console.log("getVideos ====> ", token);

    const { page, isMore, videoList } = this.state;
    let url;
    let detail = {};
    let pg = page;

    if (loadMore) {
      pg = page + 1;
    } else {
      pg = 1;
      this.stopCurrentVideo();
      this.setState({ videoList: [], loading: true });
    }

    if (token === "") {
      url = settings.endpoints.getGuestVideo;
      detail = {
        page: pg,
        type,
      };
    } else {
      url = settings.endpoints.getVideos;
      detail = {
        page: pg,
        type,
      };
    }

    const headers = {
      authorization: `Bearer ${token}`,
    };
    this.setState(loadMore ? { loading: false } : { loading: true }, () => {
      // setCountry(false);
      const dummyData = { change: false };
      // setCountry(dummyData);
      getApiData(url, "get", detail, headers)
        .then((response) => {
          let PG = false;
          let dummyData = videoList;
          // console.log('after store videolist in dummy data ====>>>');
          // console.log(dummyData);
          if (response.success === true) {
            if (
              _.isObject(response.data) &&
              _.isArray(response.data.rows) &&
              response.data.rows.length > 0
            ) {
              setTabData(response.data.rows[0].live_category_price);
            }

            if (isMore) {
              if (
                _.isObject(response.data) &&
                _.isArray(response.data.rows) &&
                response.data.rows.length > 0
              ) {
                if (
                  _.isObject(response.data) &&
                  _.isArray(response.data.rows)
                ) {
                  const { pagination, rows } = response.data;
                  dummyData = videoList.concat(rows);
                  // console.log('after merge data =====>>>>>');
                  // console.log(dummyData);
                  if (_.isObject(pagination)) {
                    PG = pagination.isMore;
                  }
                }
              } else {
                this.setState({
                  videoList,
                  loading: false,
                  isMore: PG,
                  page: pg,
                });
              }
            } else if (
              _.isObject(response.data) &&
              _.isArray(response.data.rows) &&
              response.data.rows.length > 0
            ) {
              dummyData = response.data.rows;
              if (_.isObject(response.data.pagination)) {
                PG = response.data.pagination.isMore;
              }
            } else {
              this.setState({
                videoList: dummyData,
                loading: false,
                isMore: PG,
                page: pg,
                refreshing: false,
              });
            }

            this.setState(
              {
                videoList: dummyData,
                loading: false,
                isMore: PG,
                page: pg,
                refreshing: false,
              },
              () => {
                console.log(videoList);
              }
            );
            // console.log('after set state dummy data =====>>>');
            // console.log(dummyData);
            // console.log(videoList);
          } else {
            this.setState({
              videoList: dummyData,
              loading: false,
              refreshing: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.stopCurrentVideo();
          this.setState({ videoList: [], loading: false, refreshing: false });
        });
    });
  };

  renderLoading = () => {
    const { active } = this.props;
    return (
      <View style={active ? styles.loaderView : styles.nullView}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  };

  renderNoData = () => {
    const {
      authActions: { trans },
      retrieveData,
    } = this.props;
    return (
      <View style={styles.noDataText}>
        <IoIcon
          name="md-videocam"
          style={{ fontSize: RFValue(25), color: "#FFF" }}
        />
        <Text style={styles.noVideoText}>
          {trans("CVideoTab_no_video_text")}
        </Text>
        <Text
          style={[
            styles.noVideoText,
            { fontSize: RFValue(14), textAlign: "center", width: "90%" },
          ]}
        >
          {trans("CVideoTab_no_video_text1")}
        </Text>
        {trans("HOME_CHANGE_COUNTRY_BTN_TEXT") !== "" &&
          trans("HOME_CHANGE_COUNTRY_BTN_TEXT") !== "blank" && (
            <CButton
              btnText={trans("HOME_CHANGE_COUNTRY_BTN_TEXT")}
              btnStyle={{
                marginTop: 15,
                width: 200,
              }}
              onPress={() => {
                retrieveData("Country");
              }}
            />
          )}
      </View>
    );
  };

  setSeenAd = (vId) => {
    const { videoList } = this.state;
    _.map(videoList, (v, k) => {
      if (v.video_id === vId) {
        const newList = [...videoList];
        newList.splice(k, 1, {
          ...v,
          advertise: { ...v.advertise, ad_show: false },
        });
        this.setState({ videoList: newList });
      }
    });
  };

  render() {
    const {
      renderItem,
      changeVideo,
      active,
      tabID,
      onTabVideoChange,
      type,
      tabPageIds,
      currentTab,
      authActions: { setTop100PlayIndex, setHomePlayIndex },
    } = this.props;
    const { loading, videoList, refreshing } = this.state;

    // console.log('Render: Component will receive props for CVideoTab ===> ', tabID);
    return (
      <FlatList
        bounces={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        pagingEnabled
        data={videoList}
        ref={(o) => {
          this.videoListRef = o;
        }}
        renderItem={(item, index) => renderItem(item, tabID)}
        initialNumToRender={5}
        keyExtractor={(item) => `vli_${item.video_id}`}
        onViewableItemsChanged={changeVideo}
        onMomentumScrollEnd={onTabVideoChange}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        // onScrollEndDrag={() => {  }}
        ListEmptyComponent={
          loading ? this.renderLoading() : this.renderNoData()
        }
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#0000" }}
        style={active ? null : styles.nullView}
        // removeClippedSubviews
        windowSize={20}
        // maxToRenderPerBatch={4}
        // updateCellsBatchingPeriod={100}
        refreshControl={
          <RefreshControl
            // tintColor={colors.brandDarkOrange} // FOR IOS
            size={25}
            colors={[colors.brandAppBackColor]}
            onRefresh={this.onRefresh}
            refreshing={refreshing}
          />
        }
        onEndReached={() => this.getVideos(true)}
        onEndReachedThreshold={3}
      />
    );
  }
}

CVideoTab.propTypes = {
  renderItem: PropTypes.func,
  changeVideo: PropTypes.func,
  onTabVideoChange: PropTypes.func,
  active: PropTypes.bool,
  auth: PropTypes.objectOf(PropTypes.any),
  tabID: PropTypes.number,
  setTabData: PropTypes.func,
  authActions: PropTypes.objectOf(PropTypes.any),
  currentTab: PropTypes.number,
  tabPageIds: PropTypes.arrayOf(PropTypes.number),
};

CVideoTab.defaultProps = {
  renderItem: () => null,
  changeVideo: () => null,
  onTabVideoChange: () => null,
  active: false,
  auth: {},
  tabID: 0,
  setTabData: () => null,
  authActions: {},
  currentTab: 1,
  tabPageIds: [0, 0],
};

function mapStateToProps(state) {
  const { home } = state;
  return {
    auth: state.auth,
    currentTab: home.currentTab,
    tabPageIds: home.tabPageIds,
  };
}

function mapDispatchToProps(dispatch) {
  const { setTabData } = homeActions;
  return {
    authActions: bindActionCreators(authActions, dispatch),
    setTabData: bindActionCreators(setTabData, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(CVideoTab);
