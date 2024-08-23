import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import {
  findNodeHandle,
  Keyboard,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import IoIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { required, uName } from '../config/validation';
import renderField from '../config/renderField';
import colors from '../config/styles';
import common from '../config/genStyle';

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

class SignNameForm extends Component {
  constructor(props) {
    super(props);
    this.refFields = [];
    this.state = {};
  }

  onFocusScroll = (refName) => {
    const node = findNodeHandle(this.refFields[refName]);
    this.scroll.scrollToFocusedInput(node, extraHeight, 0);
  };

  setNextFocus = (refName) => {
    if (this.refFields[refName]) {
      this.refFields[refName].focus();
    } else {
      Keyboard.dismiss();
    }
  };

  setRefField = (ref, refName) => {
    this.refFields[refName] = ref;
  };

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  render() {
    const {
      handleSubmit,
      userName,
      loading,
      valid,
      authActions: { trans },
    } = this.props;

    const reg = /^[a-zA-Z0-9_-]{3,15}$/;
    const validUserName =
      _.isString(userName) && userName !== '' && reg.test(userName) === true;
    const disable = !validUserName || !valid;
    const active = validUserName;

    return (
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 40,
          paddingTop: 20,
        }}
        keyboardShouldPersistTaps="handled"
        ref={(c) => {
          if (c != null) {
            this.scroll = c;
          }
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text numberOfLines={1} style={[common.headerTitle]}>
            {trans('SignNameForm_set_user_name_text')}
          </Text>
        </View>

        <View>
          <Field
            name="username"
            type="text"
            label=""
            component={renderField}
            placeholder={trans('SignNameForm_field_1_placeholder')}
            validate={[required, uName]}
            refField={this.setRefField}
            refName="username"
            onEnter={handleSubmit}
            onFocus={() => this.onFocusScroll('username')}
          />
        </View>

        <Text numberOfLines={3} style={[common.textNormal, styles.InfoTextSty]}>
          {trans('SignNameForm_profile_name_desc_text')}
        </Text>

        <LinearGradient
          colors={
            active
              ? [
                  colors.brandAppButtonTopColor,
                  colors.brandAppButtonBottomColor,
                ]
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
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" animating />
            ) : (
              <IoIcon name="md-checkmark" style={styles.checkIconSty} />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    );
  }
}

SignNameForm.propTypes = {
  handleSubmit: PropTypes.func,
  navigation: PropTypes.objectOf(PropTypes.any),
  userName: PropTypes.string,
  loading: PropTypes.bool,
  valid: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

SignNameForm.defaultProps = {
  handleSubmit: () => null,
  navigation: {},
  userName: '',
  loading: false,
  valid: false,
  authActions: {},
};

function mapStateToProps(state) {
  const selector = formValueSelector('sName_Form');
  const userName = selector(state, 'username');
  return {
    userName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(
  reduxForm({
    form: 'sName_Form',
    enableReinitialize: false,
    destroyOnUnmount: false,
  })(SignNameForm)
);
