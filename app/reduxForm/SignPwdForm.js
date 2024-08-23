import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  formValueSelector,
} from 'redux-form';
import {
  findNodeHandle,
  // Keyboard,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import IoIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { required, minLength6 } from '../config/validation';
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

class SignPwdForm extends Component {
  constructor(props) {
    super(props);
    this.refFields = [];
    this.state = {
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

  render() {
    const {
      handleSubmit,
      userPwd,
      submitting,
      authActions: { trans },
    } = this.props;

    const validPwd = _.isString(userPwd) && userPwd !== '' && userPwd.length >= 6;
    const disable = !_.isString(userPwd) || submitting === true;
    const active = _.isString(userPwd) && userPwd !== '' && validPwd === true;

    return (
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 40, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
        ref={(c) => { if (c != null) { this.scroll = c; } }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text
            numberOfLines={1}
            style={[common.headerTitle]}
          >
            {trans('SignPwdForm_set_password_text')}
          </Text>
          <Text style={[common.textSmall, { color: '#8e8e93' }, { paddingLeft: 2 }]}>
            {trans('SignPwdForm_character_required_text')}
          </Text>
        </View>

        <View>
          <Field
            name="userPwd"
            type="password"
            label=""
            component={renderField}
            placeholder={trans('SignPwdForm_field_1_text')}
            validate={[required, minLength6]}
            refField={this.setRefField}
            refName="userPwd"
            onEnter={handleSubmit}
            onFocus={() => this.onFocusScroll('userPwd')}
          />
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
            {submitting
              ? <ActivityIndicator size="small" color="#FFF" animating />
              : <IoIcon name="md-checkmark" style={styles.checkIconSty} />
          }
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    );
  }
}

SignPwdForm.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  handleSubmit: PropTypes.func,
  userPwd: PropTypes.string,
  submitting: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

SignPwdForm.defaultProps = {
  navigation: {},
  handleSubmit: () => null,
  userPwd: '',
  submitting: false,
  authActions: {},
};

function mapStateToProps(state) {
  const selector = formValueSelector('sPwd_Form');
  const userPwd = selector(state, 'userPwd');
  return {
    userPwd,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'sPwd_Form',
  enableReinitialize: true,
})(SignPwdForm));
