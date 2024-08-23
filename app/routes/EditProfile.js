import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {
  stopSubmit,
  startSubmit,
} from 'redux-form';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import authActions from '../redux/reducers/auth/actions';
import EditProfileForm from '../reduxForm/EditProfileForm';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import { getReduxErrors } from '../components/CAlert';
import settings from '../config/settings';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  // profileSty: {
  //   paddingTop: 35,
  //   paddingBottom: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   position: 'relative',
  // },
  // imgSty: {
  //   height: 120,
  //   width: 120,
  //   borderRadius: 60,
  //   overflow: 'hidden',
  // },
  // mainInputViewSty: {
  //   paddingHorizontal: 20,
  // },
  // cameraSty: {
  //   width: 34,
  //   height: 34,
  //   borderRadius: 17,
  //   overflow: 'hidden',
  //   position: 'absolute',
  //   bottom: 25,
  //   right: '32%',
  //   backgroundColor: colors.brandAppBackColor,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
});

class EditProfile extends Component {
static navigationOptions = {
  header: null,
};

constructor(props) {
  super(props);
  this.state = {};
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
  Keyboard.dismiss();
  this.editProfiledata(values);
}

editProfiledata = (values) => {
  const { auth: { token }, authActions: { trans }, dispatch } = this.props;
  console.log(token);
  const data = {
    'UserEditForm[username]': _.isObject(values) && _.isString(values.username) ? values.username : '',
    'UserEditForm[email]': _.isObject(values) && _.isString(values.email) ? values.email : '',
    'UserEditForm[phone]': _.isObject(values) && _.isString(values.phone) ? values.phone : '',
  };
  dispatch(startSubmit('Edit_ProfileForm'));
  getApiDataProgress(settings.endpoints.me_update, 'post', data, {
    Authorization: `Bearer ${token}`,
  }, null)
    .then((responseJson) => {
      console.log(responseJson);
      if (responseJson.success === true) {
        this.goto('Profile');
      } else {
        const ErrObj = getReduxErrors(responseJson);
        dispatch(stopSubmit('Edit_ProfileForm', ErrObj));
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(stopSubmit('Edit_ProfileForm', {
        _error: trans('network_error_msg'),
      }));
    });
}

goto = (page) => {
  const { navigation } = this.props;
  navigation.navigate(page);
}

render() {
  const { auth: { editData } } = this.props;

  const isEdit = _.isObject(editData) && editData.is_social === true ? false : true;
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <EditProfileForm
          {...this.props}
          onSubmit={this.handleSubmit}
          isEdit={isEdit}
          editData={editData}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}
}

EditProfile.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
};

EditProfile.defaultProps = {
  authActions: {},
  auth: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
