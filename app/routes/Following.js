import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Keyboard,
  // ActivityIndicator,
  FlatList,
  // Text,
  Platform,
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
import settings from '../config/settings';
import { getApiData } from '../redux/utils/apiHelper';
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
  inputStyleView: {
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
    borderBottomWidth: 1,
    paddingVertical: RFValue(8),
  },
});

class Following extends Component {
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
      FollowersList: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
    this.getUserFollowingList();
  }

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  getUserFollowingList = (loadMore, search) => {
    Keyboard.dismiss();
    const { auth: { token }, navigation } = this.props;
    const {
      page, FollowersList, isMore, searchText,
    } = this.state;

    const otherUserId = navigation.getParam('uid');

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
        following_id: otherUserId.user_id,
        page: pg,
        q: searchText,
      };
    } else if (otherUserId !== '' && otherUserId !== undefined) {
      detail = {
        following_id: otherUserId,
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
        getApiData(settings.endpoints.user_following, 'get', detail, headers).then((response) => {
          // console.log(response);
          if (response.success === true) {
            let dummyData = FollowersList;
            let PG = false;
            if (loadMore && _.isObject(response.data) && _.isArray(response.data.rows)) {
              const { pagination, rows } = response.data;
              dummyData = FollowersList.concat(rows);
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
              FollowersList: dummyData,
              page: pg,
              isMore: PG,
              loading: false,
            });
          } else {
            this.setState({ FollowersList: [], loading: false });
          }
        }).catch((err) => {
          console.log(err);
          this.setState({ FollowersList: [], loading: false });
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
      getFollowingList={(l, s) => this.getUserFollowingList(l, s)}
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
          type={trans('Following_no_data_text_title')}
          icon="user"
          errorText={trans('Following_other_user_flist_msg')}
        />
      );
    }

    return (
      <CError
        type={trans('Following_no_data_text_title')}
        icon="user"
        errorText={trans('Following_user_flist_msg')}
      />
    );
  }

  render() {
    const { FollowersList, searchText } = this.state;
    const { navigation, authActions: { trans } } = this.props;
    const uData = navigation.getParam('data');
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          showRightText
          ShowRightIcon
          centerText={trans('Following_page_title')}
          // rightIconName="Add-user"
          // onRightIconAction={() => { console.log('On right Action'); }}
          onBackAction={() => navigation.goBack()}
        />
        {/* {_.isArray(FollowersList) && FollowersList.length > 0 ? (
          FollowersList.map(data => (
            <CFollowers
              key={`id_${data.id}`}
              data={data}
            />
          ))
        ) : null} */}
        {uData.following > 0 || uData.following !== '0' ? (
          <View style={styles.inputStyleView}>
            <View style={[styles.searchIconViewStyle, Platform.OS === 'ios' ? styles.borderView : {}]}>
              <Icon name="md-search" style={{ color: '#8e8e93', fontSize: RFValue(20) }} />
            </View>
            <View style={{ flex: 1 }}>
              <CInput
                placeholder={trans('Following_search_input_placeholder')}
                keyboardType="default"
                ref={(o) => { this.searchInput = o; }}
                onChangeText={(t) => {
 this.setState({ searchText: t }, () => {
                  if (this.state.searchText === '') {
                    this.getUserFollowingList(false, true);
                  }
                }); 
}}
                value={searchText}
                onSubmitEditing={() => { this.getUserFollowingList(false, true); }}
                returnKeyType="go"
                selectionColor="#0009"
                blurOnSubmit={false}
                underlineColorAndroid
                inputStyle={{ borderBottomWidth: 0, borderBottomColor: 'transparent' }}
                viewStyle={{ paddingHorizontal: 2 }}
              />
            </View>
          </View>
        ) : null}
        {_.isArray(FollowersList) && FollowersList.length > 0 ? (
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            pagingEnabled
            data={FollowersList}
            ref={(o) => { this.commentScroll = o; }}
            renderItem={this.renderFollowersList}
            keyExtractor={(item, index) => `Following_list${index}`}
            contentContainerStyle={styles.ScrollConSty}
            onEndReached={() => this.getUserFollowingList(true)}
          />
        ) : this.renderNoData()}
      </View>
    );
  }
}

Following.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
  navigation: PropTypes.objectOf(PropTypes.any),
};

Following.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Following);
