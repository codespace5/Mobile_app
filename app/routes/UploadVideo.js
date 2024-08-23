import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { ProcessingManager } from 'react-native-video-processing';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  AsyncStorage,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Client } from 'bugsnag-react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import IoIcon from 'react-native-vector-icons/Ionicons';
// import { Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
// import CButton from '../components/CButton';
import authActions from '../redux/reducers/auth/actions';
import videoActions from '../redux/reducers/video/actions';
import colors from '../config/styles';
import { FORTAB } from '../config/MQ';
import CLoader from '../components/CLoader';
import { CAlert } from '../components/CAlert';
import images from '../config/images';
import settings from '../config/settings';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

const bugsnag = new Client(settings.bugsnagKey);

const styles = StyleSheet.create({
  mainViewSty: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    paddingVertical: RFValue(20),
    position: 'relative',
  },
  buttonViewSty: {
    width: RFValue(60),
    height: RFValue(60),
    borderRadius: RFValue(30),
    alignSelf: 'center',
    marginVertical: RFValue(10),
    backgroundColor: colors.brandAppBackColor,
  },
  BackIconViewSty: {
    flex: 1,
    position: 'absolute',
    height: RFValue(FORTAB ? 70 : 55),
    width: RFValue(55),
    padding: RFValue(10),
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  BackIconSty: {
    fontSize: RFValue(FORTAB ? 35 : 30),
    color: '#FFF',
  },
  backIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: RFValue(FORTAB ? 70 : 55),
    backgroundColor: '#0000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  loaderView: {
    backgroundColor: '#000',
  },
  backgroundVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - colors.headerHeight,
    backgroundColor: '#000',
    position: 'relative',
  },
});

class UploadVideo extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      video: {},
      play: true,
      loading: false,
      cText: '',
      paused: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  handleBackPress = async () => {
    const { video } = this.state;
    try {
      const value = await AsyncStorage.getItem('activeScreen');
      if (value !== null) {
        if (value === 'Home') {
          BackHandler.exitApp();
        } else if (!_.isEmpty(video)) {
          this.handleBack('trim');
        } else {
          this.handleBack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  onLoad = (metadata) => {
    console.log('Video Meta ====> ', metadata);
    const { authActions: { trans } } = this.props;
    if (metadata.duration > 61) {
      CAlert(trans('UploadVideo_maximum_duration_alert_msg'), trans('error_msg_title'), () => {
      // CAlert(`Your video is too long of ${metadata.duration}`, trans('error_msg_title'), () => {
        this.setState({
          video: {}, loading: false, compressing: false, cText: '',
        });
      });
    }
  }

  openPicker = async (type) => {
    const { authActions: { trans } } = this.props;
    this.setState({ loading: true }, async () => {
      if (type === 'picker') {
        try {
          const video = await ImagePicker.openPicker({ mediaType: 'video' });
          // this.setState({ video, loading: false });
          console.log(video);
          // this.setState({ video, loading: false, compressing: true, cText: 'Video is trimming' }, () => {
          //   this.trimVideo();
          // });

          if (_.isObject(video) && video.size) {
            const size = video.size / 1024 / 1024;
            console.log(size);
            this.setState({ video, loading: false });
            // if (size <= 72) {
            //   // this.setState({
            //   //   video, loading: false, compressing: true, cText: 'Video is trimming',
            //   // }, () => {
            //   //   this.trimVideo();
            //   // });
            // } else {
            //   CAlert(trans('UploadVideo_maximum_upload_size_alert_msg'), trans('error_msg_title'), () => {
            //     this.setState({
            //       video: {}, loading: false, compressing: false, cText: '',
            //     });
            //   });
            // }
          }
        } catch (error) {
          this.setState({ loading: false });
          console.log(error);
        }
      } else {
        ImagePicker.openCamera({ mediaType: 'video' }).then((video) => {
          console.log(video);
          // this.setState({ video, loading: false });
          this.setState({
            video, loading: false, compressing: true, cText: 'Video is trimming',
          }, () => {
            // this.trimVideo();
          });

          if (_.isObject(video) && video.size) {
            const size = video.size / 1024 / 1024;
            console.log('size', size);
            if (size <= 72) {
              this.setState({ video, loading: false });
            } else {
              CAlert(trans('UploadVideo_maximum_upload_size_alert_msg'), trans('error_msg_title'), () => {
                this.setState({
                  video: {}, loading: false, compressing: false, cText: '',
                });
              });
            }
          }
          this.setState({ video, loading: false, compressing: true }, () => {
            // this.trimVideo();
          });
        }).catch((err) => {
          console.log(err);
          this.setState({ loading: false });
        });
      }
    });
  }

  // getPreviewImageForSecond = (second) => {
  //   const maximumSize = {
  //     width: 640, height: 1024,
  //   }; // default is { width: 1080, height: 1080 } iOS only
  //   this.videoPlayerRef.getPreviewForSecond(second, maximumSize) // maximumSize is iOS only
  //     .then(base64String => console.log('This is BASE64 of image', base64String))
  //     .catch(console.warn);
  // }

  // getVideoInfo = () => {
  //   this.videoPlayerRef.getVideoInfo()
  //     .then(info => console.log(info))
  //     .catch(console.warn);
  // }

  // trimVideo = async () => {
  //   const { video } = this.state;
  //   const options = {
  //     startTime: 0,
  //     endTime: 61,
  //     // quality: VideoPlayer.Constants.quality.QUAmp4LITY_1280x720, // iOS only
  //     // saveToCameraRoll: true, // default is false // iOS only
  //     // saveWithCurrentDate: true, // default is false // iOS only
  //   };

  //   try {
  //     let data = '';
  //     if (Platform.OS === 'ios') {
  //       data = await ProcessingManager.trim(video.sourceURL, options);
  //     } else {
  //       data = await ProcessingManager.trim(video.path, options);
  //     }

  //     console.log(data);
  //     if (_.isString(data)) {
  //       const obj = video;
  //       obj.sourceURL = data;

  //       this.setState({ video: obj, cText: 'Video is compressing' }, () => {
  //         this.compressVideo();
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   // const options = {
  //   //   startTime: 0,
  //   //   endTime: 60,
  //   //   // quality: VideoPlayer.Constants.quality.QUAmp4LITY_1280x720, // iOS only
  //   //   saveToCameraRoll: true, // default is false // iOS only
  //   //   saveWithCurrentDate: true, // default is false // iOS only
  //   // };
  //   // console.log('sdl/khnfsdklcfs');
  //   // console.log(this.videoPlayerRef);
  //   // if (this.videoPlayerRef) {
  //   //   this.videoPlayerRef.trim(options).then((newSource) => {
  //   //     // console.log('New Source is');
  //   //     console.log(newSource);
  //   //     const { video } = this.state;
  //   //     // video.path = `file://${newSource}`;
  //   //     video.path = `${newSource}`;

  //   //     console.log(video.path);
  //   //     this.setState({ video }, () => {
  //   //       console.log('Compressing the video now');
  //   //       this.compressVideo();
  //   //     });
  //   //   }).catch(console.warn);
  //   // }
  // }

  // compressVideo = async () => {
  //   const { video } = this.state;
  //   const options = {
  //     width: 540,
  //     height: 960,
  //     // bitrateMultiplier: 3, saveToCameraRoll: true, // default is false, iOS only
  //     // saveWithCurrentDate: true, // default is false, iOS only minimumBitrate:
  //     // 300000,
  //     removeAudio: false, // default is
  //   };

  //   try {
  //     const data = await ProcessingManager.compress(video.sourceURL, options);
  //     console.log(data);
  //     if (_.isString(data)) {
  //       const obj = video;
  //       obj.sourceURL = data;
  //       this.setState({ video: obj, compressing: false });
  //     } else if (_.isObject(data) && data.source) {
  //       const obj = video;
  //       obj.sourceURL = data.source;
  //       this.setState({ video: obj, compressing: false });
  //     }
  //   } catch (error) {
  //     this.setState({ compressing: false });
  //     console.log(error);
  //   }

  //   // console.log(this.videoPlayerRef);
  //   // if (this.videoPlayerRef) {
  //   //   this.videoPlayerRef.compress(options).then((newSource) => {
  //   //     if (newSource) {
  //   //       console.log('compressVideo done');
  //   //       console.log(newSource);
  //   //       const { video } = this.state;
  //   //       video.path = `${newSource}`;
  //   //       this.setState({ video, compressing: false }, () => {
  //   //         // console.log(`Get info again`);
  //   //         this.videoPlayerRef.getVideoInfo()
  //   //           .then(info => console.log(info))
  //   //           .catch(console.warn);
  //   //       });
  //   //     } else {
  //   //       this.setState({ compressing: false });
  //   //       console.log('compressVideo err else');
  //   //     }
  //   //   }).catch(() => {
  //   //     this.setState({ compressing: false });
  //   //     // this.setState({ compressing: false }, () => {   // this.compressVideo(); });
  //   //     console.log('compressVideo err');
  //   //   });
  //   // }
  // }

  storeDataInAuth = (video) => {
    console.log('video =========================================>');
    console.log(video);
    const { videoActions: { setUploadVideoData }, videoData, navigation } = this.props;

    const data = videoData;
    data.videoFile = _.isObject(video) && !_.isEmpty(video) ? video : '';
    setUploadVideoData(data);

    setTimeout(() => {
      this.setState({ paused: false, video: {} }, () => {
        navigation.navigate('Post', { data });
      });
    }, 50);
  }

  handleBack = (type) => {

    const { navigation, videoActions: { setUploadVideoData } } = this.props;

    if (type === 'trim') {
      this.setState({ video: {} });
    } else {
      setUploadVideoData('');
      this.setState({ video: {} }, () => {
        navigation.navigate('Home');
      });
    }
  }

  render() {
    const {
      video, play, loading, compressing, cText, paused,
    } = this.state;
    console.log('Upload video Paused ===> ', paused);
    const { authActions: { trans } } = this.props;
    const path = Platform.OS === 'ios' ? video.sourceURL : video.path;
    if ((_.isEmpty(video) || path === '') && loading) {
      return (
        <CLoader contentStyle={styles.loaderView} text={trans('UploadVideo_processing_video_text')} />
      );
    }

    if (_.isEmpty(video) || path === '') {
      return (
        <View style={styles.mainViewSty}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'center' }}>
            <Text style={{ color: '#FFF', fontSize: RFValue(16), textAlign: 'center' }}>{trans('UploadVideo_record_video_direction_text')}</Text>
            <Image source={images.selectVideo} style={{ height: RFValue(120), width: RFValue(60), alignSelf: 'center' }} />
          </View>
          <View style={styles.backIcon}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.BackIconViewSty}
              onPress={this.handleBack}
            >
              <IoIcon name="ios-arrow-round-back" style={styles.BackIconSty} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
            { /* <View style={{ backgroundColor: '#0000', height: 40, width: 40 }} /> */ }
            {/* <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.openPicker('camera')}
                style={styles.buttonViewSty}
              />
              <Text
                numberOfLines={1}
                style={[common.textH2, common.semiBold, { color: '#FFF', textAlign: 'center' }]}
              >
                {trans('UploadVideo_video_btn_text')}
              </Text>
            </View> */}
            <View>
              <TouchableOpacity
                onPress={() => this.openPicker('picker')}
                activeOpacity={0.8}
                style={{
                  height: RFValue(40), width: RFValue(40), borderRadius: RFValue(5), backgroundColor: '#FFF', marginVertical: RFValue(10), alignSelf: 'center'
                }}
              />
              <Text style={{ color: '#FFF' }}>{trans('UploadVideo_gallery_btn_text')}</Text>
            </View>
          </View>
        </View>
      );
    }
    // console.log(video);
    return (
      <View style={{ flex: 1, position: 'relative', backgroundColor: '#000' }}>
        {compressing ? null : (
          <View style={styles.backIcon}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.BackIconViewSty}
              onPress={() => this.handleBack('trim')}
            >
              <IoIcon name="ios-arrow-round-back" style={styles.BackIconSty} />
            </TouchableOpacity>
          </View>
        )}
        <Video
          source={{ uri: path }}
          ref={(ref) => { this.player = ref; }}
          style={styles.backgroundVideo}
          // repeat
          muted={false}
          paused={paused}
          playInBackground={false}
          // onLoad={this.onLoad}
          onProgress={this.onProgress}
          onSeek={this.onSeek}
          onBuffer={this.onBuffer}
          onError={(e) => {
            console.log(e);
          }}
          resizeMode="contain"
        />
        {/* <VideoPlayer
          ref={(o) => { this.videoPlayerRef = o; }}
          // startTime={30}
          // endTime={120}
          play={play}
          replay={false}
          rotate
          source={video.path}
          playerWidth={300}
          playerHeight={500}
          style={{
            flexGrow: 1,
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            position: 'relative',
          }}
          resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
          // onChange={({nativeEvent}) => console.log({nativeEvent})}
        />
        <Trimmer
          source={video.path}
          height={1000}
          width={300}
          style={{ flexGrow: 1 }}
          onTrackerMove={e => console.log(e.currentTime)}
          themeColor="white"
          thumbWidth={30}
          trackerColor="green"
          onChange={e => console.log(e.startTime, e.endTime)}
        /> */}
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#0000',
            bottom: 0,
            left: 0,
            right: 0,
            padding: RFValue(40),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={compressing}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              this.setState({ play: false }, () => {
                this.storeDataInAuth(video);
              });
            }}
          >
            {compressing
              ? (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={{ color: '#FFF', fontSize: RFValue(14) }}>{cText}</Text>
                </View>
              ) : (
                <AIcon
                  name="checkcircle"
                  style={{
                    color: colors.brandAppBackColor,
                    fontSize: RFValue(50),
                  }}
                />
              )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

UploadVideo.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.func),
  videoActions: PropTypes.objectOf(PropTypes.func),
  videoData: PropTypes.objectOf(PropTypes.any),
};

UploadVideo.defaultProps = {
  navigation: {},
  authActions: {},
  videoActions: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadVideo);
