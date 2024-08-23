import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, StyleSheet, ActivityIndicator, Text,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../config/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  loaderText: {
    color: '#FFF',
    fontSize: RFValue(14),
    width: 200,
    textAlign: 'center',
    marginTop: 8,
  },
});

class CLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { contentStyle, textStyle, text } = this.props;
    return (
      <View style={[styles.container, contentStyle]}>
        <ActivityIndicator size="small" color={colors.brandAppBackColor} />
        {text ? (
          <Text style={[styles.loaderText, textStyle]}>{text}</Text>
        ) : null}
      </View>
    );
  }
}

CLoader.propTypes = {
  contentStyle: PropTypes.objectOf(PropTypes.any),
  textStyle: PropTypes.objectOf(PropTypes.any),
  text: PropTypes.string,
};

CLoader.defaultProps = {
  contentStyle: {},
  textStyle: {},
  text: '',
};

export default CLoader;
