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
import CHeader from '../components/CHeader';
import CHelp from '../components/CHelp';
import { getReduxErrors, CAlert } from '../components/CAlert';
import authActions from '../redux/reducers/auth/actions';
import BankDetailsForm from '../reduxForm/BankDetailsForm';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

// create a component
class BankDetails extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      openHelpModal: false,
      setHelpcentreData: '',
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

  openHelpcentreModal = async () => {
    if (this.CHelp) {
      this.CHelp.openModal();
    }
  }

  handleSubmit = (values) => {
    console.log('values ==================================>');
    console.log(values);
    Keyboard.dismiss();
    this.submitBankDetailsForm(values);
  }

  submitBankDetailsForm = (values) => {
    const { auth: { token }, authActions: { trans }, dispatch } = this.props;
    console.log(token);
    const data = {
      'UserBankDetail[bank_name]': _.isObject(values) && _.isString(values.bank_name) ? values.bank_name : '',
      'UserBankDetail[phone]': _.isObject(values) && _.isString(values.phone) ? values.phone : '',
      'UserBankDetail[bank_account_no]': _.isObject(values) && _.isString(values.bank_account_no) ? values.bank_account_no : '',
      'UserBankDetail[bank_account_no_confirm]': _.isObject(values) && _.isString(values.bank_account_no_confirm) ? values.bank_account_no_confirm : '',
      'UserBankDetail[bank_holder_name]': _.isObject(values) && _.isString(values.bank_holder_name) ? values.bank_holder_name : '',
      'UserBankDetail[bank_other]': _.isObject(values) && _.isString(values.bank_other) ? values.bank_other : '',
    };
    dispatch(startSubmit('Bank_DetailsForm'));
    getApiDataProgress(settings.endpoints.add_bank, 'post', data, {
      Authorization: `Bearer ${token}`,
    }, null)
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          CAlert(responseJson.message, trans('success_alert_msg_title'), () => {
            this.goto('AddBank');
          });
        } else {
          const ErrObj = getReduxErrors(responseJson);
          dispatch(stopSubmit('Bank_DetailsForm', ErrObj));
        }
        // else {
        //   const ErrObj = getReduxErrors(responseJson);
        //   console.log(ErrObj);
        //   const e = _.isObject(ErrObj) && _.isString(ErrObj.errors) ? ErrObj.errors : '';
        //   dispatch(stopSubmit('Bank_DetailsForm', { bank_account_no_confirm: e }));
        // }
      })
      .catch((errors) => {
        console.log(errors);
        dispatch(stopSubmit('Bank_DetailsForm', {
          _error: trans('network_error_msg'),
        }));
      });
  }

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  render() {
    // const {
    // ifsc,
    // Accntnmbr,
    // cnfmAccntnmbr,
    // Accntholdernme,
    // phonenmbr,
    // nicknme,
    // comments,
    // openHelpModal,
    // setHelpcentreData,
    // } = this.state;

    const { navigation, authActions: { trans } } = this.props;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          showRightText
          ShowRightIcon
          rightIconName="Question"
          centerText={trans('BankDetails_page_title')}
          onBackAction={() => { navigation.goBack(); }}
          // onRightIconAction={() => {
          //   this.setState({
          //     openHelpModal: true,
          //   });
          // }}
          onRightIconAction={() => { this.openHelpcentreModal(); }}
        />
        <BankDetailsForm
          {...this.props}
          onSubmit={this.handleSubmit}
        />
        {/* <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid="true"
        > */}
        {/* <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}> */}
        {/* <CInput
              bankdetails
              MleftIcon="bank"
              leftIcon
              placeholder="Bank Name"
              keyboardType="default"
              ref={(o) => { this.ifscInput = o; }}
              onChangeText={(t) => { this.setState({ ifsc: t }); }}
              value={ifsc}
              mgBottom={15}
              onSubmitEditing={() => this.AccntnmbrInput.focus()}
              returnKeyType="next"
              selectionColor="#0009"
              blurOnSubmit={false}
            /> */}
        {/* <CInput
              leftIcon="User"
              placeholder="Account number"
              keyboardType="number-pad"
              ref={(o) => { this.AccntnmbrInput = o; }}
              onChangeText={(t) => { this.setState({ Accntnmbr: t }); }}
              value={Accntnmbr}
              mgBottom={15}
              onSubmitEditing={() => this.cnfmAccntnmbrInput.focus()}
              returnKeyType="next"
              selectionColor="#0009"
              blurOnSubmit={false}
            /> */}
        {/* <CInput
              leftIcon="User"
              placeholder="Confirm account number"
              keyboardType="number-pad"
              ref={(o) => { this.cnfmAccntnmbrInput = o; }}
              onChangeText={(t) => { this.setState({ cnfmAccntnmbr: t }); }}
              value={cnfmAccntnmbr}
              mgBottom={15}
              onSubmitEditing={() => this.AccntholdernmeInput.focus()}
              returnKeyType="next"
              selectionColor="#0009"
              blurOnSubmit={false}
            /> */}
        {/* <CInput
              leftIcon="User"
              placeholder="Account holder name"
              keyboardType="default"
              ref={(o) => { this.AccntholdernmeInput = o; }}
              onChangeText={(t) => { this.setState({ Accntholdernme: t }); }}
              value={Accntholdernme}
              mgBottom={15}
              onSubmitEditing={() => this.phonenmbrInput.focus()}
              returnKeyType="next"
              selectionColor="#0009"
              blurOnSubmit={false}
            /> */}
        {/* <CInput
              bankdetails
              MleftIcon="contacts"
              leftIcon
              placeholder="Phone number"
              keyboardType="phone-pad"
              ref={(o) => { this.phonenmbrInput = o; }}
              onChangeText={(t) => { this.setState({ phonenmbr: t }); }}
              value={phonenmbr}
              mgBottom={15}
              onSubmitEditing={() => this.nicknmeInput.focus()}
              returnKeyType="next"
              selectionColor="#0009"
              blurOnSubmit={false}
            /> */}
        {/* <CInput
              leftIcon="User"
              placeholder="Nick name (Optional)"
              keyboardType="default"
              ref={(o) => { this.nicknmeInput = o; }}
              onChangeText={(t) => { this.setState({ nicknme: t }); }}
              value={nicknme}
              mgBottom={15}
              onSubmitEditing={() => this.commentsInput.focus()}
              returnKeyType="next"
              selectionColor="#0009"
              blurOnSubmit={false}
            /> */}
        {/* <CInput
              placeholder="Comments"
              textArea
              underlineColorAndroid="transparent"
              keyboardType="default"
              ref={(o) => { this.commentsInput = o; }}
              onChangeText={(t) => { this.setState({ comments: t }); }}
              value={comments}
              mgBottom={15}
              onSubmitEditing={() => { Keyboard.dismiss(); }}
              returnKeyType="done"
              selectionColor="#0009"
              blurOnSubmit={false}
            /> */}
        {/* <CButton
              btnText="Confirm"
              btnStyle={{ marginTop: 10 }}
              textStyle={[common.textH3, common.semiBold, { color: '#FFF' }]}
            /> */}
        {/* </View> */}
        {/* </KeyboardAwareScrollView> */}
        <CHelp
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CHelp = o.getWrappedInstance();
            } else {
              this.CHelp = o;
            }
          }}
          bank
        />
      </View>
    );
  }
}

BankDetails.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

BankDetails.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(BankDetails);
