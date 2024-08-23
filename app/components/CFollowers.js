/* eslint-disable import/named */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  View,
  Text,
  Image,
  // TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import colors from '../config/styles';
import common from '../config/genStyle';
import CButton from './CButton';
// import { FORTAB } from '../config/MQ';
import authActions from '../redux/reducers/auth/actions';
import { getApiDataProgress } from '../redux/utils/apiHelper';
import settings from '../config/settings';

// define your styles
const styles = StyleSheet.create({
  FollowersMainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingHorizontal: RFValue(15),
    marginVertical: RFValue(10),
  },
});

class CFollowers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoad: false,
      // buttonName: type === 'followers' ? 'Follow' : 'Following',
    };
  }

  getData = () => {
    const { type, getFollowerList, getFollowingList } = this.props;
    if (type === 'followers') {
      console.log('in followers');
      getFollowerList(false, true);
    } else {
      console.log('in else ===');
      getFollowingList(false, true);
    }
  }

  follow = (id) => {
    console.log('in follow page ====>>>');
    const { auth: { token } } = this.props;
    // const { followingBtn } = this.state;

    this.setState({ buttonLoad: true }, () => {
      getApiDataProgress(`${settings.endpoints.do_follow}?user_id=${id}`, 'get', null, {
        Authorization: `Bearer ${token}`,
      })
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            this.setState({
              buttonLoad: false,
              // followingBtn: followingBtn === 'Follow' ? 'Following' : 'Follow',
            }, () => {
              this.getData();
            });
          } else {
            this.setState({
              buttonLoad: false,
              // followingBtn: 'Follow',
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            buttonLoad: false,
            // followingBtn: 'Follow',
          });
        });
    });
  }

  goto = (data) => {
    const { navigation } = this.props;
    navigation.navigate('OtherUserProfile', {
      data,
    });
  }

  render() {
    const {
      data, type, auth: { userOtherData }, authActions: { trans },
    } = this.props;
    const { buttonLoad } = this.state;
    const userId = _.isObject(userOtherData) && !_.isEmpty(userOtherData) && userOtherData.user_id ? userOtherData.user_id : '';
    // console.log(data);
    // console.log(userId);
    const checkBtnText = trans('CFollowers_following_btn');
    const followingBtn = trans('CFollowers_follow_btn');
    return (
      <View style={[styles.FollowersMainView]}>
        <Image
          source={{ uri: data.photo }}
          style={{ width: RFValue(40), height: RFValue(40), borderRadius: RFValue(20) }}
        />
        <View style={{ flex: 1, paddingLeft: RFValue(8), paddingRight: RFValue(15) }}>
          <Text
            style={[common.textNormal, common.semiBold]}
            onPress={() => this.goto(data)}
          >
            {data.username}
          </Text>
          <Text style={[common.textSmall, { color: '#0008' }]}>{data.emailId}</Text>
        </View>
        {/* {type === 'followers' ? (
          <CButton
            btnText={data.meFollowing || data.loginFollowing ? 'Following' : followingBtn}
            btnStyle={{ width: '22%', height: 30 }}
            textStyle={{ fontSize: RFValue(14) }}
            onPress={() => this.follow(data.id)}
            load={buttonLoad}
          />
        ) : (
          <CButton
            btnText="Following"
            btnStyle={{ width: '22%', height: 30 }}
            textStyle={{ fontSize: RFValue(14) }}
            onPress={() => this.follow(data.id)}
            load={buttonLoad}
          />
        )} */}
        {type === 'followers' && _.toString(userId) !== _.toString(data.id) ? (
          <CButton
            btnText={data.loginFollowing ? checkBtnText : followingBtn}
            btnStyle={{ width: '22%', height: 30 }}
            textStyle={{ fontSize: RFValue(14) }}
            onPress={_.toString(userId) !== _.toString(data.id) ? () => this.follow(data.id) : () => null}
            load={buttonLoad}
          />
        ) : null}
        {type !== 'followers' && _.toString(userId) !== _.toString(data.id) ? (
          <CButton
            btnText={data.loginFollowing ? checkBtnText : followingBtn}
            btnStyle={{ width: '22%', height: 30 }}
            textStyle={{ fontSize: RFValue(14) }}
            onPress={_.toString(userId) !== _.toString(data.id) ? () => this.follow(data.id) : () => null}
            load={buttonLoad}
          />
        ) : null}
        {/* {Fill
          ? (
            <CButton
              btnText="Follow"
              btnStyle={{ width: '20%', height: 25 }}
              textStyle={{ fontSize: RFValue(11) }}
              onPress={() => { this.setState({ Fill: !Fill }); }}
            />
          )

          : (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                width: '20%', height: 25, borderRadius: 5, marginVertical: FORTAB ? 10 : 5, padding: 2, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5E5', alignItems: 'center', justifyContent: 'center',
              }}
              onPress={() => { this.setState({ Fill: !Fill }); }}
            >
              <Text style={{
                backgroundColor: '#0000',
                color: '#000',
                fontFamily: colors.fonts.proximaNova.semiBold,
                fontSize: FORTAB ? 14 : 11,
                letterSpacing: 0.5,
              }}
              >
    Following
              </Text>
            </TouchableOpacity>
          )} */}
      </View>
    );
  }
}

CFollowers.propTypes = {
  auth: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  getFollowerList: PropTypes.func,
  getFollowingList: PropTypes.func,
  type: PropTypes.string,
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
};

CFollowers.defaultProps = {
  auth: {},
  data: {},
  getFollowerList: () => null,
  getFollowingList: () => null,
  type: '',
  navigation: {},
  authActions: {},
};

function mapStateToProps(state) {
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

export default connect(mapStateToProps, mapDispatchToProps)(CFollowers);
