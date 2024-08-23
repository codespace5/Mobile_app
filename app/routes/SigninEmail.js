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
import authActions from '../redux/reducers/auth/actions';
import SignEmailForm from '../reduxForm/SignEmailForm';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import { getReduxErrors } from '../components/CAlert';
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
});

class SigninEmail extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageLoad: false,
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

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  handleSubmit = (values) => {
    Keyboard.dismiss();
    this.submitEmail(values);
  }

  submitEmail = (values) => {
    const { dispatch, authActions: { trans } } = this.props;
    const data = {
      email: _.isObject(values) && _.isString(values.userEmail) ? values.userEmail : '',
    };
    dispatch(startSubmit('sEmail_Form'));
    getApiDataProgress(settings.endpoints.validate_data, 'post', data, {}, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          this.goto('SigninPhone');
        } else {
          const ErrObj = getReduxErrors(responseJson);
          console.log(ErrObj);
          const e = _.isObject(ErrObj) && _.isString(ErrObj.errors) ? ErrObj.errors : '';
          dispatch(stopSubmit('sEmail_Form', { userEmail: e }));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(stopSubmit('sEmail_Form', {
          _error: trans('network_error_msg'),
        }));
      });
  }

  BackToHome = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { pageLoad } = this.state;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText={false}
          showRightText={false}
          showBottomBorder={false}
          onBackAction={() => { this.BackToHome(); }}
        />
        <SignEmailForm
          {...this.props}
          onSubmit={this.handleSubmit}
          loading={pageLoad}
        />
      </View>
    );
  }
}

SigninEmail.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  authActions: PropTypes.objectOf(PropTypes.any),
  // auth: PropTypes.objectOf(PropTypes.any),
};

SigninEmail.defaultProps = {
  navigation: {},
  dispatch: () => null,
  authActions: {},
  // auth: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(SigninEmail);
