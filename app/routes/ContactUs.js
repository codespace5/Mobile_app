import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View, StyleSheet, Keyboard, Alert,
} from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { stopSubmit, startSubmit } from "redux-form";
import CHeader from "../components/CHeader";
import CHelp from "../components/CHelp";
import { getReduxErrors, CAlert } from "../components/CAlert";
import authActions from "../redux/reducers/auth/actions";
import { getApiDataProgress } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";
import ContactUsForm from "../reduxForm/ContactUsForm";

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

// create a component
class ContactUs extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      openHelpModal: false,
      setHelpcentreData: "",
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus,
    );
  };

  componentWillUnmount = () => {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  };

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  };

  openHelpcentreModal = async () => {
    if (this.CHelp) {
      this.CHelp.openModal();
    }
  };

  handleSubmit = (values) => {
    Keyboard.dismiss();
    this.submitContactUsForm(values);
  };

  submitContactUsForm = (values) => {
    const {
      auth: { token },
      authActions: { trans },
      dispatch,
    } = this.props;
    const data = {
      "ContactForm[name]":
        _.isObject(values) && _.isString(values.name) ? values.name : "",
      "ContactForm[phone]":
        _.isObject(values) && _.isString(values.phone_number)
          ? values.phone_number
          : "",
      "ContactForm[email]":
        _.isObject(values) && _.isString(values.email) ? values.email : "",
      "ContactForm[subject]":
        _.isObject(values) && _.isObject(values.subject)
          ? values.subject.value
          : "",
      "ContactForm[body]":
        _.isObject(values) && _.isString(values.body) ? values.body : "",
      "ContactForm[g-recaptcha-response]": _.isString(values.captchaToken) ? values.captchaToken : "",
    };
    dispatch(startSubmit("ContactUs_Form"));

    getApiDataProgress(
      settings.endpoints.contact_us,
      "post",
      data,
      {
        Authorization: `Bearer ${token}`,
      },
      null,
    )
      .then((responseJson) => {
        if (responseJson.success === true) {
          alert("success");
          this.goto("PrivacySetting");
          //   return true;
        } else {
          const ErrObj = getReduxErrors(responseJson);
          dispatch(stopSubmit("ContactUs_Form", ErrObj));
        }
        // else {
        //   const ErrObj = getReduxErrors(responseJson);
        //   console.log(ErrObj);
        //   const e = _.isObject(ErrObj) && _.isString(ErrObj.errors) ? ErrObj.errors : '';
        //   dispatch(stopSubmit('ContactUs_Form', { bank_account_no_confirm: e }));
        // }
      })
      .catch((errors) => {
        console.log(errors);
        dispatch(
          stopSubmit("ContactUs_Form", {
            _error: trans("network_error_msg"),
          }),
        );
      });
  };

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

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

    const {
      navigation,
      authActions: { trans },
    } = this.props;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
            centerText={trans("PrivacySetting_contactus")}
          // centerText="Contact Us"
          onBackAction={() => {
            navigation.goBack();
          }}
        />
        <ContactUsForm {...this.props} onSubmit={this.handleSubmit} />
      </View>
    );
  }
}

ContactUs.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

ContactUs.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
