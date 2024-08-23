import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import _ from 'lodash';
// import IoIcon from 'react-native-vector-icons/Ionicons';
// import colors from '../config/styles';
import common from '../config/genStyle';

const styles = StyleSheet.create({
  commentMainView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    marginBottom: RFValue(20),
    marginTop: RFValue(5),
  },
});

class CCommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // IconFill: false,
    };
  }

  onPressAction = () => {
    const { gotoOtherUser, data } = this.props;
    if (_.isFunction(gotoOtherUser)) {
      gotoOtherUser(data);
    }
    return null;
  }

  render() {
    const { data } = this.props;
    // const { IconFill } = this.state;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.commentMainView}
        // onPress={() => { this.setState({ IconFill: !IconFill }); }}
        onPress={this.onPressAction}
      >
        <TouchableOpacity
          activeOpacity={0.8}
        >
          <Image
            style={{ width: RFValue(34), height: RFValue(34), borderRadius: RFValue(17) }}
            source={{ uri: data.photo }}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={{ flex: 1, paddingLeft: RFValue(8), paddingRight: RFValue(15) }}>
          <Text numberOfLines={1} style={[common.textNormal, common.semiBold]}>{`@${data.username}`}</Text>
          <Text numberOfLines={8} style={[common.textSmall, { flexWrap: 'wrap', marginVertical: RFValue(5) }]}>{data.comment}</Text>
          <Text numberOfLines={1} style={[common.textSmall]}>{moment(data.time * 1000).fromNow()}</Text>
        </View>

        {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {IconFill
				  ? (
  <IoIcon
    name="ios-heart"
    style={{ fontSize: RFValue(15), color: colors.brandAppBackColor }}
  />
            ) : (
              <IoIcon
                name="ios-heart-empty"
                style={{ fontSize: RFValue(15), color: '#8e8e93' }}
              />
            )}
          <Text numberOfLines={1} style={[common.textSmall, { marginTop: 2, color: IconFill ? colors.brandAppBackColor : '#0008' }]}>722</Text>
        </View> */}
      </TouchableOpacity>
    );
  }
}

CCommentView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  gotoOtherUser: PropTypes.func,
};

CCommentView.defaultProps = {
  data: {},
  gotoOtherUser: () => null,
};

export default CCommentView;
