import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Keyboard,
  FlatList,
  Platform,
  // ActivityIndicator,
  // Text,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import CHeader from '../components/CHeader';
import CFollowers from '../components/CFollowers';
// import CListView from '../components/CListView';
import CInput from '../components/CInput';
// import CButton from '../components/CButton';
import authActions from '../redux/reducers/auth/actions';
import { getApiData } from '../redux/utils/apiHelper';
import settings from '../config/settings';
// import colors from '../config/styles';
// import common from '../config/genStyle';
import CError from '../components/CError';
import CLoader from '../components/CLoader';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imgsty: {
    height: RFValue(40),
    width: RFValue(40),
    marginRight: RFValue(15),
    borderRadius: RFValue(20),
  },
  CommonLoaderErrorViewSty: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#000',
  },
  oopsTitleText: {
    fontSize: RFValue(32),
    color: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#0008',
  },
  inputViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === 'ios' ? '#0000' : '#8e8e93',
    backgroundColor: '#FFF',
  },
  searchIconViewStyle: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderView: {
    borderBottomColor: '#8e8e93',
    borderBottomWidth: RFValue(1),
    paddingVertical: RFValue(8),
  },
});

class Followers extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      page: 1,
      isMore: true,
      loading: true,
      followersList: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
    this.getUserFollowersList();
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  getUserFollowersList = (loadMore, search) => {
    Keyboard.dismiss();
    const { auth: { token }, navigation } = this.props;
    const {
      page, followersList, isMore, searchText,
    } = this.state;

    const otherUserId = navigation.getParam('uid');
    console.log(otherUserId);

    const headers = {
      authorization: `Bearer ${token}`,
    };

    let pg = page;
    if (loadMore) {
      pg = page + 1;
    } else if (search) {
      pg = 1;
    }

    let detail;

    if (_.isObject(otherUserId) && !_.isEmpty(otherUserId)) {
      detail = {
        user_id: otherUserId.user_id,
        page: pg,
        q: searchText,
      };
    } else if (otherUserId !== '' && otherUserId !== undefined) {
      detail = {
        user_id: otherUserId,
        page: pg,
        q: searchText,
      };
    } else {
      detail = {
        me: '1',
        page: pg,
        q: searchText,
      };
    }

    if (isMore || search) {
      this.setState({ loading: true }, () => {
        getApiData(settings.endpoints.user_followers, 'get', detail, headers).then((response) => {
          // console.log(response);
          if (response.success === true) {
            let dummyData = followersList;
            let PG = false;
            if (loadMore && _.isObject(response.data) && _.isArray(response.data.rows)) {
              const { pagination, rows } = response.data;
              dummyData = followersList.concat(rows);
              if (_.isObject(pagination)) {
                PG = pagination.isMore;
              }
            } else if (_.isObject(response.data) && _.isArray(response.data.rows)) {
              const { pagination } = response.data;
              dummyData = response.data.rows;
              if (_.isObject(pagination)) {
                PG = pagination.isMore;
              }
            }
            this.setState({
              followersList: dummyData,
              page: pg,
              isMore: PG,
              loading: false,
            });
          } else {
            this.setState({ followersList: [], loading: false });
          }
        }).catch((err) => {
          console.log(err);
          this.setState({ followersList: [], loading: false });
        });
      });
    }
  }

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  renderFollowersList = ({ item }) => (
    <CFollowers
      {...this.props}
      data={item}
      type="followers"
      getFollowerList={(l, s) => this.getUserFollowersList(l, s)}
    />
  )

  renderNoData = () => {
    const { loading } = this.state;
    const { navigation, authActions: { trans } } = this.props;
    const otherUserId = navigation.getParam('uid');
    if (loading) {
      return <CLoader />;
    }

    if (otherUserId !== '' && otherUserId !== undefined) {
      return (
        <CError
          type={trans('Followers_no_data_text_title')}
          icon="user"
          errorText={trans('Followers_other_user_flist_msg')}
        />
      );
    }

    return (
      <CError
        type={trans('Followers_no_data_text_title')}
        icon="user"
        errorText={trans('Followers_user_flist_msg')}
      />
    );
  }

  render() {
    const { followersList, searchText } = this.state;
    const { navigation, authActions: { trans } } = this.props;
    const uData = navigation.getParam('data');
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          showRightText
          ShowRightIcon
          centerText={trans('Followers_page_title')}
          // rightIconName="Add-user"
          // onRightIconAction={() => { console.log('On right Action'); }}
          onBackAction={() => navigation.goBack()}
        />
        {/* {_.isArray(followersList) && followersList.length > 0 ? (
          followersList.map(data => (
            <CFollowers
              key={`id_${data.id}`}
              data={data}
            />
          ))
        ) : null} */}
        {uData.followers > 0 || uData.followers !== '0' ? (
          <View style={styles.inputViewStyle}>
            <View style={[styles.searchIconViewStyle, Platform.OS === 'ios' ? styles.borderView : {}]}>
              <Icon name="md-search" style={{ color: '#8e8e93', fontSize: RFValue(20) }} />
            </View>
            <View style={{ flex: 1 }}>
              <CInput
                placeholder={trans('Followers_search_input_placeholder')}
                keyboardType="default"
                ref={(o) => { this.searchInput = o; }}
                onChangeText={(t) => { this.setState({ searchText: t }, () => {
                  if (this.state.searchText === '') {
                    this.getUserFollowersList(false, true);
                  }
                }); }}
                value={searchText}
                onSubmitEditing={() => this.getUserFollowersList(false, true)}
                returnKeyType="go"
                selectionColor="#0009"
                blurOnSubmit={false}
                underlineColorAndroid
                inputStyle={{ borderBottomWidth: 0, borderBottomColor: 'transparent' }}
                viewStyle={{ paddingHorizontal: RFValue(2) }}
              />
            </View>
          </View>
        ) : null}
        {_.isArray(followersList) && followersList.length > 0 ? (
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            pagingEnabled
            data={followersList}
            ref={(o) => { this.commentScroll = o; }}
            renderItem={this.renderFollowersList}
            keyExtractor={(item, index) => `Followers_list${index}`}
            contentContainerStyle={styles.ScrollConSty}
            onEndReached={() => this.getUserFollowersList(true)}
          />
        ) : this.renderNoData()}
      </View>
    );
  }
}

Followers.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

Followers.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
