import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { stopSubmit, startSubmit } from 'redux-form';
import { getReduxErrors } from '../components/CAlert';
import authActions from '../redux/reducers/auth/actions';
import ChangePwdForm from '../reduxForm/ChangePwdForm';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

class ChangePwd extends Component {
    static navigationOptions = {
      header: null,
    };

    constructor(props) {
      super(props);
      this.state = {
        // Npwd: '',
        // Rpwd: '',
      };
    }

    componentDidMount = () => {
      const { navigation } = this.props;
      this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
    }
  
    componentWillUnmount = () => {
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
      // console.log('values ==================================>');
      console.log(values);
      Keyboard.dismiss();
      this.passwordReset(values);
    }

    passwordReset = (values) => {
      const { auth: { token }, authActions: { trans }, dispatch } = this.props;
      console.log(token);
      const data = {
        'ChangePasswordForm[password]': _.isObject(values) && _.isString(values.password) ? values.password : '',
        'ChangePasswordForm[confirm_password]': _.isObject(values) && _.isString(values.confirm_password) ? values.confirm_password : '',
      };
      dispatch(startSubmit('Change_PwdForm'));
      getApiDataProgress(settings.endpoints.change_password, 'post', data, {
        Authorization: `Bearer ${token}`,
      }, null)
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            this.goto('PrivacySetting');
          } else {
            const ErrObj = getReduxErrors(responseJson);
            dispatch(stopSubmit('Change_PwdForm', ErrObj));
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(stopSubmit('Change_PwdForm', {
            _error: trans('network_error_msg'),
          }));
        });
    }

    // submit = (password, reEnterPassword) => {
    //   console.log(password);
    //   console.log(reEnterPassword);
    //   if (password !== reEnterPassword) {
    //     CAlert('password does not match.');
    //   } else if (password === reEnterPassword) {
    //     CAlert('password Reset.', 'Success', this.goto('PrivacySetting'));
    //   }
    // }


    // ValidateData = () => {
    //   const { Npwd, Rpwd } = this.state;
    //   Keyboard.dismiss();

    //   let valid = true;
    //   if (Npwd.length <= 5) {
    //     valid = false;
    //     CAlert('Password must contain atleast 6 characters');
    //   } else if (!_.isEqual(Npwd, Rpwd)) {
    //     valid = false;
    //     CAlert('New password & Confirm password must be same');
    //   }
    //   if (valid) {
    //     this.gotoNext();
    //   }
    // }

    gotoNext = () => {
      const { navigation } = this.props;
      navigation.goBack();
    }

    render() {
      // const { Npwd, Rpwd } = this.state;
      // const { navigation } = this.props;
      return (
        <View style={styles.container}>
          {/* <CHeader
            showBackArrow
            showCenterText
            showRightText
            rightText="Save"
            centerText="Change Password"
            onBackAction={() => { navigation.goBack(); }}
            onRightIconAction={this.handleSubmit}
          /> */}

          <ChangePwdForm
            {...this.props}
            onSubmit={this.handleSubmit}
          />

          {/* <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <CInput
              leftIcon="Padlock"
              placeholder="New Password"import CButton from '../components/CButton';
              keyboardType="default"
              secureTextEntry
              ref={(o) => { this.NPwdInput = o; }}
              onChangeText={(t) => { this.setState({ Npwd: t }); }}
              value={Npwd}
              mgBottom={5}
              onSubmitEditing={() => this.RPwdInput.focus()}
              returnKeyType="next"
              selectionColor="#0009"
              blurOnSubmit={false}
            />
            <CInput
              leftIcon="Padlock"
              placeholder="Re-enter Password"
              keyboardType="default"
              secureTextEntry
              ref={(o) => { this.RPwdInput = o; }}
              onChangeText={(t) => { this.setState({ Rpwd: t }); }}
              value={Rpwd}
              mgBottom={5}
              onSubmitEditing={() => { this.ValidateData(); }}
              returnKeyType="done"
              selectionColor="#0009"
              blurOnSubmit={false}
            />
          </KeyboardAwareScrollView> */}
        </View>
      );
    }
}

ChangePwd.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

ChangePwd.defaultProps = {
  authActions: {},
  auth: {},
  navigation: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePwd);
