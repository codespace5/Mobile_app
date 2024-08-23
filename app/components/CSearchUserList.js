import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import colors from '../config/styles';
import common from '../config/genStyle';

const styles = StyleSheet.create({
  MainUserViewSty: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  ImgViewSty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  imgSty: {
    width: '100%',
    height: '100%',
  },
  UserIntroView: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

class CSearchUserList extends Component {

  goto = () => {
    const { navigation, data, onFbAction, onGoogleAction } = this.props;
    navigation.navigate('OtherUserProfile', {
      data,
      onFbAction,
      onGoogleAction,
    });
  }

  render() {
    const { data } = this.props;
    const imgUrl = _.isObject(data) && _.isString(data.photo) ? data.photo : '';
    const username = _.isObject(data) && _.isString(data.username) ? data.username : '';
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.MainUserViewSty}
        onPress={this.goto}
      >
        <View style={styles.ImgViewSty}>
          <Image
            source={{ uri: imgUrl }}
            style={styles.imgSty}
            resizeMode="cover"
          />
        </View>
        <View style={styles.UserIntroView}>
          <Text numberOfLines={1} style={[common.textH4, { color: '#696969' }]}>{username}</Text>
          {/* <Text numberOfLines={1} style={[common.textNormal, { color: '#A9A9A9' }]}>{'Other Message'}</Text> */}
        </View>
      </TouchableOpacity>
    );
  }
}

export default CSearchUserList;
