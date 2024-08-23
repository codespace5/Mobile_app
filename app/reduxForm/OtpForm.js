import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  formValueSelector,
} from 'redux-form';
import {
  findNodeHandle,
  Text,
  View,
  Modal,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { bindActionCreators } from 'redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import IoIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { required, OtpLength } from '../config/validation';
import renderField from '../config/renderField';
import colors from '../config/styles';
import common from '../config/genStyle';
import authActions from '../redux/reducers/auth/actions';

const extraHeight = Platform.OS === 'ios' ? 0 : 300;

const styles = StyleSheet.create({
  BottomFixButton: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(25),
    backgroundColor: '#ffc000',
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
  InfoTextSty: {
    textAlign: 'left',
    color: '#8e8e93',
    lineHeight: RFValue(15),
    letterSpacing: 0.3,
    fontSize: RFValue(12),
  },
});

class OtpForm extends Component {
  constructor(props) {
    super(props);
    this.refFields = [];
    this.state = {
      loading: false,
    };
  }

  onFocusScroll = (refName) => {
    const node = findNodeHandle(this.refFields[refName]);
    this.scroll.scrollToFocusedInput(node, extraHeight, 0);
  }

  setRefField = (ref, refName) => {
    this.refFields[refName] = ref;
  }

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  renderLoaderModal = () => {
    const { loading } = this.props;
    return (
      <Modal
        transparent
        animationType="fade"
        visible={loading}
        supportedOrientations={['portrait', 'landscape']}
      // onRequestClose={}
      >
        <View style={{
          backgroundColor: 'rgba(0,0,0,0.7)', flex: 1, alignItems: 'center', justifyContent: 'center',
        }}
        >
          <ActivityIndicator size="large" color={colors.brandAppBackColor} animating />
        </View>
      </Modal>
    );
  }

  render() {
    const {
      handleSubmit,
      OtpCode,
      onResendOtp,
      submitting,
      authActions: { trans },
    } = this.props;

    const { loading } = this.state;
    const disable = !_.isString(OtpCode) || submitting === true;
    const active = _.isString(OtpCode) && OtpCode !== '' && OtpCode.length === 4;

    return (
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 40, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
        ref={(c) => { if (c != null) { this.scroll = c; } }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={[common.headerTitle]}>
            {trans('OtpForm_send_otp_msg_text')}
          </Text>
          <Text style={[common.textSmall, { color: '#8e8e93' }, { paddingLeft: 2 }]}>
            {trans('OtpForm_enter_otp_text')}
          </Text>
        </View>

        <View>
          <Field
            name="OtpCode"
            type="text"
            label=""
            component={renderField}
            placeholder={trans('OtpForm_field_1_placeholder')}
            keyboardType="numeric"
            validate={[required, OtpLength]}
            refField={this.setRefField}
            refName="OtpCode"
            onEnter={handleSubmit}
            onFocus={() => this.onFocusScroll('OtpCode')}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            style={[common.textNormal, styles.InfoTextSty]}
          >
            {trans('OtpForm_not_get_otp_text')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onResendOtp}
          >
            <Text
              numberOfLines={1}
              style={[common.textNBold, { color: colors.brandAppTextBlueColor }]}
            >
              {` ${trans('OtpForm_resend_code_text')}`}
            </Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={
            active
              ? [colors.brandAppButtonTopColor, colors.brandAppButtonBottomColor]
              : ['#D3D3D3', '#D3D3D3']
          }
          style={styles.BottomFixButton}
          location={[0.5, 0.9]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1.0, y: 0.0 }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={disable ? null : handleSubmit}
          >
            {loading
              ? <ActivityIndicator size="small" color="#FFF" animating />
              : <IoIcon name="md-checkmark" style={styles.checkIconSty} />
          }
          </TouchableOpacity>
        </LinearGradient>
        {this.renderLoaderModal()}
      </KeyboardAwareScrollView>
    );
  }
}

OtpForm.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  handleSubmit: PropTypes.func,
};

OtpForm.defaultProps = {
  navigation: {},
  authActions: {},
  handleSubmit: () => null,
};

function mapStateToProps(state) {
  const selector = formValueSelector('sOtp_Form');
  const OtpCode = selector(state, 'OtpCode');
  return {
    OtpCode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'sOtp_Form',
  enableReinitialize: true,
})(OtpForm));
