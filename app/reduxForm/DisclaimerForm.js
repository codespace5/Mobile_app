import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  formValueSelector,
} from 'redux-form';
import {
  findNodeHandle,
  Keyboard,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import renderField from '../config/renderField';
import { required, maxLength60 } from '../config/validation';
import CButton from '../components/CButton';
import common from '../config/genStyle';
import authActions from '../redux/reducers/auth/actions';

const extraHeight = Platform.OS === 'ios' ? 0 : 300;

const styles = StyleSheet.create({
  poststy: {
    flex: 1,
    paddingHorizontal: 20,
  },
  btnwrap: {
    paddingVertical: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
});

class DisclaimerForm extends Component {
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
      // submitting,
      // disclaimer,
      authActions: { trans },
    } = this.props;
    return (
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        ref={(c) => { if (c != null) { this.scroll = c; } }}
      >
        <View style={styles.poststy}>
          <Field
            name="disclaimer"
            type="text"
            label=""
            component={renderField}
            placeholder={trans('DisclaimerForm_disclaimer_placeholder_text')}
            validate={[required, maxLength60]}
            refField={this.setRefField}
            refName="disclaimer"
            keyboardType="default"
            textArea
            mgBottom={5}
            onEnter={handleSubmit}
            viewStyle={{ borderColor: 'transparent' }}
            onFocus={() => this.onFocusScroll('disclaimer')}
          />

          <View style={styles.btnwrap}>
            <CButton
              btnText={trans('DisclaimerForm_next_btn_text')}
              textStyle={[common.textH3, common.semiBold, { color: '#FFF' }]}
              onPress={handleSubmit}
              // load={submitting}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

DisclaimerForm.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  handleSubmit: PropTypes.func,
};

DisclaimerForm.defaultProps = {
  navigation: {},
  authActions: {},
  handleSubmit: () => null,
};

function mapStateToProps(state) {
  const selector = formValueSelector('disclaimer_Form');
  const disclaimer = selector(state, 'disclaimer');
  return {
    disclaimer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null)(reduxForm({
  form: 'disclaimer_Form',
  enableReinitialize: true,
  initialValues: {
    disclaimer: __DEV__ ? 'Test disclaimer' : '',
  },
})(DisclaimerForm));
