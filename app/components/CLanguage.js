import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { Icon } from '../config/icons';
import colors from '../config/styles';


// define your styles
const styles = StyleSheet.create({
  Lcontainer: {
    paddingHorizontal: 20,
  },
  languages: {
    flex: 1,
  },
  languageWrap: {
    paddingVertical: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});

class CLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { data, selectedData, selectLanguage } = this.props;
    return (
      <View style={styles.Lcontainer}>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={selectLanguage}
          >
            <View style={styles.languageWrap}>
              <Text>
                {_.isString(data.name) && data.name !== '' ? data.name : ''}
              </Text>
              {selectedData.language_id === data.language_id
                ? (
                  <Icon
                    name="Checked"
                    size={20}
                    style={{ color: colors.brandAppBackColor }}
                  />
                )
                : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

CLanguage.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  selectedData: PropTypes.objectOf(PropTypes.any),
  selectLanguage: PropTypes.func,
};

CLanguage.defaultProps = {
  data: {},
  selectedData: {},
  selectLanguage: null,
};

export default CLanguage;
