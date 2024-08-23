/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import common from '../config/genStyle';
import { Icon } from '../config/icons';

const NotificationBadge = props => (
  props.badge > 0
    ? (
      <View style={{ position: 'relative' }}>
        <View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: -5,
            right: -9,
            zIndex: 10,
          }}
        >
          <Text numberOfLines={1} style={[common.textNBold, { color: '#FFF' }]}>
            {props.badge}
          </Text>
        </View>
        <Icon name={props.iName} style={{ fontSize: RFValue(18) }} color={props.color} />
      </View>
    )
    : <Icon name={props.iName} style={{ fontSize: RFValue(18) }} color={props.color} />
);

NotificationBadge.propTypes = {
  iName: PropTypes.string,
  color: PropTypes.string,
  badge: PropTypes.number,
};

NotificationBadge.defaultProps = {
  iName: 'Comment-outline',
  color: 'gray',
  badge: 0,
};

export default connect(state => ({ badge: state.auth.badge }))(NotificationBadge);
