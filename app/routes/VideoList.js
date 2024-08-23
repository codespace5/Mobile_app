// import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  AsyncStorage,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IoIcon from 'react-native-vector-icons/Ionicons';
import CVideo from '../components/CVideo';
import { CAlert } from '../components/CAlert';
import colors from '../config/styles';
import { FORTAB } from '../config/MQ';
import authActions from '../redux/reducers/auth/actions';
import { getApiData } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import CLoader from '../components/CLoader';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';
import Device from 'react-native-device-info';
import { isIphoneX } from 'react-native-iphone-x-helper';

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000',
    position: 'relative',
  },
  tempSty: {
    flexGrow: 1,
  },
  UserTextSty: {
    lineHeight: 20,
    letterSpacing: 0.3,
    color: '#FFF',
  },
  tobTabBarView: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: '#0000',
    zIndex: 10,
    height: FORTAB ? 70 : 55,
  },
  IconStyles: {
    fontSize: FORTAB ? 35 : 30,
    color: '#FFF',
  },
  TobBarMainView: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    borderBottomWidth: 2,
  },
  BottomTabViewSty: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // borderTopWidth: 1,
    // borderTopColor: '#8e8e93',
    paddingVertical: 7,
  },
  BottomTabView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  TabIconSty: {
    fontSize: RFValue(18),
    color: '#FFF',
  },
  BottomTabTitle: {
    fontSize: RFValue(10),
    fontFamily: colors.fonts.proximaNova.semiBold,
    color: '#FFF',
    marginTop: 4,
    textAlign: 'center',
  },
  addIconSty: {
    fontSize: RFValue(10),
    color: '#FFF',
  },
  AddViewSty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.brandAppBackColor,
    width: '60%',
    paddingVertical: 8,
  },
  CommonLoaderErrorViewSty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// create a component
class VideoList extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      videoDetail: {},
      loading: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.videoDetails) {
      this.replaceVideoData(nextProps.auth.videoDetails);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    const { auth: { userOtherData }, navigation } = this.props;
    const userId = _.isObject(userOtherData) && !_.isEmpty(userOtherData) && userOtherData.user_id ? userOtherData.user_id : '';
    const videoData = navigation.getParam('data');
    // console.log("On will focus ", videoData);
    setLeaveBreadcrumb(payload);

    if (_.isObject(videoData) && (videoData.video_id || videoData.data.video_id)) {
      let vid = videoData.video_id;
      if (videoData.data && videoData.data.video_id) {
        vid = videoData.data.video_id;
      }
      this.getVideoData(vid);
    } else {
      this.getVideoData(userId);
    }
  }

  handleBackPress = async () => {
    const { navigation } = this.props;
    try {
      const value = await AsyncStorage.getItem('activeScreen');
      if (value !== null) {
        if (value === 'Home') {
          BackHandler.exitApp();
        } else {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  replaceVideoData = (vDetail) => {
    const { videoDetail } = this.state;
    if (_.isObject(videoDetail) && _.isArray(vDetail) && _.isObject(vDetail[0])) {
      let nVideoDetail;
      if (videoDetail.video_id === vDetail[0].video_id) {
        // eslint-disable-next-line prefer-destructuring
        nVideoDetail = vDetail[0];
      }

      this.setState({ videoDetail: nVideoDetail }, () => {
        console.log(videoDetail);
      });
    }
  }

  getVideoData = (vid) => {
    const { auth: { token }, authActions: { trans } } = this.props;

    const headers = {
      authorization: `Bearer ${token}`,
    };

    let url;
    if (token === '') {
      url = settings.endpoints.getGuestVideo;
    } else {
      url = settings.endpoints.getVideos;
    }

    const detail = {
      video_id: vid,
    };

    this.setState({ loading: true }, () => {
      getApiData(url, 'get', detail, headers).then((response) => {
        if (response.success) {
          if (_.isObject(response.data)
            && _.isArray(response.data.rows)
            && response.data.rows.length > 0) {
            if (_.isObject(response.data)
              && _.isArray(response.data.rows)
              && response.data.rows.length > 0 && response.data.rows[0] && response.data.rows[0].blocked) {
              CAlert(trans('Video_Unblock_user_to_watch'), trans('error_msg_title'), () => {
                this.setState({ loading: false, videoDetail: {} }, () => {
                  this.props.navigation.pop();
                });
              });
            } else {
              this.setState({
                loading: false,
                videoDetail: _.isObject(response.data)
                    && _.isArray(response.data.rows)
                    && response.data.rows.length > 0 ? response.data.rows[0] : {},
              });
            }
          } else {
            CAlert(trans('Video_NO_Longer_Available'), trans('error_msg_title'), () => {
              this.setState({ loading: false, videoDetail: {} }, () => {
                this.props.navigation.pop();
              });
            });
          }
        } else {
          CAlert(response.message, trans('error_msg_title'), () => {
            this.setState({ videoDetail: {}, loading: false });
          });
        }
      }).catch((err) => {
        console.log(err);
        this.setState({ videoDetail: {}, loading: false });
      });
    });
  }


  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  renderBottomTabBar = () => (
    <View style={styles.BottomTabViewSty}>
      <Text numberOfLines={1} style={styles.BottomTabTitle}>
        {/* {'Im not perfect but judge me when you are perfect..'} */}
      </Text>
    </View>
  )

  renderTopTabBar = () => {
    const { navigation } = this.props;
    return (
      <View style={styles.tobTabBarView}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            width: '15%',
            height: FORTAB ? 70 : 55,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 0,
          }}
          onPress={() => { navigation.goBack(); }}
        >
          <IoIcon name="ios-arrow-round-back" style={styles.IconStyles} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { navigation, onFbAction, onGoogleAction } = this.props;
    const { videoDetail, loading } = this.state;
    const { state: { params } } = navigation;
    const type = navigation.getParam('type');
    const videoData = navigation.getParam('data');
    const retDataFunc = videoData.retrieveData ? videoData.retrieveData : () => {};

    if (loading) {
      return <CLoader contentStyle={{ backgroundColor: '#000' }} />;
    }

    return (
      <View style={styles.container}>
        {this.renderTopTabBar()}
        <View style={{ flex: 1, backgroundColor: '#0000' }}>
          <CVideo
            {...this.props}
            ref={(o) => { this.videoList = o; }}
            data={_.isObject(videoDetail) && !_.isEmpty(videoDetail) ? videoDetail : {}}
            vKey={_.isObject(videoDetail) && _.isString(videoDetail.video_id) ? videoDetail.video_id : 0}
            type={type || 'videoList'}
            // loginModal={() => params.openModal()}
            loginModal={() => {
              if (_.isFunction(params.openModal)) {
                params.openModal();
              }
            }}
            onFbAction={onFbAction}
            onGoogleAction={onGoogleAction}
            retrieveData={retDataFunc}
          />
        </View>
        {this.renderBottomTabBar()}
      </View>
    );
  }
}

VideoList.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  onFbAction: PropTypes.func,
  onGoogleAction: PropTypes.func,
};

VideoList.defaultProps = {
  authActions: {},
  auth: {},
  navigation: {},
  onFbAction: () => null,
  onGoogleAction: () => null,
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoList);
