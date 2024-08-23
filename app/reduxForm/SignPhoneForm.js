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
import { required, maxLength14 } from '../config/validation';
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

class SignPhoneForm extends Component {
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

  setNextFocus = (refName) => {
    if (this.refFields[refName]) {
      this.refFields[refName].focus();
    } else {
      Keyboard.dismiss();
    }
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
      phone,
      loading,
      valid,
      authActions: { trans },
    } = this.props;

    const validPhoneNo = _.isString(phone) && phone !== '';
    const disable = !validPhoneNo || !valid;
    const active = validPhoneNo;

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
            {trans('SignPhoneForm_set_phone_text')}
          </Text>
        </View>

        <View>
          <Field
            name="phone"
            type="text"
            label=""
            component={renderField}
            placeholder={trans('SignPhoneForm_field_1_placeholder')}
            validate={[required, maxLength14]}
            refField={this.setRefField}
            refName="phone"
            onEnter={handleSubmit}
            onFocus={() => this.onFocusScroll('phone')}
            keyboardType="phone-pad"
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
            {loading
              ? <ActivityIndicator size="small" color="#FFF" animating />
              : <IoIcon name="md-checkmark" style={styles.checkIconSty} />
          }
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAwareScrollView>
    );
  }
}

SignPhoneForm.propTypes = {
  handleSubmit: PropTypes.func,
  navigation: PropTypes.objectOf(PropTypes.any),
  phone: PropTypes.string,
  loading: PropTypes.bool,
  valid: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

SignPhoneForm.defaultProps = {
  handleSubmit: () => null,
  navigation: {},
  phone: '',
  loading: false,
  valid: false,
  authActions: {},
};

function mapStateToProps(state) {
  const selector = formValueSelector('sPhone_Form');
  const phone = selector(state, 'phone');
  return {
    phone,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'sPhone_Form',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(SignPhoneForm));
