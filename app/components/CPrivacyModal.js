// import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import IoIcon from 'react-native-vector-icons/Ionicons';
import common from '../config/genStyle';
import getCmsData from '../redux/utils/getCmsData';
import CLoader from './CLoader';
import Device from 'react-native-device-info';
import { isIphoneX } from 'react-native-iphone-x-helper';

// define your styles
const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    // padding: 25,
    padding: Device.hasNotch() || isIphoneX() ? 40 : 25,
  },
  OtherMainView: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  HeaderViewSty: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#8e8e93',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  infoViewSty: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  infoTextSty: {
    marginVertical: 10,
    color: '#0008',
    letterSpacing: 0.3,
    lineHeight: 19,
  },
  otherScrollSty: {
    paddingRight: 15,
    paddingBottom: 50,
  },
  HeaderTextTitle: {
    marginTop: 10,
    marginBottom: 20,
    color: '#404040',
  },
  loaderView: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

// create a component
class CPrivacyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      privacyText: '',
    };
  }

  openModal = () => {
    this.setState({ visible: true, loading: true }, () => {
      this.getData();
    });
  }

  closeModal = () => {
    const { visible, loginModal } = this.props;
    this.setState({ visible: false }, () => {
      if (visible) {
        loginModal();
      }
    });
  }

  getData = async () => {
    try {
      const privacyData = await getCmsData('privacy-policy');
      if (privacyData.success === true) {
        if (_.isObject(privacyData.data)) {
          if (_.isString(privacyData.data.app_body) && privacyData.data.app_body !== '') {
            this.setState({
              privacyText: privacyData.data.app_body,
              loading: false,
            });
          }
        }
      } else {
        this.setState({ privacyText: '', loading: false });
      }
    } catch (e) {
      console.log(e);
      this.setState({ privacyText: '', loading: false });
    }
  }

  render() {
    const { loading, privacyText, visible } = this.state;
    const { authActions: { trans } } = this.props;
    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={this.closeModal}
      >
        <View style={styles.ModalMainView}>
          <View style={styles.OtherMainView}>
            <View style={styles.HeaderViewSty}>
              <Text numberOfLines={1} style={[common.headerTitle]}>{trans('CPrivacyModal_modal_title')}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignItems: 'flex-end', justifyContent: 'center', zIndex: 10, padding: 10 }}
                onPress={this.closeModal}
              >
                <IoIcon name="md-close" style={{ fontSize: RFValue(25), color: '#000' }} />
              </TouchableOpacity>
            </View>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              ref={(o) => { this.privacyScroll = o; }}
              contentContainerStyle={styles.infoViewSty}
            >
              {/* <Text numberOfLines={1} style={[common.textH3, styles.HeaderTextTitle]}>
                {'Last updated: March 2019'}
              </Text> */}

              <View style={styles.otherScrollSty}>
                <View style={styles.otherScrollSty}>
                  {loading ? (
                    <View style={styles.loaderView}>
                      <CLoader />
                    </View>
                  ) : (
                    <Text
                      style={[common.textH4, styles.infoTextSty]}
                    >
                      {_.isString(privacyText) && privacyText !== '' ? privacyText : ''}
                    </Text>
                  )}
                </View>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

CPrivacyModal.propTypes = {
  visible: PropTypes.bool,
  loginModal: PropTypes.func,
  authActions: PropTypes.objectOf(PropTypes.any),
};

CPrivacyModal.defaultProps = {
  visible: false,
  loginModal: () => null,
  authActions: () => null,
};

export default CPrivacyModal;
