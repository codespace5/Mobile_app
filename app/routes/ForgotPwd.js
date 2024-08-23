import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { stopSubmit, startSubmit } from 'redux-form';
import CHeader from '../components/CHeader';
import { getReduxErrors, CAlert } from '../components/CAlert';
import authActions from '../redux/reducers/auth/actions';
import ForgotPwdForm from '../reduxForm/ForgotPwdForm';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  BottomFixButton: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(25),
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: RFValue(20),
    right: RFValue(40),
  },
  checkIconSty: {
    color: '#FFF',
    fontSize: RFValue(35),
  },
  forgotInfoText: {
    color: '#8e8e93',
    lineHeight: RFValue(13),
    letterSpacing: 0.2,
  },
});

class ForgotPwd extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  handleSubmit = (values) => {
    console.log('values ==================================>');
    console.log(values);
    Keyboard.dismiss();
    this.submitLoginForm(values);
  }

  submitLoginForm = (values) => {
    const { dispatch, authActions: { trans } } = this.props;
    const data = {
      'PasswordResetRequestForm[email]': _.isObject(values) && _.isString(values.email) ? values.email : '',
    };
    dispatch(startSubmit('Forgot_PwdForm'));
    getApiDataProgress(settings.endpoints.password_reset_request, 'post', data, {}, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          CAlert(responseJson.message, trans('success_alert_msg_title'), () => {
            setTimeout(() => {
              this.goto('Login');
            }, 100);
          });
        } else {
          const errors = getReduxErrors(responseJson);
          dispatch(stopSubmit('Forgot_PwdForm', errors));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(stopSubmit('Forgot_PwdForm', {
          _error: trans('network_error_msg'),
        }));
      });
  }

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  BackToHome = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText={false}
          showRightText={false}
          showBottomBorder={false}
          onBackAction={() => { this.BackToHome(); }}
        />
        <ForgotPwdForm
          {...this.props}
          onSubmit={this.handleSubmit}
        />
      </View>
    );
  }
}

ForgotPwd.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  // auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
};

ForgotPwd.defaultProps = {
  authActions: {},
  // auth: {},
  navigation: {},
  dispatch: () => null,
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPwd);
