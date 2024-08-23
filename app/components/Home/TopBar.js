import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArray, toInteger } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import homeActions from '../../redux/reducers/home/actions';
import authActions from '../../redux/reducers/auth/actions';
import { Icon } from '../../config/icons';
import common from '../../config/genStyle';
import colors from '../../config/styles';

// define your styles
const styles = StyleSheet.create({
  tobTabBarView: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: '#0000',
    flexDirection: 'row',
    zIndex: 10,
    height: RFValue(60),
    width: Dimensions.get('window').width,
  },
  IconStyles: {
    fontSize: RFValue(20),
    color: '#FFF',
  },
  TobBarMainView: {
    padding: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
    borderBottomWidth: 2,
  },
  UserTextSty: {
    lineHeight: RFValue(22),
    letterSpacing: 0.3,
    color: '#FFF',
  },
});

class TopBar extends PureComponent {
    handleTab = (id) => {
      const { setCurrentVideoTab } = this.props;
      setCurrentVideoTab(id);
    }

    render() {
      const { currentTab, tabData, trans } = this.props;

      return (
        <View style={[styles.tobTabBarView]}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.tobTabBarView]}
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
          >
            {isArray(tabData) && tabData.length > 0 ? (
              tabData.map(data => (
                <TouchableOpacity
                  key={`id_${data.id}`}
                  activeOpacity={0.8}
                  onPress={() => { this.handleTab(data.id); }}
                  style={[styles.TobBarMainView,
                    { borderBottomColor: currentTab === data.id ? colors.brandAppBackColor : '#0000' },
                  ]}
                >
                  {data.id === 4 ? <FIcon name="theater-masks" style={[styles.IconStyles, { fontSize: RFValue(18) }]} /> : (
                    <Icon
                      name={currentTab === data.id ? data.fillIcon : data.IconName}
                      style={styles.IconStyles}
                    />
                  )}
                  <Text
                    numberOfLines={1}
                    style={[common.textNBold, styles.UserTextSty, { fontSize: RFValue(10) }]}
                  >
                    { data.price }
                  </Text>
                </TouchableOpacity>
              ))
            ) : null}
          </LinearGradient>
        </View>
      );
    }
}

TopBar.propTypes = {
  currentTab: PropTypes.number,
  tabData: PropTypes.arrayOf(PropTypes.object),
  setCurrentVideoTab: PropTypes.func,
  trans: PropTypes.func,
};

TopBar.defaultProps = {
  currentTab: 3,
  tabData: [],
  setCurrentVideoTab: () => {},
  trans: () => {},
};
// export default TopBar;

function mapStateToProps(state) {
  return {
    currentTab: state.home.currentTab,
    tabData: state.home.tabData,
  };
}

function mapDispatchToProps(dispatch) {
  const { setCurrentVideoTab } = homeActions;
  const { trans } = authActions;
  return {
    setCurrentVideoTab: bindActionCreators(setCurrentVideoTab, dispatch),
    trans: bindActionCreators(trans, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
