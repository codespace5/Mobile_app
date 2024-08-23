import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Platform,
  WebView,
  BackHandler,
  AsyncStorage,
  ActivityIndicator,
  NativeModules,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InAppBilling from "react-native-billing";
import RNPaystack from "react-native-paystack";
import LinearGradient from "react-native-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import CHeader from "../components/CHeader";
import common from "../config/genStyle";
import colors from "../config/styles";
import CButton from "../components/CButton";
import FORTAB from "../config/MQ";
import authActions from "../redux/reducers/auth/actions";
import videoActions from "../redux/reducers/video/actions";
import settings from "../config/settings";
import CPayStackModal from "../components/CPayStackModal";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import CLoader from "../components/CLoader";
import { CAlert, EAlert } from "../components/CAlert";
import CPrivacyModal from "../components/CPrivacyModal";
import CTermsCondition from "../components/CTermsCondition";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

const { InAppUtils } = NativeModules;

RNPaystack.init({ publicKey: settings.payStackPublicKey });
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  makepaymentwrap: {
    padding: 20,
    flex: 1,
    // justifyContent: 'space-between'
  },
  privacystatmentsty: {
    marginVertical: 10,
    color: "#0008",
    letterSpacing: 0.3,
    lineHeight: 19,
  },
});

// create a component
class MakePayment extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      displayPrice: "",
      price: "",
      visible: false,
      InAppBtnLoad: false,
      payStackBtnLoad: false,
      showWebView: false,
      webViewUrlText: "",
    };
  }

  componentDidMount() {
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
    if (_.isObject(videoData) && videoData.video_id) {
      this.getPaymentPrice(videoData.video_id);
    }

    /* Lets stop uploading */
    setUploading(false);

    /* clear video data from redux is set */
    const reduxVideoData = this.props.videoData;
    if (!_.isEmpty(reduxVideoData.videoFile)) {
      setUploadVideoData("");
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);

    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  };

  getPaymentPrice = (id) => {
    const {
      auth: { token },
    } = this.props;

    const headers = {
      authorization: `Bearer ${token}`,
    };

    this.setState({ loading: true }, () => {
      getApiDataProgress(
        `${settings.endpoints.get_video_price}?video_id=${id}`,
        "get",
        {},
        headers,
        () => null
      )
        .then((response) => {
          // console.log(response);
          if (
            response.success &&
            _.isObject(response.data) &&
            response.data.price
          ) {
            // let cAmount = response.data.price.split(/\s+/g);
            // console.log(cAmount);
            this.setState({
              price: response.data.price_num,
              displayPrice: response.data.price,
              loading: false,
            });
          } else {
            this.setState({ price: "", displayPrice: "", loading: false });
          }
        })
        .catch((err) => {
          this.setState({ price: "", displayPrice: "", loading: false });
          console.log(err);
        });
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

  showAlert = () => {
    const {
      authActions: { trans },
    } = this.props;
    Alert.alert(
      trans("MakePayment_confirmation_alert_msg_title"),
      trans("MakePayment_account_info_text"),
      [
        {
          text: trans("MakePayment_cancel_btn_text"),
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: trans("MakePayment_postNow_text"),
          onPress: () => this.BackToHome(),
        },
      ],
      { cancelable: false }
    );
  };

  BackToHome = () => {
    const { navigation } = this.props;
    const type = navigation.getParam("type");

    navigation.popToTop();

    // if (type === 'disclaimer') {
    //   // setCountry(true);
    // setCountry({});
    //   navigation.navigate('Home');
    //   // navigation.push('Home');
    // } else {
    //   navigation.popToTop();
    // }
  };

  handleAppPurchase = (type) => {
    if (type === "payStack") {
      if (this.CPayStackModal) {
        this.setState({ payStackBtnLoad: true }, () => {
          this.CPayStackModal.openModal();
        });
      }
    } else {
      this.setState({ InAppBtnLoad: true }, () => {
        this.handleInAppPurchase();
      });
    }
  };

  handleInAppPurchase = async () => {
    const {
      auth: { userOtherData },
    } = this.props;
    const purchaseKey =
      _.isObject(userOtherData) && userOtherData.product_id_for_inapp
        ? userOtherData.product_id_for_inapp
        : "";

    console.log(purchaseKey);

    if (Platform.OS === "ios") {
      console.log("for ios");
      this.iosPay();
    } else {
      await InAppBilling.close();
      try {
        await InAppBilling.open();
        if (!(await InAppBilling.isPurchased(purchaseKey))) {
          const details = await InAppBilling.purchase(purchaseKey);
          console.log("You purchase: ", details);
        }
        const transactionStatus =
          await InAppBilling.getPurchaseTransactionDetails(purchaseKey);
        console.log("Transaction Status", transactionStatus);
        const productDetails = await InAppBilling.getProductDetails(
          purchaseKey
        );
        console.log(productDetails);
        this.sendTransactionStatus(transactionStatus);
      } catch (err) {
        await InAppBilling.close();
        this.setState({ InAppBtnLoad: false });
      } finally {
        await InAppBilling.consumePurchase(purchaseKey);
        await InAppBilling.close();
        this.setState({ InAppBtnLoad: false });
      }
    }
  };

  iosPay = () => {
    const {
      authActions: { trans },
      auth: { userOtherData },
    } = this.props;
    const purchaseKey =
      _.isObject(userOtherData) && userOtherData.product_id_for_inapp
        ? userOtherData.product_id_for_inapp
        : "";

    console.log(purchaseKey);

    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ InAppBtnLoad: false }, () => {
          setTimeout(() => {
            CAlert(
              trans("MakePayment_not_Allowed_alert_msg_title"),
              trans("MakePayment_device_not_allow_text")
            );
          }, 100);
        });
      } else {
        const lProducts = [purchaseKey];
        InAppUtils.loadProducts(lProducts, (error, products) => {
          if (error) {
            console.log(error);
            this.setState({ InAppBtnLoad: false });
          } else {
            console.log(products);
            InAppUtils.purchaseProduct(purchaseKey, (err, response) => {
              if (error) {
                console.log(error);
                this.setState({ InAppBtnLoad: false });
              } else if (response && response.productIdentifier) {
                this.sendTransactionStatus(response);
              } else {
                console.log("other issue ====");
                this.setState({ InAppBtnLoad: false });
              }
            });
          }
        });
      }
    });
  };

  sendTransactionStatus = (transactionStatus) => {
    const {
      auth: { token },
      navigation,
      authActions: { trans },
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
      platform: Platform.OS === "android" ? "Android" : "iOS",
      json: JSON.stringify(transactionStatus),
      take_part_again: takePartAgain,
      video_id: VideoId,
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    this.setState({ InAppBtnLoad: true }, () => {
      getApiDataProgress(
        settings.endpoints.in_app_verification,
        "post",
        detail,
        headers,
        () => null
      )
        .then((response) => {
          console.log(response);
          if (response.success === true) {
            this.setState({ InAppBtnLoad: false }, () => {
              setTimeout(() => {
                CAlert(response.message, "Success", () => {
                  navigation.popToTop();
                  navigation.navigate("Profile");
                });
              }, 100);
            });
          } else {
            console.log(response.message);
            this.setState({ InAppBtnLoad: false }, () => {
              setTimeout(() => {
                EAlert(response.message, trans("error_msg_title"));
              }, 100);
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ InAppBtnLoad: false }, () => {
            setTimeout(() => {
              CAlert(
                trans("something_wrong_alert_msg"),
                trans("error_msg_title")
              );
            }, 100);
          });
        });
    });
  };

  openModal = () => {
    this.setState({ visible: true });
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

  onNavigationStateChange = (navState) => {
    console.log("navState ============================================>");
    console.log(navState);
    const {
      authActions: { trans },
    } = this.props;

    const route = navState.url.replace(/.*?:\/\//g, "");

    if (_.isObject(navState) && _.isString(navState.url)) {
      if (route.includes("payment/success")) {
        console.log("Go to home");
        this.props.navigation.popToTop();
        this.props.navigation.navigate("Profile");
      }

      if (route.includes("payment/failed")) {
        CAlert(trans("Unable_To_Process_Payment"), trans("error_msg_title"));
      }
    }
  };

  setWebViewUrlStr = () => {
    const {
      navigation,
      auth: { userOtherData },
    } = this.props;
    const videoData = navigation.getParam("data");
    console.log(videoData);

    const videoId =
      _.isObject(videoData) &&
      (_.isString(videoData.video_id) || _.isNumber(videoData.video_id))
        ? videoData.video_id
        : "";
    const partAgain =
      _.isObject(videoData) && _.isNumber(videoData.able_to_part_again)
        ? videoData.able_to_part_again
        : 0;
    const countryId =
      _.isObject(userOtherData) && _.isString(userOtherData.country_id)
        ? userOtherData.country_id
        : "";

    console.log(
      "Open web view =====================================================>"
    );
    console.log(`videoId :- ${videoId}`);
    console.log(`partAgain :- ${partAgain}`);
    console.log(`countryId :- ${countryId}`);

    this.setState(
      {
        showWebView: true,
        webViewUrlText: `www.musictalentdiscovery.com/payment/paystack?video_id=${videoId}&country_id=${countryId}&part_again=${partAgain}`,
        // webViewUrlText: `http://192.168.0.170/site_data/payment/paystack?video_id=${videoId}&country_id=${countryId}&part_again=${partAgain}`
      },
      () => {
        console.log(this.state.webViewUrlText);
      }
    );
  };

  render() {
    const {
      loading,
      displayPrice,
      price,
      visible,
      InAppBtnLoad,
      payStackBtnLoad,
      showWebView,
      webViewUrlText,
    } = this.state;
    const {
      navigation,
      authActions: { trans },
    } = this.props;
    const videoData = navigation.getParam("data");

    if (loading) {
      return <CLoader />;
    }

    const paymentText = trans("MakePayment_Content");

    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans("MakePayment_page_title")}
          onBackAction={() => {
            this.BackToHome();
          }}
          otherMainViewSty={{ zIndex: 10 }}
        />

        {showWebView ? (
          <WebView
            source={{ uri: webViewUrlText }}
            style={{ flex: 1 }}
            onNavigationStateChange={this.onNavigationStateChange}
            startInLoadingState
            scalesPageToFit
            javaScriptEnabled
            renderLoading={this.renderLoaderView}
          />
        ) : (
          <ScrollView style={styles.makepaymentwrap}>
            <View style={{ paddingBottom: 20 }}>
              <LinearGradient
                colors={[
                  colors.brandAppButtonTopColor,
                  colors.brandAppButtonBottomColor,
                ]}
                location={[0.5, 0.9]}
                start={{ x: 1, y: 1 }}
                end={{ x: 1.0, y: 0.0 }}
                style={{ borderRadius: 5 }}
              >
                <View style={{ paddingVertical: 20 }}>
                  <Text
                    style={[
                      common.textBig,
                      common.textNBold,
                      {
                        color: "#FFF",
                        fontSize: FORTAB ? 40 : 45,
                        textAlign: "center",
                      },
                    ]}
                  >
                    {displayPrice || videoData.price}
                  </Text>
                </View>
              </LinearGradient>

              {Platform.OS !== "ios" && (
                <CButton
                  load={payStackBtnLoad}
                  btnText={trans("MakePayment_paystack_btn_text")}
                  // onPress={payStackBtnLoad || InAppBtnLoad ? null : () => this.handleAppPurchase('payStack')}
                  onPress={() => {
                    this.setWebViewUrlStr();
                  }}
                />
              )}

              <CButton
                load={InAppBtnLoad}
                btnText={trans("MakePayment_in_app_purchase_btn_text")}
                onPress={() => {
                  if (InAppBtnLoad || payStackBtnLoad) return false;
                  this.handleAppPurchase("inAppPurchase");
                }}
              />
            </View>
            {paymentText !== "" && paymentText !== "blank" && (
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "#333",
                  alignSelf: "stretch",
                  paddingBottom: RFValue(50),
                }}
              >
                {trans("MakePayment_Content")}
              </Text>
            )}
          </ScrollView>
        )}

        <CPayStackModal
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CPayStackModal = o.getWrappedInstance();
            } else {
              this.CPayStackModal = o;
            }
          }}
          price={price}
          stopLoading={() => {
            this.setState({ payStackBtnLoad: false });
          }}
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

MakePayment.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  videoActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  videoData: PropTypes.objectOf(PropTypes.any),
};

MakePayment.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MakePayment);
