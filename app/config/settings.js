/* eslint-disable max-len */
import { Dimensions, Platform } from 'react-native';

const device = Dimensions.get('window');
/* eslint-disable no-undef */
const devMode = __DEV__;
const settings = {
  // baseUrl: "http://192.168.0.170/site_data/v1/",
  // api: "http://192.168.0.170/site_data/v1/",
  // uploadVideoApi: "http://192.168.0.170/site_data/v1/",
  baseUrl: 'https://www.musictalentdiscovery.com/v1/',
  api: 'https://www.musictalentdiscovery.com/v1/',
  uploadVideoApi: 'https://www.musictalentdiscovery.com/v1/',

  captchaSiteKey: '6Le65q4bAAAAAEFzbYhRspO00qFJRWjxt88Gsati',

  // banner_Slider_Id: Platform.OS === 'ios' ? 'ca-app-pub-4400361576208583/3730228690' : "ca-app-pub-4400361576208583/4912923205",
  // banner_Other_Profile_Id: Platform.OS === 'ios' ? 'ca-app-pub-4400361576208583/6439108934' : "ca-app-pub-4400361576208583/2655583079",
  // banner_Profile_Id: Platform.OS === 'ios' ? 'ca-app-pub-4400361576208583/8706233528' : "ca-app-pub-4400361576208583/3898713685",
  // banner_Comment_Id: Platform.OS === 'ios' ? 'ca-app-pub-4400361576208583/7939946764' : "ca-app-pub-4400361576208583/8591996534",
  // reward_other_profile_id: Platform.OS === 'ios' ? 'ca-app-pub-4400361576208583/6539061144' : "ca-app-pub-4400361576208583/1274840768",
  // Interstitial_Top100_id: Platform.OS === 'ios' ? 'ca-app-pub-4400361576208583/1630063984' : "ca-app-pub-4400361576208583/3749246274",

  endpoints: {
    Login: 'user/login',
    password_reset_request: 'user/password-reset-request',
    signup: 'user/signup',
    verification: 'user/verification',
    get_cms_page: 'page/get-page',
    social_login: 'user/social-login',
    resend_otp: 'user/resend-otp',
    user_videos: 'video/user-videos',
    other_user_videos: 'video/other-user-videos',
    other_user_login_videos: 'video/other-user-videos-after-login',
    getVideos: 'video/videos',
    getGuestVideo: 'video/videos-for-guest',
    Photo: 'user/photo',
    Me: 'user/me',
    view_user: 'user/view-user',
    view_user_login: 'user/view-user-login',
    add_vote: 'video/add-vote',
    voteList: 'video/list-votes',
    addComment: 'video/add-comment',
    getAllComments: 'video/list-comment',
    validate_data: 'user/validate-data',
    getAllViewsList: 'video/list-views',
    addView: 'video/add-view',
    addViewAfterLogin: 'video/add-view-after-login',
    winners: 'winner/winners',
    winners_after_login: 'winner/winners-after-login',
    set_paypal: 'user/set-paypal',
    add_bank: 'user/add-bank',
    get_bank: 'user/get-bank',
    delete_bank: 'user/delete-bank',
    set_bank: 'user/set-bank',
    get_languages: 'user/get-languages',
    set_language: 'user/set-language',
    add_token: 'user/add-token',
    get_Notification: 'notification/index',
    remove_Notification: 'notification/remove',
    remove_all_Notification: 'notification/remove-all',
    winner_gallery: 'winner/winner-gallery',
    winner_gallery_after_login: 'winner/winner-gallery-after-login',
    add_video: 'video/add-video',
    report: 'video/report',
    change_password: 'user/change-password',
    me_update: 'user/me-update',
    set_notification_status: 'user/set-notification-status',
    do_follow: 'user/follow',
    block: 'user/block',
    unblock: 'user/unblock',
    get_blocked_list: 'user/blocked-list',
    paystack_verification: 'payment/paystack-verification',
    in_app_verification: 'payment/in-app-verification',
    free_video_post: 'payment/free-video-post',
    user_following: 'user/get-followings',
    user_followers: 'user/get-followers',
    live_wining_prices: 'video/live-wining-prices',
    live_wining_prices_after_login: 'video/live-wining-prices-after-login',
    get_countries: 'user/get-countries',
    set_country: 'user/set-country',
    delete_Video: 'video/delete-video',
    get_video_price: 'video/get-video-price',
    badge_count: 'notification/badge-count',
    logout: 'user/logout',
    getLanguage: 'page/app-txt',
    getSearch: 'user/index',
    getTopVideos: 'video/get-top-videos',
    contact_us: 'user/contact-for-advertise',
    sponsor_adv: 'video/save-adv-view',
    adv_Timeout: 'video/get-video-timeout',
    updaterecord: 'user/update-user-record',
    deleteAccount: 'user/delete-account',
  },

  version: {
    android: '1.0.0',
    ios: '1.0.0',
  },

  devMode,
  token: null,
  minimumTime: 10,

  bugsnagKey: '4d9773ed08d70318fb72ddfc7244d73a',

  borderIssue: Platform.OS === 'android' && Platform.Version < 21,
  isIphoneX:
    Platform.OS === 'ios'
    && !Platform.isPad
    && !Platform.isTVOS
    && (device.height === 812 || device.width === 812),
  maxItemsPerPage: 4,
  getApiKey: 'AIzaSyBgI78Y4OdR23H_E48_fzIfas84LQ-5oxI',
  // payStackPublicKey: 'pk_test_2cf8ca8e50d7078622c1b2ccbf4ead71a170239e',
  payStackPublicKey: 'pk_live_62be9f608efe6dbbc0a406bb5c5a6334f2abca2d',
  iosClientId:
    '898038960794-23bjnej298k03q8l6jmat7l4e9fgs7s9.apps.googleusercontent.com', // only for iOS
  webClientId:
    '898038960794-cdeisereb9p49udp3vqv74ltko1fjpfu.apps.googleusercontent.com',
  geolocationOptions: {
    // enableHighAccuracy: Platform.OS === 'ios',
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
  },
};
export default settings;
