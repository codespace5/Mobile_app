import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  // KeyboardAwareScrollView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import RNPaystack from 'react-native-paystack';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { LiteCreditCardInput } from 'react-native-credit-card-input';
import common from '../config/genStyle';
import settings from '../config/settings';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import authActions from '../redux/reducers/auth/actions';
import colors from '../config/styles';
import { CAlert } from './CAlert';
import CLoader from './CLoader';

const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'relative',
  },
  TopHeaderSty: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
  },
  SearchView: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
  },
  CloseIconViewSty: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 50,
    width: 40,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    zIndex: 10,
  },
  CloseIconSty: {
    color: '#000',
    fontSize: RFValue(20),
  },
  ModalMainViewSty: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // top: 0,
    top: Dimensions.get('window').height / 3,
  },
  ScrollConSty: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  commentMainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    marginBottom: 20,
    marginTop: 5,
  },
  InputViewSty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: 1,
    // borderBottomColor: '#8e8e93',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#8e8e93',
  },
  IconViewSty: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SearchIconSty: {
    color: '#8e8e93',
    fontSize: RFValue(20),
  },
});

class CPayStackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '',
      month: '',
      year: '',
      cvc: '',
      amount: 0,
      email: '',
      transactionReference: '',
      // btnLoad: false,
      loading: false,
      visible: false,
    };
  }

  openModal = () => {
    this.setState({ visible: true });
  }

  closeModal = () => {
    const { stopLoading } = this.props;
    this.setState({ visible: false }, () => {
      if (_.isFunction(stopLoading)) {
        stopLoading();
      }
    });
  }

  verifyResponse = async () => {
    const { auth: { token }, authActions: { trans }, navigation } = this.props;
    const videoData = navigation.getParam('data');
    const { transactionReference } = this.state;
    const takePartAgain = _.isObject(videoData) && _.isNumber(videoData.able_to_part_again) && videoData.able_to_part_again === 1 ? 1 : 0;
    const VideoId = _.isObject(videoData) && videoData.video_id ? videoData.video_id : '';
    const detail = {
      reference: transactionReference,
      video_id: VideoId,
      take_part_again: takePartAgain,
    };

    const headers = {
      authorization: `Bearer ${token}`,
    };

    getApiDataProgress(settings.endpoints.paystack_verification, 'post', detail, headers, () => null)
      .then((response) => {
        console.log(response);
        if (response.success === true) {
          CAlert(response.message, trans('success_alert_msg_title'), () => this.success(true));
        } else {
          this.setState({ loading: false }, () => {
            CAlert(response.message, trans('error_msg_title'), () => this.success(false));
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  success = (bool) => {
    const { navigation, authActions: { setForceLoad } } = this.props;
    this.setState({ loading: false }, () => {
      if (bool) {
        setForceLoad();
        this.closeModal();
        navigation.navigate('Profile');
      }
    });
  }

  handleProcess = () => {
    const {
      cardNumber, month, year, cvc, amount, email,
    } = this.state;
    const { authActions: { trans } } = this.props;
    console.log(cardNumber);
    console.log(month);
    console.log(year);
    console.log(cvc);
    console.log(amount);
    this.setState({ loading: true }, () => {
      RNPaystack.chargeCard({
        cardNumber,
        expiryMonth: month,
        expiryYear: year,
        cvc,
        email,
        amountInKobo: amount,
      })
        .then((response) => {
          console.log(response);
          if (_.isObject(response) && response.reference !== '') {
            this.setState({ transactionReference: response.reference }, () => this.verifyResponse());
          } else {
            CAlert(trans('something_wrong_alert_msg'), trans('error_msg_title'), () => this.success());
          }
        })
        .catch((error) => {
          CAlert(error.code, trans('error_msg_title'), () => this.setState({ loading: false }));
          console.log(error); // error is a javascript Error object
          console.log(error.message);
          console.log(error.code);
        });
    });
    // }
  }

  onChange = async (data) => {
    const { auth: { userData, userOtherData }, navigation, price } = this.props;
    const videoData = navigation.getParam('data');

    console.log('==========================================================================================');
    console.log(videoData);
    console.log(price);
    console.log('==========================================================================================');

    let cAmount;
    if (_.isObject(videoData) && videoData.price_num) {
      cAmount = videoData.price_num;
    } else {
      cAmount = price;
    }

    console.log(cAmount);
    let userEmail = '';
    if (_.isObject(userOtherData) && _.isString(userOtherData.email) && userOtherData.email !== '') {
      userEmail = userOtherData.email;
    } else if (_.isObject(userData) && _.isString(userData.email) && userData.email !== '') {
      userEmail = userData.email;
    }

    console.log(userEmail);
    const videoAmount = cAmount * 100;
    console.log(videoAmount);
    if (data.valid) {
      if (_.isObject(data.values)) {
        const { cvc, expiry, number } = data.values;
        // const no = expiry.split(/\s+/g);

        const cNumber = number.replace(/ /g, '');
        const res = expiry.slice(0, 2);
        const res2 = expiry.slice(3, 5);

        const obj = {
          cvc,
          month: res,
          year: res2,
          cardNumber: cNumber,
          amount: _.toNumber(videoAmount),
          email: userEmail,
        };
        // const obj = {
        //   cardNumber: '4084084084084081',
        //   month: '10',
        //   year: '20',
        //   cvc: '408',
        //   amount: _.toNumber(videoAmount),
        //   email: userEmail,
        // };
        console.log(obj);
        this.setState(obj, () => {
          this.handleProcess();
          console.log(obj);
        });
      }
    }
  }

  render() {
    const { loading, visible } = this.state;
    const { authActions: { trans } } = this.props;
    return (
      <Modal
        transparent
        animationType="slide"
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={this.closeModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.ModalMainView}
        >
          <View style={styles.ModalMainViewSty}>
            <View style={styles.TopHeaderSty}>
              <Text numberOfLines={1} style={[common.headerTitle]}>{trans('CPayStackModal_modal_title')}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.CloseIconViewSty}
                onPress={this.closeModal}
              >
                <IoIcon name="md-close" style={styles.CloseIconSty} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, backgroundColor: '#FFF', paddingHorizontal: 18 }}>
              {loading ? <CLoader /> : (
                <View style={{
                  borderWidth: 1, borderColor: colors.brandAppBackColor, borderRadius: 3,
                }}
                >
                  <LiteCreditCardInput onChange={this.onChange} />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

CPayStackModal.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  price: PropTypes.string,
};

CPayStackModal.defaultProps = {
  auth: {},
  authActions: {},
  navigation: {},
  price: '',
};

function mapStateToProps(state) {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true },
)(CPayStackModal);
