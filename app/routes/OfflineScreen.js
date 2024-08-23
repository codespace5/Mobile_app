import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import FIcon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import authActions from '../redux/reducers/auth/actions';
import common from '../config/genStyle';
import { setLeaveBreadcrumb } from '../redux/utils/CommonFunction';

const styles = StyleSheet.create({
  MainOfflineScreen: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  ErrorViewSty: {
    top: 0,
    left: 0,
    right: 0,
    height: RFValue(30),
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ErrorTextSty: {
    color: '#FFF',
    letterSpacing: 0.3,
  },
  SubViewSty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 135,
  },
  NetworkIconSty: {
    fontSize: RFValue(50),
    color: '#D4D4D4',
  },
  TitleSty: {
    marginTop: RFValue(30),
  },
  subTitleSty: {
    color: '#0006',
    marginTop: RFValue(15),
  },
  RefreshBtnSty: {
    width: '60%',
    padding: RFValue(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: RFValue(5),
    alignSelf: 'center',
  },
  btnTextSty: {
    letterSpacing: 0.3,
  },
});

class OfflineScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      SetHeight: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener('willFocus', this.onWillFocus);
  }
  
  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
  }
  
  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  }

  setViewHeight = () => {
    const { SetHeight } = this.state;
    Animated.timing(
      SetHeight,
      {
        toValue: 30,
        duration: 500,
      },
    ).start();

    setTimeout(() => {
      Animated.timing(
        SetHeight,
        {
          toValue: 0,
          duration: 600,
        },
      ).start();
    }, 1000);
  }

  render() {
    const { SetHeight } = this.state;
    const { authActions: { trans } } = this.props;
    return (
      <View style={styles.MainOfflineScreen}>
        <Animated.View style={[styles.ErrorViewSty, { height: SetHeight }]}>
          <Text numberOfLines={1} style={[common.textSmall, common.semiBold, styles.ErrorTextSty]}>
            {trans('OfflineScreen_no_internet_connection_text')}
          </Text>
        </Animated.View>

        <View style={styles.SubViewSty}>
          <FIcon name="wifi-off" style={styles.NetworkIconSty} />
          <Text numberOfLines={1} style={[common.textH3, common.semiBold, styles.TitleSty]}>
            {trans('OfflineScreen_network_error_text')}
          </Text>
          <Text numberOfLines={1} style={[common.textNormal, common.semiBold, styles.subTitleSty]}>
            {trans('OfflineScreen_check_network_text')}
          </Text>
        </View>


        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.RefreshBtnSty}
          onPress={() => { this.setViewHeight(); }}
        >
          <Text numberOfLines={1} style={[common.textNormal, styles.btnTextSty]}>
            {trans('OfflineScreen_refresh_btn_text')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// export default OfflineScreen;
OfflineScreen.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
};

OfflineScreen.defaultProps = {
  authActions: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflineScreen);
