import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { isEmpty, isObject, isArray } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CHeader from '../components/CHeader';
import CButton from '../components/CButton';
import authActions from '../redux/reducers/auth/actions';
import settings from '../config/settings';
import { getApiData } from '../redux/utils/apiHelper';
import CLoader from '../components/CLoader';
import CError from '../components/CError';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  ScrollViewConSty: {
    flexGrow: 1,
    paddingBottom: 60,
  },
});
class BlockedUser extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      blockedData: [],
      loading: true,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.didFocusSubscription = navigation.addListener('didFocus', this.onDidFocus);
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }

    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onDidFocus = (payload) => {
    this.blockedList();
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  unblockUser = (user) => {
    const { auth: { token }, authActions: { setForceLoad } } = this.props;

    const data = {
      user_id: user.blocked_id,
    };

    this.setState({ loading: true }, () => {
      getApiData(settings.endpoints.unblock, 'get', data, {
        Authorization: `Bearer ${token}`,
      }).then((response) => {
        setForceLoad();
        if (response.success) {
          let blockedData = [];
          if (isObject(response.data)) {
            blockedData = response.data;
          }
          this.setState({ loading: false, blockedData });
        } else {
          this.setState({ loading: false });
        }
      }).catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
    });
  }

  blockedList = () => {
    const { auth: { token } } = this.props;
    this.setState({ blockedData: [], loading: true }, () => {
      getApiData(settings.endpoints.get_blocked_list, 'get', null, {
        Authorization: `Bearer ${token}`,
      }, null)
        .then((responseJson) => {
          if (responseJson.success === true) {
            if (isArray(responseJson.data)) {
              this.setState({
                blockedData: responseJson.data.length > 0 ? responseJson.data : [],
                loading: false,
              });
            } else {
              this.setState({
                blockedData: [],
                loading: false,
              });
            }
          } else {
            this.setState({
              blockedData: [],
              loading: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ blockedData: [], loading: false });
        });
    });
  }

  renderMainSubView = () => {
    const { authActions: { trans } } = this.props;
    const { blockedData, loading } = this.state;
    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.ScrollViewConSty}
      >
        {isArray(blockedData) && blockedData.length > 0 ? (
          blockedData.map((data, index) => (
            <View
              key={`${index}_${data.id}`}
              style={{
                borderBottomColor: '#DDD', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10,
              }}
            >
              <Text>{!isEmpty(data.firstname) && !isEmpty(data.lastname) ? `${data.firstname} ${data.lastname}` : data.username}</Text>
              <CButton
                btnText={trans('Profile_unblock_button_text')}
                load={loading}
                btnStyle={{
                  margin: 0, padding: 0, width: 90, justifyContent: 'center', alignItems: 'center',
                }}
                textStyle={{ fontSize: RFValue(12) }}
                onPress={() => { this.unblockUser(data); }}
              />
            </View>
          ))
        ) : <CError errorText={trans('Block_no_users_blocked')} />}
      </ScrollView>
    );
  }

  render() {
    const { navigation, authActions: { trans } } = this.props;
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans('Manage_blocked_users_page_title')}
          showRightIcon={false}
          showRightText={false}
          onBackAction={() => { navigation.goBack(); }}
        />
        {loading ? <CLoader /> : this.renderMainSubView()}
      </View>
    );
  }
}

BlockedUser.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
};

BlockedUser.defaultProps = {
  auth: {},
  navigation: {},
  authActions: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(BlockedUser);
