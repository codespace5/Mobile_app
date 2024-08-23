import React, { Component } from 'react';
import {
  View,
  Text,
	Image,
	Dimensions,
	StyleSheet,
	Platform,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import AIcon from 'react-native-vector-icons/AntDesign';
import colors from '../config/styles';
import common from '../config/genStyle';
import { FORTAB } from '../config/MQ';

const iosWinnerText = Platform.OS === 'ios' ? 25 : 23;

const styles = StyleSheet.create({
	UserSty: {
    width: (Dimensions.get('window').width / 2) - 2,
    height: (Dimensions.get('window').width / 2) - 2,
    margin: 4,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
	},
	imgSty: {
    width: '100%',
    height: '100%',
	},
	oViewSty: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 3,
    left: 3,
    alignItems: 'center',
	},
	AIconSty: {
    fontSize: RFValue(15),
    color: '#FFF',
	},
	voteNoText: {
    color: '#FFF',
    marginLeft: 3,
    marginBottom: -3,
	},
	WinnerTextViewSty: {
    position: 'absolute',
    backgroundColor: '#0000',
    top: FORTAB ? 5 : -4,
    left: FORTAB ? -40 : -30,
    borderBottomColor: colors.brandAppBackColor,
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
});

class CSearchVideoList extends Component {

  goto = (page) => {
    const { data, navigation, onFbAction, onGoogleAction, openModal } = this.props;
    navigation.navigate(page, {
      data,
      openModal,
      type: 'otherUserVideo',
      onFbAction,
      onGoogleAction,
    });
  }

  render() {
		const { data } = this.props;
		const ribbenText = _.isObject(data) && _.isString(data.ribbon_text) ? data.ribbon_text : '';
		const videoImg = _.isObject(data) && _.isString(data.video_image) ? data.video_image : '';
		const count = _.isObject(data) && _.isString(data.video_vote) ? data.video_vote : '0';

    return (
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.UserSty}
				onPress={() => { this.goto('VideoList'); }}
			>
				{/* <View style={styles.WinnerTextViewSty}>
					<Text numberOfLines={1} style={[common.textSmall, styles.winnerTextSty]}>
						{ribbenText}
					</Text>
        </View> */}
        
				<Image
					source={{ uri: videoImg }}
					style={styles.imgSty}
				/>
				<View style={styles.oViewSty}>
					<AIcon name="like2" style={styles.AIconSty} />
					<Text numberOfLines={1} style={[common.textSmall, common.semiBold, styles.voteNoText]}>
						{count}
					</Text>
				</View>
			</TouchableOpacity>
    );
  }
}

export default CSearchVideoList;
