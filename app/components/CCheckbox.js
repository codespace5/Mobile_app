import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
import { CheckBox } from 'react-native-elements';
import colors from '../config/styles';
import common from '../config/genStyle';

const styles = StyleSheet.create({
  containerStyle: {
    marginLeft: 0,
    marginRight: 0,
    paddingVertical: 0,
    paddingLeft: 0,
    paddingRight: 20,
    backgroundColor: '#0000',
    borderWidth: 0,
    width: '100%',
    justifyContent: 'flex-start',
  },
  error: {
    color: colors.errorColor,
  },
  warning: {
    color: colors.warningColor,
  },
});

class CCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { checkboxTitle, meta, input } = this.props;
    return (
      <View>
        <CheckBox
          checked={input.value ? true : false}
          onIconPress={() => {
            if (_.isFunction(input.onChange)) {
              input.onChange(!input.value);
            }
          }}
          checkedColor={colors.brandAppBackColor}
          uncheckedColor={colors.brandAppBackColor}
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          size={20}
          containerStyle={styles.containerStyle}
          title={checkboxTitle}
        />
        <View style={{ marginLeft: 5 }}>
          {meta.touched
            && ((meta.error
                && <Text style={[common.textSmall, styles.error]}>{meta.error}</Text>)
              || (meta.warning
                && <Text style={[common.textSmall, styles.warning]}>{meta.warning}</Text>))}
        </View>
      </View>
    );
  }
}

CCheckbox.propTypes = {
  checkboxTitle: PropTypes.objectOf(PropTypes.any),
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    error: PropTypes.string,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    visited: PropTypes.bool.isRequired,
  }).isRequired,
};

CCheckbox.defaultProps = {
  checkboxTitle: {},
};

export default CCheckbox;
