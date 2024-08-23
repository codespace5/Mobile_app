import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '../config/icons';
import colors from '../config/styles';
import common from '../config/genStyle';

const styles = StyleSheet.create({
  ImageViewSty: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 2,
    // marginRight: 5,
  },
  UserSty: {
    width: '100%',
    height: '100%',
  },
  IconSty: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffc000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 7,
    right: 7,
  },
  CatIconSty: {
    color: '#FFF',
    fontSize: RFValue(13),
  },
  rankTextSty: {
    color: '#ef755b',
    fontSize: RFValue(14),
    position: 'absolute',
  },
  RankViewSty: {
    width: 35,
    height: 35,
    position: 'absolute',
    top: 7,
    left: 2,
  },
  BottomUserViewSty: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
});

class CWinnerUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goto = (page, data, onFbAction, onGoogleAction) => {
    const { navigation } = this.props;
    navigation.navigate(page, {
      data,
      type: 'winner',
      onFbAction,
      onGoogleAction,
    });
  }

  render() {
    const { data, onFbAction, onGoogleAction } = this.props;
    const videoImg = _.isObject(data) && _.isString(data.video_img) && data.video_img !== '' ? data.video_img : '';
    const username = _.isObject(data) && _.isString(data.username) && data.username !== '' ? data.username : '';
    const catName = _.isObject(data) && _.isString(data.category) && data.category !== '' ? data.category : '';
    const userPosition = _.isObject(data) && _.isNumber(data.position)
      && data.position > 0 ? data.position : 0;
    // const userPosition = 22;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.ImageViewSty}
        onPress={() => {
          this.goto('VideoList', {
            data, type: 'winner', onFbAction, onGoogleAction,
          });
        }}
      >
        <Image source={{ uri: videoImg }} style={styles.UserSty} />
        {catName
          ? (
            <LinearGradient
              colors={[colors.brandAppButtonTopColor, colors.brandAppButtonBottomColor]}
              style={styles.IconSty}
              location={[0.5, 0.9]}
              start={{ x: 1, y: 1 }}
              end={{ x: 1.0, y: 0.0 }}
            >
              {catName === 'Singers'
                ? <Icon name="Microphone-outline" style={styles.CatIconSty} />
                : null}
              {catName === 'Rappers'
                ? <Icon name="Mic-outline" style={styles.CatIconSty} />
                : null}
              {catName === 'Other Talent'
                ? <Icon name="happy-outline" style={styles.CatIconSty} />
                : null}
              {catName === 'Dancers'
                ? <Icon name="dance-1" style={styles.CatIconSty} />
                : null}
              {catName === 'Poetry'
                ? <FIcon name="theater-masks" style={styles.CatIconSty} />
                : null}
              {/* {catName === 'jokes'
                ? <Icon name="theater-masks" style={styles.CatIconSty} /> : null}
              */}
            </LinearGradient>
          ) : null}

        {userPosition > 0
          ? (
            <View style={styles.RankViewSty}>
              <Image
                source={require('../images/medal.png')}
                style={styles.UserSty}
                resizeMode="cover"
              />
            </View>
          ) : null}

        {userPosition > 0
          ? (
            <Text
              numberOfLines={1}
              style={[common.textNBold, styles.rankTextSty, {
                left: userPosition > 9 ? 13 : 16,
                top: Platform.OS === 'ios' ? 13 : 11,
              }]}
            >
              {userPosition}
            </Text>
          ) : null
        }

        {username
          ? (
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
              style={styles.BottomUserViewSty}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
              <Text
                numberOfLines={1}
                style={[common.textNormal, common.semiBold,
                  {
                    color: '#FFF',
                  },
                ]}
              >
                {username}
              </Text>
            </LinearGradient>
          ) : null
        }
      </TouchableOpacity>
    );
  }
}

CWinnerUser.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  onFbAction: PropTypes.func,
  onGoogleAction: PropTypes.func,
};

CWinnerUser.defaultProps = {
  navigation: {},
  data: {},
  onFbAction: () => null,
  onGoogleAction: () => null,
};

// make this component available to the app
export default CWinnerUser;
