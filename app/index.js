/* eslint-disable no-useless-constructor */
/* eslint-disable global-require */
/* eslint-disable react/prefer-stateless-function */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import React from 'react';
// import {
//   createAppContainer,
//   createBottomTabNavigator,
// } from 'react-navigation';
// import { RFValue } from 'react-native-responsive-fontsize';
// import _ from 'lodash';
// import colors from './config/styles';
// import profileStack from './StackList/profile';
// import uploadVideoStack from './StackList/uploadVideo';
// import winnerStack from './StackList/Winner';
// import homeStack from './StackList/homeStack';
// import notificationStack from './StackList/notification';

// import { Label, TabIcon } from './components/Navigation';

// const TabNavigator = createBottomTabNavigator(
//   {
//     Home: homeStack,
//     Top: winnerStack,
//     post: uploadVideoStack,
//     Notifications: notificationStack,
//     Me: profileStack,
//   },
//   {
//     initialRouteName: 'Home',
//     backBehavior: 'initialRoute',
//     resetOnBlur: false,
//     defaultNavigationOptions: ({ navigation }) => ({
//       tabBarLabel: ({ focused, tintColor }) => {
//         const { routeName } = navigation.state;
//         return (
//           <Label
//             routeName={routeName}
//           />
//         );
//       },
//       tabBarIcon: ({ focused, tintColor }) => {
//         const { routeName } = navigation.state;
//         return <TabIcon routeName={routeName} focused={focused} tintColor={tintColor} />;
//       },
//     }),
//     tabBarPosition: 'bottom',
//     tabBarOptions: {
//       activeTintColor: '#0008',
//       inactiveTintColor: 'gray',
//       showLabel: true,
//       labelStyle: {
//         fontSize: RFValue(10),
//         fontFamily: colors.fonts.proximaNova.semiBold,
//       },
//       style: {
//         backgroundColor: '#FFF',
//         paddingVertical: RFValue(5),
//       },
//     },
//   },
// );

// export default createAppContainer(TabNavigator);

/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Image } from "react-native";
import TabNavigator from "./routes/Navigation";
import SplashScreen from "react-native-splash-screen";
import authActions from "./redux/reducers/auth/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      splash: true,
    };
  }

  componentDidMount() {
    const {
      authActions: { setAdType },
    } = this.props;
    SplashScreen.hide();
    setTimeout(() => {
      this.setState({
        splash: false,
      });
    }, 5000);
    setAdType({ RewardAd: true, InterstitialAd: true });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.splash ? (
          <Image
            source={require("../app/images/MTDSplash.gif")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="stretch"
          />
        ) : (
          <TabNavigator {...this.props} />
        )}
      </View>
    );
  }
}

Index.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  auth: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  authActions: {},
  auth: {},
};

function mapStateToProps(state) {
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

export default connect(mapStateToProps, mapDispatchToProps)(Index);
