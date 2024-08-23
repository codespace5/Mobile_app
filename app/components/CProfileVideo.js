import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import _ from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import AIcon from 'react-native-vector-icons/AntDesign';
import common from '../config/genStyle';
import colors from '../config/styles';
import { FORTAB } from '../config/MQ';

const iosWinnerText = Platform.OS === 'ios' ? 25 : 23;

const styles = StyleSheet.create({
  UserSty: {
    width: (Dimensions.get('window').width / 2) - 2,
    height: (Dimensions.get('window').width / 2) - 2,
    marginHorizontal: 1,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  WinnerTextViewSty: {
    position: 'absolute',
    backgroundColor: '#0000',
    top: FORTAB ? 5 : -4,
    left: FORTAB ? -40 : -30,
    borderRightColor: '#0000',
    borderLeftColor: '#0000',
    borderLeftWidth: FORTAB ? 30 : 20,
    borderRightWidth: FORTAB ? 30 : 20,
    borderBottomWidth: FORTAB ? 30 : 20,
    paddingVertical: 10,
    paddingHorizontal: FORTAB ? 35 : 24,
    transform: [{ rotate: '315deg' }],
    zIndex: 10,
  },
  winnerTextSty: {
    position: 'absolute',
    top: FORTAB ? 26 : iosWinnerText,
    left: -1,
    color: '#FFF',
    width: FORTAB ? 80 : 52,
    textAlign: 'center',
    flexWrap: 'wrap',
    letterSpacing: 0.5,
    fontFamily: colors.fonts.proximaNova.regular,
    fontSize: RFValue(10),
  },
  imgSty: {
    width: '100%',
    height: '100%',
  },
  otherViewSty: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 3,
    left: 3,
    alignItems: 'center',
  },
  IconSty: {
    fontSize: RFValue(15),
    color: '#FFF',
  },
  voteNoText: {
    color: '#FFF',
    marginLeft: 3,
    marginBottom: -3,
  },
});

class CProfileVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goto = (page) => {
    const { data, navigation, openModal } = this.props;
    navigation.navigate(page, {
      data,
      openModal,
      type: 'otherUserVideo',
    });
  }

  onChange = () => {
    const { data } = this.props;
    const { openActionSheet } = this.props;
    if (_.isFunction(openActionSheet)) {
      openActionSheet(data);
    } else {
      this.goto('VideoList');
    }
  }

  render() {
    const { data } = this.props;
    const imgUrl = _.isObject(data) && _.isString(data.video_image) && data.video_image !== '' ? data.video_image : '';
    const voteNo = _.isObject(data) && _.isString(data.video_vote) && data.video_vote !== '' ? data.video_vote : '';
    const ribbinText = _.isObject(data) && _.isString(data.ribbon_text) && data.ribbon_text !== '' ? data.ribbon_text : '';

    const ribbonTextColors = {
      Draft: '#666',
      Winner: colors.brandAppBackColor,
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.onChange}
        style={styles.UserSty}
      >
        <View
          style={[
            styles.WinnerTextViewSty,
            { borderBottomColor: ribbonTextColors[ribbinText] ? ribbonTextColors[ribbinText] : '#008000' },
          ]}
        >
          <Text numberOfLines={1} style={[common.textSmall, styles.winnerTextSty]}>
            {ribbinText}
          </Text>
        </View>

        <Image source={{ uri: imgUrl }} style={styles.imgSty} />
        <View style={styles.otherViewSty}>
          <AIcon name="like2" style={styles.IconSty} />
          <Text numberOfLines={1} style={[common.textSmall, common.semiBold, styles.voteNoText]}>
            {voteNo}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

CProfileVideo.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  openActionSheet: PropTypes.func,
  openModal: PropTypes.func,
};

CProfileVideo.defaultProps = {
  navigation: {},
  data: {},
  openActionSheet: null,
  openModal: null,
};

export default CProfileVideo;
