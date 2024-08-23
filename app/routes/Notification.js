import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  AppState,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CHeader from '../components/CHeader';
import CListView from '../components/CListView';
import authActions from '../redux/reducers/auth/actions';
import colors from '../config/styles';
import { FORTAB } from '../config/MQ';
import { getApiData } from '../redux/utils/apiHelper';
import settings from '../config/settings';
import CError from '../components/CError';
import { CAlert } from '../components/CAlert';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

class Notification extends Component {
static navigationOptions = {
  header: null,
};

constructor(props) {
  super(props);
  this.state = {
    pageLoad: true,
    moreItems: true,
    page: 1,
    notificationList: [],
    appState: AppState.currentState,
  };
}

componentDidMount = () => {
  const { navigation } = this.props;
  this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
  AppState.addEventListener('change', this.handleAppStateChange);
}

componentWillReceiveProps = async (nextProps) => {
  const {
    auth,
    // navigation,
    authActions: { setBadge },
  } = this.props;
  if (!_.isEqual(auth.notification, nextProps.auth.notification)
  && !_.isEmpty(nextProps.auth.notification)) {
    try {
      const CurrentScreen = await AsyncStorage.getItem('activeScreen');
      console.log(CurrentScreen);
      if (_.isString(CurrentScreen) && CurrentScreen !== '' && CurrentScreen === 'Notification') {
        this.getNotificationList(true);
        setTimeout(() => {
          setBadge(0);
        }, 50);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

componentWillUnmount = () => {
  if (this.onWillFocusSubscription) {
    this.onWillFocusSubscription.remove();
  }
  AppState.removeEventListener('change', this.handleAppStateChange);
}

onWillFocus = (payload) => {
  const { authActions: { setBadge } } = this.props;
  this.getNotificationList(true);
  setLeaveBreadcrumb(payload);
  setTimeout(() => {
    setBadge(0);
  }, 50);
}

handleAppStateChange = (nextAppState) => {
  if (
    this.state.appState.match(/inactive|background/)
    && nextAppState === 'active'
  ) {
    this.onWillFocus();
  }
  this.setState({ appState: nextAppState });
};

getNotificationList = (bool) => {
  const { authActions: { setBadge }, auth: { token } } = this.props;
  setBadge(0);

  let {
    page,
    moreItems,
    notificationList,
  } = this.state;

  if (bool === true) {
    this.setState({
      pageLoad: true,
      moreItems: true,
      page: 1,
      notificationList: [],
    });
    page = 1;
    moreItems = true;
    notificationList = [];
  }

  getApiData(settings.endpoints.get_Notification, 'get', { page }, { Authorization: `Bearer ${token}` })
    .then((responseJson) => {
      if (this.CListView && this.CListView.loadingpage === true) {
        this.CListView.removeLoader();
      }

      if (responseJson.success === true) {
        let pageNo = page;
        let nMoreItems = moreItems;
        let nDummyData = notificationList;

        if (_.isObject(responseJson.data) && _.isArray(responseJson.data.rows)) {
          nDummyData = nDummyData.concat(responseJson.data.rows);
        }

        if (_.isObject(responseJson.data)
          && _.isObject(responseJson.data.pagination)
          && responseJson.data.pagination.totalPage > 0) {
          if (responseJson.data.pagination.totalPage > page) {
            nMoreItems = true;
            pageNo = page + 1;
          } else {
            nMoreItems = false;
          }
        }

        this.setState({
          notificationList: nDummyData,
          page: pageNo,
          moreItems: nMoreItems,
          pageLoad: false,
        });
      } else {
        if (this.CListView && this.CListView.loadingpage === true) {
          this.CListView.removeLoader();
        }
        this.setState({ pageLoad: false, notificationList: [] }, () => {
          console.log(responseJson.errors);
        });
      }
    }).catch((err) => {
      console.log(err);
      if (this.CListView && this.CListView.loadingpage === true) {
        this.CListView.removeLoader();
      }
      this.setState({ pageLoad: false, notificationList: [] }, () => {
        console.log('Something Went wrong');
      });
    });
}

goto = (page) => {
  const { navigation } = this.props;
  navigation.navigate(page);
}

removeAllNotification = () => {
  const { auth: { token }, authActions: { trans } } = this.props;

  CAlert(trans('Notification_all_notification_delete_confirmation_msg_text'), trans('confirm_alert_msg_title'), () => {
    this.setState({ pageLoad: true }, () => {
      getApiData(settings.endpoints.remove_all_Notification, 'get', null, {
        Authorization: `Bearer ${token}`,
      })
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            this.setState({
              notificationList: [],
              pageLoad: false,
            });
          } else {
            this.setState({ pageLoad: false, notificationList: [] }, () => {
              console.log(responseJson.errors);
            });
          }
        }).catch((err) => {
          console.log(err);
          this.setState({ pageLoad: false, notificationList: [] }, () => {
            console.log('Something Went wrong');
          });
        });
    });
  }, () => null);
}

renderErrorView = () => {
  const { authActions: { trans } } = this.props;
  return (
    <CError
      errorText={trans('Notification_no_notification_available')}
    />
  );
}

renderMainView = () => {
  const { notificationList, moreItems } = this.state;
  if (_.isArray(notificationList)) {
    return (
      <View style={{ flex: 1, paddingHorizontal: FORTAB ? 20 : 10 }}>
        <CListView
          {...this.props}
          ref={(o) => { this.CListView = o; }}
          type="NotificationList"
          ErrorViewText={this.renderErrorView}
          refresh
          data={notificationList}
          onRefresh={() => { this.getNotificationList(true); }}
          more={moreItems}
          onLoadMore={this.getNotificationList}
          getNotification={() => this.getNotificationList(true)}
        />
      </View>
    );
  }

  return null;
}

renderLoaderView = () => {
  const { pageLoad } = this.state;
  if (pageLoad) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="small" color={colors.brandAppBackColor} animating />
      </View>
    );
  }
  return this.renderErrorView();
}

render() {
  const { pageLoad, notificationList } = this.state;
  const { auth: { token }, authActions: { trans } } = this.props;
  const headerName = token !== '' && token !== null ? trans('Notification_page_title1') : trans('Notification_page_title2');
  const rightIconName = token !== '' && token !== null && _.isArray(notificationList) && notificationList.length > 0;
  return (
    <View style={styles.container}>
      <CHeader
        showBackArrow={false}
        showCenterText
        showRightText={rightIconName}
        ShowRightIcon
        centerText={headerName}
        // rightIconName="Inbox"
        notificationIcon
        notificationIconName="delete"
        onRightIconAction={this.removeAllNotification}
      />
      {pageLoad ? this.renderLoaderView() : this.renderMainView()}
    </View>
  );
}
}

Notification.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.func),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

Notification.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
