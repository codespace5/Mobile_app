import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import { Icon } from '../config/icons';
import common from '../config/genStyle';
import CWinnerUser from './CWinnerUser';

const styles = StyleSheet.create({
  ScrollSubMainView: {
    paddingVertical: RFValue(20),
    borderBottomColor: '#8e8e93',
    borderBottomWidth: 1,
  },
  MonthHeaderSty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imgViewSty: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: '#8e8e93',
    overflow: 'hidden',
  },
  ImgSty: {
    width: '100%',
    height: '100%',
  },
  MonthTitleSty: {
    textAlign: 'center',
    marginLeft: RFValue(10),
  },
  winnerView: {
    borderWidth: 1,
    borderColor: '#0008',
    borderRadius: RFValue(5),
    alignItems: 'center',
    justifyContent: 'center',
    padding: RFValue(30),
    marginTop: RFValue(15),
  },
  winnerIconSty: {
    color: '#0008',
    fontSize: RFValue(60),
  },
  winnerTextSty: {
    color: '#0008',
    marginTop: RFValue(8),
    textAlign: 'center',
    width: '80%',
  },
});

class CWinnerList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  }

  render() {
    const { data, authActions: { trans } } = this.props;
    return (
      <View style={styles.ScrollSubMainView}>
        <View style={styles.MonthHeaderSty}>
          <View style={styles.imgViewSty}>
            <Image
              source={require('../images/mtdlogo.png')}
              style={styles.ImgSty}
              resizeMode="cover"
            />
          </View>
          <Text
            style={[common.textH3, common.semiBold, styles.MonthTitleSty]}
          >
            {data.monthName}
          </Text>
        </View>

        {_.isArray(data.winnerList) && data.winnerList.length > 0
          ? (
            <ScrollView
              bounces={false}
              horizontal
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              ref={(o) => { this.HorizontalScroll = o; }}
              contentContainerStyle={{ marginTop: 15, flexGrow: 1 }}
            >
              {_.isArray(data.winnerList) && data.winnerList.length > 0
                ? data.winnerList.map(item => (
                  <CWinnerUser
                    {...this.props}
                    key={`id_${item.id}`}
                    data={item}
                  />
                ))
                : null
          }
            </ScrollView>
          )
          : (
            <View style={styles.winnerView}>
              <Icon name="Winning" style={styles.winnerIconSty} />
              <Text numberOfLines={2} style={[common.textNormal, styles.winnerTextSty]}>
                {trans('CWinnerList_winner_declare_msg')}
              </Text>
            </View>
          )
        }
      </View>
    );
  }
}

CWinnerList.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
};

CWinnerList.defaultProps = {
  navigation: {},
  data: {},
  authActions: {},
};

export default CWinnerList;
