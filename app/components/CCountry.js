import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import FIcon from 'react-native-vector-icons/Feather';
import { Icon } from '../config/icons';
import colors from '../config/styles';


// define your styles
const styles = StyleSheet.create({
  Lcontainer: {
    paddingHorizontal: 20,
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

class CCountry extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { data, selectedData, selectCountry } = this.props;
    return (
      <View style={styles.Lcontainer}>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={selectCountry}
          >
            <View style={styles.languageWrap}>
              <Text>
                {_.isString(data.country_name) && data.country_name !== '' ? data.country_name : ''}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {selectedData.id === data.id
                  ? (
                    <Icon
                      name="Checked"
                      size={20}
                      style={{ color: colors.brandAppBackColor, marginRight: 10 }}
                    />
                  )
                  : null}
                {data.status === '1' ? (
                  <FIcon
                    name="video"
                    size={20}
                    style={{ color: colors.brandAppBackColor }}
                  />
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

CCountry.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  selectedData: PropTypes.objectOf(PropTypes.any),
  selectCountry: PropTypes.func,
};

CCountry.defaultProps = {
  data: {},
  selectedData: {},
  selectCountry: null,
};

export default CCountry;
