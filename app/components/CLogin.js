/* eslint-disable global-require */
// import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { SignInWithAppleButton } from '../libs/react-native-apple-authentication';
// import { SignInWithAppleButton } from 'react-native-apple-authentication';
import common from '../config/genStyle';
import CButton from './CButton';
import CTermsCondition from './CTermsCondition';
import CPrivacyModal from './CPrivacyModal';
import colors from '../config/styles';


// define your styles
const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'relative',
  },
  OtherMainViewSty: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingBottom: isIphoneX ? 30 : 0,
  },
  CloseIconSty: {
    padding: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  ButtonViewSty: {
    paddingHorizontal: 30,
  },
  BottomLinesViewSty: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  LineViewSty: {
    height: 1,
    width: '42%',
    backgroundColor: '#8e8e93',
  },
  OrTextSty: {
    marginHorizontal: 10,
    color: '#0008',
    backgroundColor: '#0000',
  },
  SocialIconViewSty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  FbIconSty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#0000',
    // marginHorizontal: 5,
  },
  GoogleIconSty: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    padding: 5,
    borderWidth: 1,
    borderColor: '#8e8e93',
    marginHorizontal: 5,
  },
  AppleIconSty: {
    marginHorizontal: 7,
    width: 36,
    height: 36,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#8e8e93',
  },
  ImgSty: {
    width: '100%',
    height: '100%',
  },
  InfoTextSty: {
    textAlign: 'center',
    color: '#8e8e93',
  },
  BottomLoginViewSty: {
    paddingVertical: 13,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#8e8e93',
  },
});

// create a component
class CLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  goto = (page) => {
    const { closeModal, navigation } = this.props;
    closeModal();
    setTimeout(() => {
      navigation.navigate(page);
    }, 100);
  };

  appleSignIn = (result) => {
    const { handleLogin } = this.props;
    handleLogin('apple', result);
  }

  render() {
    const { loading } = this.state;
    const {
      modalVisible,
      closeModal,
      privacyModal,
      closePrivacyModal,
      termsModal,
      closeTermsModal,
      openTermsConditionModal,
      openPrivacyModal,
      setPrivacyData,
      setTermsanduseData,
      onFbAction,
      onGoogleAction,
      onAppleAction,
      authActions: { trans },
    } = this.props;

    if (modalVisible) {
      return (
        <Modal
          transparent
          animationType="slide"
          visible={modalVisible}
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            // onPress={closeModal}
            style={styles.ModalMainView}
          >
            <View style={styles.OtherMainViewSty}>
              <View style={styles.CloseIconSty}>
                <IoIcon
                  name="md-close"
                  style={{ fontSize: RFValue(23), color: '#000' }}
                  onPress={closeModal}
                />
              </View>
              <Text
                style={[
                  common.textH3,
                  common.semiBold,
                  { textAlign: 'center' },
                ]}
              >
                {trans('CLogin_required_acc_text')}
              </Text>
              <Text
                style={[
                  common.textH3,
                  common.semiBold,
                  { textAlign: 'center' },
                ]}
              >
                {trans('CLogin_required_acc_text1')}
              </Text>

              <View style={styles.ButtonViewSty}>
                <CButton
                  btnText={trans('CLogin_signUp_with_email_btn_text')}
                  load={loading}
                  btnStyle={{ marginTop: 20 }}
                  onPress={() => {
                    this.goto('SigninName');
                  }}
                />

                <View style={styles.BottomLinesViewSty}>
                  <View style={styles.LineViewSty} />
                  <Text
                    numberOfLines={1}
                    style={[common.textNBold, styles.OrTextSty]}
                  >
                    {trans('CLogin_or_text')}
                  </Text>
                  <View style={styles.LineViewSty} />
                </View>

                <View style={styles.SocialIconViewSty}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.FbIconSty}
                    onPress={onFbAction}
                  >
                    <Image
                      style={styles.ImgSty}
                      // source={{ uri: 'http://pngimg.com/uploads/facebook_logos/facebook_logos_PNG19754.png' }}
                      source={require('../images/fb.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.GoogleIconSty}
                    onPress={onGoogleAction}
                  >
                    <Image
                      style={styles.ImgSty}
                      // source={{ uri: 'https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png' }}
                      source={require('../images/google.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ alignSelf: 'center' }}>
                  {Platform.OS === 'ios' ? (
                    SignInWithAppleButton({
                    // buttonStyle: styles.appleBtn,
                      callBack: this.appleSignIn,
                      buttonText: 'Sign Up With Apple',
                    })
                  ) : null}
                </View>

                <View style={{ marginBottom: 20, marginTop: 10 }}>
                  <Text
                    numberOfLines={1}
                    style={[common.textNormal, styles.InfoTextSty]}
                  >
                    {trans('CLogin_agreement_text1')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={[common.textNormal, styles.InfoTextSty]}
                    >
                      {trans('CLogin_agreement_text2')}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={openTermsConditionModal}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          common.semiBold,
                          { color: colors.brandAppTextBlueColor },
                        ]}
                      >
                        {trans('CLogin_agreement_text3')}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      numberOfLines={1}
                      style={[common.textNormal, styles.InfoTextSty]}
                    >
                      {trans('CLogin_agreement_text4')}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={[common.textNormal, styles.InfoTextSty]}
                    >
                      {trans('CLogin_agreement_text5')}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={openPrivacyModal}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          common.semiBold,
                          { color: colors.brandAppTextBlueColor },
                        ]}
                      >
                        {trans('CLogin_agreement_text6')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.BottomLoginViewSty}>
                <Text numberOfLines={1} style={common.textH4}>
                  {' '}
                  {trans('CLogin_already_have_account_text')}
                  {' '}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.goto('Login');
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      common.textH4,
                      common.semiBold,
                      { color: colors.brandAppBackColor },
                    ]}
                  >
                    {trans('CLogin_log_in_text')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      );
    }

    if (privacyModal) {
      return (
        <CPrivacyModal
          modalVisible={privacyModal}
          closeModal={closePrivacyModal}
          setPrivacyData={setPrivacyData}
        />
      );
    }

    if (termsModal) {
      return (
        <CTermsCondition
          modalVisible={termsModal}
          closeModal={closeTermsModal}
          setTermsanduseData={setTermsanduseData}
        />
      );
    }

    return null;
  }
}

CLogin.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  modalVisible: PropTypes.bool,
  privacyModal: PropTypes.bool,
  termsModal: PropTypes.bool,
  closeModal: PropTypes.func,
  closePrivacyModal: PropTypes.func,
  closeTermsModal: PropTypes.func,
  openTermsConditionModal: PropTypes.func,
  openPrivacyModal: PropTypes.func,
  onFbAction: PropTypes.func,
  onGoogleAction: PropTypes.func,
  onAppleAction: PropTypes.func,
};

CLogin.defaultProps = {
  navigation: {},
  authActions: {},
  modalVisible: false,
  privacyModal: false,
  termsModal: false,
  closeModal: null,
  closePrivacyModal: null,
  closeTermsModal: null,
  openTermsConditionModal: null,
  openPrivacyModal: null,
  onFbAction: null,
  onGoogleAction: null,
  onAppleAction: null,
};

export default CLogin;
