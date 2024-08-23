// import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Share,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _, { toInteger } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionSheet from 'react-native-actionsheet';
// import AIcon from 'react-native-vector-icons/AntDesign';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import CHeader from '../components/CHeader';
import CProfileVideo from '../components/CProfileVideo';
import CButton from '../components/CButton';
// import images from '../config/images';
import common from '../config/genStyle';
import colors from '../config/styles';
import authActions from '../redux/reducers/auth/actions';
import { getApiData, getApiDataProgress } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import CError from '../components/CError';
import CLogin from '../components/CLogin';
import CPrivacyModal from '../components/CPrivacyModal';
import CTermsCondition from '../components/CTermsCondition';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';
import { CAlert } from '../components/CAlert';
import CBannerAd from '../components/CBannerAd';
import CRewardAd from '../components/CRewardAd';

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imgSty: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profileSty: {
    paddingTop: 25,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followerswrap: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followingsty: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnwrap: {
    width: '50%',
    alignSelf: 'center',
  },
  iconwrap: {
    width: '100%',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonRightBorder: {
    borderRightColor: colors.brandAppTextGrayColor,
    borderRightWidth: 1,
  },
  RowStyle: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  UserSty: {
    width: '98%',
    height: 150,
    marginLeft: 1,
    position: 'relative',
  },
  CommonLoaderErrorViewSty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const actionSheetSty = {
  titleBox: {
    height: 50,
  },
  titleText: {
    color: '#000',
    fontSize: RFValue(12),
  },
  buttonText: {
    fontSize: RFValue(12),
    fontFamily: colors.fonts.proximaNova.regular,
  },
};

// create a component
class OtherUserProfile extends Component {
  static navigationOptions = {
    header: null,
  };
  // eslint-disable-next-line lines-between-class-members
  constructor(props) {
    super(props);
    const {
      authActions: { trans },
    } = this.props;
    this.state = {
      videoList: [],
      pageLoad: true,
      videoListLoad: true,
      refreshing: false,
      data: {},
      buttonLoad: false,
      buttonName: '',
      visible: false,
      rewardAdShow: false,
    };

    this.ActionSheetOptions = {
      CANCEL_INDEX: 2,
      DESTRUCTIVE_INDEX: 2,
      options: [
        trans('Profile_share_option_text'),
        trans('Profile_block_option_text'),
        trans('Profile_cancel_option_text'),
      ],
      title: '',
    };
  }

  componentDidMount = () => {
    const {
      navigation,
      auth: { userId },
      authActions: { trans },
    } = this.props;
    this.onWillFocusSubscription = navigation.addListener(
      'willFocus',
      this.onWillFocus,
    );
    this.getProfileData();

    const { user_id } = this.getDataObj();
    if (user_id === userId) {
      this.ActionSheetOptions = {
        CANCEL_INDEX: 1,
        DESTRUCTIVE_INDEX: 1,
        options: [
          trans('Profile_share_option_text'),
          trans('Profile_cancel_option_text'),
        ],
        title: '',
      };
    }
    this.didFocusSubscription = navigation.addListener(
      'didFocus',
      this.onDidFocus,
    );
  };

  componentWillUnmount = () => {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
  };

  onDidFocus = (payload) => {
    const {
      auth: { adType },
    } = this.props;
    // this.getProfileData();
    setTimeout(() => {
      this.setState({ rewardAdShow: true });
    }, _.toInteger(adType.Reward_timeOut));
  };

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  };

  // it's call two time that's why remove this code
  componentWillReceiveProps(nextProps) {
    const { navigation } = this.props;
    const oldData = navigation.getParam('data');
    const newData = nextProps.navigation.getParam('data');
    if (!_.isEqual(newData, oldData)) {
      this.setState({ pageLoad: true }, () => {
        setTimeout(() => {
          this.getProfileData();
        }, 1000);
      });
    }
  }

  onRefresh = () => {
    console.log('Start Refresh =====>');
    this.setState({ refreshing: true }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false }, () => {
          this.getProfileData();
        });
      }, 100);
    });
  };

  doFollow = () => {
    const {
      auth: { token },
      authActions: { trans },
      navigation,
    } = this.props;
    const { buttonName } = this.state;
    console.log(token);
    const FollowBtn = trans('OtherUserProfile_follow_btn_text');
    const FollowingBtn = trans('OtherUserProfile_following_btn_text');
    const { user_id } = this.getDataObj();

    this.setState({ buttonLoad: true }, () => {
      getApiDataProgress(
        `${settings.endpoints.do_follow}?user_id=${user_id}`,
        'get',
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      )
        .then((responseJson) => {
          if (responseJson.success === true) {
            this.getProfileData();
            this.setState({
              buttonLoad: false,
              buttonName:
                buttonName === FollowingBtn ? FollowBtn : FollowingBtn,
            });
          } else {
            console.log('responseJson.success === false');
            this.setState({
              buttonLoad: false,
              buttonName: FollowBtn,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            buttonName: FollowBtn,
            buttonLoad: false,
          });
        });
    });
  };

  getProfileData = () => {
    // console.log('getProfileData =============>');
    const {
      auth: { token },
      authActions: { trans },
      navigation,
    } = this.props;

    const FollowBtn = 'Follow';
    const FollowingBtn = 'Following';

    // console.log('userData =====================================');
    // console.log(userData);

    const data = this.getDataObj();

    let otherUserApi = '';
    let header = {};
    if (
      _.isString(token)
      && token !== ''
      && token !== undefined
      && token !== null
    ) {
      otherUserApi = settings.endpoints.view_user_login;
      header = {
        Authorization: `Bearer ${token}`,
      };
    } else {
      otherUserApi = settings.endpoints.view_user;
      header = {};
    }

    // console.log(otherUserApi);
    this.setState({ pageLoad: true }, () => {
      getApiData(otherUserApi, 'get', data, header)
        .then((responseJson) => {
          console.log('other profile ===>', responseJson);
          if (responseJson.success === true) {
            this.setState(
              {
                buttonName:
                  _.isObject(responseJson.data)
                  && responseJson.data.is_follower === false
                    ? FollowBtn
                    : FollowingBtn,
                pageLoad: false,
                data:
                  _.isObject(responseJson.data) && !_.isEmpty(responseJson.data)
                    ? responseJson.data
                    : {},
              },
              () => {
                this.getVideoList();
              },
            );
          } else {
            CAlert(
              trans('Video_NO_Longer_Available'),
              trans('error_msg_title'),
              () => {
                this.setState(
                  {
                    pageLoad: false,
                    videoListLoad: false,
                    data: {},
                  },
                  () => {
                    this.props.navigation.pop();
                  },
                );
              },
            );
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            pageLoad: false,
            videoListLoad: false,
            data: {},
          });
        });
    });
  };

  getDataObj = () => {
    const { navigation } = this.props;
    const userData = navigation.getParam('data');
    const FromWhereStr = navigation.getParam('FromWhereStr');

    console.log(userData);
    let data = {};
    if (_.isObject(userData)) {
      if (FromWhereStr === 'NotificationList' && userData.from_user_id !== '') {
        data = {
          user_id: userData.from_user_id,
        };
      } else if (!_.isEmpty(userData.user_id)) {
        data = {
          user_id: userData.user_id,
        };
      } else if (!_.isEmpty(userData.id)) {
        data = {
          user_id: userData.id,
        };
      }
    }

    return data;
  };

  getVideoList = () => {
    console.log('getVideoList ==================>');
    const {
      auth: { token },
    } = this.props;

    const data = this.getDataObj();

    console.log(data);

    let url;
    if (token !== '' && token !== undefined && token !== null) {
      url = settings.endpoints.other_user_login_videos;
    } else {
      url = settings.endpoints.other_user_videos;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    getApiData(url, 'get', data, headers)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          this.setState({
            videoList:
              _.isObject(responseJson.data)
              && _.isArray(responseJson.data.rows)
              && responseJson.data.rows.length > 0
                ? responseJson.data.rows
                : [],
            videoListLoad: false,
          });
        } else {
          console.log('responseJson.success === false');
          this.setState({ videoListLoad: false, videoList: [] });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ videoListLoad: false, videoList: [] });
      });
  };

  openModal = () => {
    this.setState({ visible: true });
  };

  handleModal = (type) => {
    if (type === 'login') {
      this.setState({ visible: false });
    } else if (type === 'privacy') {
      this.setState({ visible: false }, () => {
        if (this.CPrivacyModal) {
          this.CPrivacyModal.openModal();
        }
      });
    } else if (type === 'terms') {
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
    if (type === 'fb') {
      this.setState({ visible: false }, () => {
        params.onFbAction();
      });
    } else {
      this.setState({ visible: false }, () => {
        params.onGoogleAction();
      });
    }
  };

  goto = (page) => {
    const {
      navigation,
      auth: { token },
    } = this.props;
    const { data } = this.state;
    const uid = this.getDataObj();

    if (token !== '' && token !== undefined && token !== null) {
      navigation.navigate(page, {
        uid,
        data: data.follower,
      });
    } else {
      this.setState({ visible: true });
    }
  };

  showHeaderActions = () => {
    if (this.ActionSheet) {
      this.ActionSheet.show();
    }
  };

  handleAction = (i) => {
    const {
      navigation,
      auth: { userId },
      authActions: { trans },
    } = this.props;

    let shareIndex = 0;
    let blockIndex = 1;

    const { user_id } = this.getDataObj();
    if (user_id === userId) {
      shareIndex = 0;
      blockIndex = -1;
    }
    if (i === shareIndex) {
      this.shareProfileAction();
    }

    if (i === blockIndex) {
      const {
        authActions: { trans },
        auth: { token },
      } = this.props;
      if (token === '') {
        CAlert(
          trans('Profile_block_user_login_text'),
          trans('Profile_block_user_login_title'),
        );
        return;
      }
      CAlert(
        trans('Profile_block_user_confirmation_msg_text'),
        trans('confirm_alert_msg_title'),
        () => {
          this.blockUser();
        },
        () => {},
      );
    }
  };

  blockUser = () => {
    const {
      auth: { token },
      authActions: { setForceLoad },
      navigation,
    } = this.props;
    const { user_id } = this.getDataObj();

    this.setState({ pageLoad: true }, () => {
      getApiDataProgress(
        `${settings.endpoints.block}?user_id=${user_id}`,
        'get',
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      )
        .then((responseJson) => {
          this.setState({ pageLoad: false }, () => {
            if (responseJson.success === true) {
              setForceLoad();
              navigation.popToTop();
            } else {
              CAlert(
                responseJson.message
                  ? responseJson.message
                  : 'Failed to block this user.',
              );
            }
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ pageLoad: false }, () => {
            CAlert(
              error.message ? error.message : 'Failed to block this user.',
            );
          });
        });
    });
  };

  renderMainSubView = () => {
    const {
      // videoList,
      refreshing,
      data,
      buttonLoad,
      buttonName,
    } = this.state;
    const {
      auth: { token, userOtherData },
      authActions: { trans },
      navigation,
    } = this.props;
    const Followers = trans('OtherUserProfile_followers_text');
    const Following = trans('OtherUserProfile_following_text');
    console.log('tokentokentokentoken => ', token);
    // console.log(this.props);
    let oId = this.getDataObj();
    oId = oId.user_id;

    const showFollowUnFollowBtn = !!(
      _.isString(token)
      && token !== ''
      && token !== undefined
      && token !== null
    );

    const username = _.isObject(data) && _.isString(data.username) && data.username !== ''
      ? data.username
      : '';
    const FollowingNo = _.isObject(data)
      && _.isObject(data.follower)
      && _.isString(data.follower.following)
      && data.follower.followers !== ''
      ? data.follower.following
      : '';
    const FollowersNo = _.isObject(data)
      && _.isObject(data.follower)
      && _.isString(data.follower.followers)
      && data.follower.followers !== ''
      ? data.follower.followers
      : '';
    const WinnerNo = _.isObject(data)
      && _.isObject(data.follower)
      && _.isString(data.follower.winners)
      && data.follower.winners !== ''
      ? data.follower.winners
      : '';
    const imageUrl = _.isObject(data) && _.isString(data.photo) && data.photo !== ''
      ? data.photo
      : '';
    const userId = _.isObject(userOtherData)
      && !_.isEmpty(userOtherData)
      && userOtherData.user_id
      ? userOtherData.user_id
      : '';

    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 5 }}
        refreshControl={(
          <RefreshControl
            // tintColor={colors.brandDarkOrange} FOR IOS
            size={25}
            colors={[colors.brandAppBackColor]}
            onRefresh={this.onRefresh}
            refreshing={refreshing}
          />
)}
      >
        <View style={styles.profileSty}>
          <Image source={{ uri: imageUrl }} style={styles.imgSty} />
          <Text
            numberOfLines={1}
            style={[common.textNormal, common.PT10, common.semiBold]}
          >
            {username}
          </Text>
        </View>
        <View style={styles.followerswrap}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.followingsty, styles.commonRightBorder]}
            onPress={() => {
              this.goto('Following');
            }}
          >
            <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>
              {FollowingNo}
            </Text>
            <Text
              numberOfLines={1}
              style={[common.textNormal, { color: '#0008', lineHeight: 20 }]}
            >
              {Following}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.followingsty,
              // styles.commonRightBorder,
            ]}
            onPress={() => {
              this.goto('Followers');
            }}
          >
            <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>
              {FollowersNo}
            </Text>
            <Text
              numberOfLines={1}
              style={[common.textNormal, { color: '#0008', lineHeight: 20 }]}
            >
              {Followers}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={styles.followingsty}
            // onPress={() => { this.goto('UserWinner'); }}
          >
            <Text numberOfLines={1} style={[common.textH4, common.semiBold]}>{WinnerNo}</Text>
            <Text numberOfLines={1} style={[common.textNormal, { color: '#0008', lineHeight: 20 }]}>
              {'Winner'}
            </Text>
          </TouchableOpacity> */}
        </View>
        {showFollowUnFollowBtn && _.toString(userId) !== _.toString(oId) ? (
          <View style={styles.btnwrap}>
            <CButton
              load={buttonLoad}
              btnText={buttonName}
              btnStyle={{ marginTop: 15, marginBottom: 10 }}
              onPress={() => {
                this.doFollow();
              }}
            />
          </View>
        ) : (
          <View style={{ padding: 5 }} />
        )}
        {this.renderVideoList()}
      </ScrollView>
    );
  };

  renderVideoList = () => {
    const {
      videoList,
      // moreItems,
    } = this.state;

    return (
      <Row size={12} style={styles.RowStyle}>
        {_.isArray(videoList) && videoList.length > 0
          ? videoList.map((item, index) => (
            <Col
              key={`id_${index}`}
              sm={6}
              md={6}
              lg={6}
              style={{ paddingTop: 3 }}
            >
              <CProfileVideo
                {...this.props}
                data={item}
                openModal={this.openModal}
              />
            </Col>
          ))
          : this.renderErrorView()}
      </Row>
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
    const { videoListLoad } = this.state;
    const {
      authActions: { trans },
    } = this.props;
    if (videoListLoad) {
      return this.renderLoaderView();
    }
    return <CError errorText={trans('OtherUserProfile_no_video_msg_text')} />;
  };

  backAction = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  shareProfileAction = () => {
    const { data } = this.state;
    Share.share({
      title: 'MTD',
      message: data.share_link ? data.share_link : '',
      // url: '',
    });
  };

  renderHeader = () => {
    const { pageLoad, data } = this.state;
    const validUserName = _.isObject(data) && _.isString(data.username) && data.username !== ''
      ? data.username
      : '';

    if (!pageLoad) {
      return (
        <CHeader
          showBackArrow
          showCenterText
          centerText={validUserName}
          profileTab
          profileTabIcon="dots-three-horizontal"
          showRightText
          ShowRightIcon
          onBackAction={this.backAction}
          onRightIconAction={this.showHeaderActions}
        />
      );
    }

    return null;
  };

  renderRewardAd = () => {
    const {
      auth: { adType },
      authActions: { setAdType },
    } = this.props;
    const { admobUnitIdList, RewardAd } = adType;
    if (
      RewardAd === true
      && admobUnitIdList
      && admobUnitIdList.reward_other_profile_id[Platform.OS]
    ) {
      return (
        <CRewardAd
          adId={admobUnitIdList.reward_other_profile_id[Platform.OS]}
          showAds
          onHideAds={() => {
            this.setState({ visible: false });
            setAdType({ ...adType, RewardAd: false });
          }}
        />
      );
    }
  };

  render() {
    const {
      navigation,
      auth: {
        adType: { admobUnitIdList },
      },
    } = this.props;
    const otherUser = navigation.getParam('data');
    console.log(otherUser);
    const { pageLoad, visible, rewardAdShow } = this.state;
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {rewardAdShow && this.renderRewardAd()}
        {admobUnitIdList
          && admobUnitIdList.banner_Other_Profile_Id[Platform.OS] && (
            <CBannerAd
              bannerId={admobUnitIdList.banner_Other_Profile_Id[Platform.OS]}
            />
        )}
        {pageLoad ? this.renderLoaderView() : this.renderMainSubView()}
        <CLogin
          {...this.props}
          modalVisible={visible}
          closeModal={() => this.handleModal('login')}
          openTermsConditionModal={() => this.handleModal('terms')}
          openPrivacyModal={() => this.handleModal('privacy')}
          onFbAction={() => this.handleSocial('fb')}
          onGoogleAction={() => this.handleSocial('google')}
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

OtherUserProfile.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  closeModal: PropTypes.func,
  closePrivacyModal: PropTypes.func,
  closeTermsConditionModal: PropTypes.func,
  openTermConditionModal: PropTypes.func,
  openPrivacyModal: PropTypes.func,
  privacyModal: PropTypes.bool,
  termsModal: PropTypes.bool,
  loginModal: PropTypes.func,
  setPrivacyData: PropTypes.string,
  setTermsanduseData: PropTypes.string,
  onFbAction: PropTypes.func,
  onGoogleAction: PropTypes.func,
  setAdType: PropTypes.func,
};

OtherUserProfile.defaultProps = {
  authActions: {},
  auth: {},
  navigation: {},
  closeModal: () => null,
  closePrivacyModal: () => null,
  closeTermsConditionModal: () => null,
  openTermConditionModal: () => null,
  openPrivacyModal: () => null,
  privacyModal: false,
  termsModal: false,
  loginModal: () => null,
  setPrivacyData: '',
  setTermsanduseData: '',
  onFbAction: () => null,
  onGoogleAction: () => null,
  setAdType: () => null,
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfile);
