/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { RFValue } from 'react-native-responsive-fontsize';
import _ from 'lodash';
import colors from '../config/styles';
import profileStack from '../StackList/profile';
import uploadVideoStack from '../StackList/uploadVideo';
import winnerStack from '../StackList/Winner';
import homeStack from '../StackList/homeStack';
import notificationStack from '../StackList/notification';
import Device from 'react-native-device-info';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { Label, TabIcon } from '../components/Navigation';

const TabNavigator = createBottomTabNavigator(
  {
    Home: homeStack,
    Top: winnerStack,
    post: uploadVideoStack,
    Notifications: notificationStack,
    Profile: profileStack,
  },
  {
    initialRouteName: 'Home',
    backBehavior: 'initialRoute',
    resetOnBlur: false,
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        return <Label routeName={routeName} />;
      },
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        return (
          <TabIcon
            routeName={routeName}
            focused={focused}
            tintColor={tintColor}
          />
        );
      },
    }),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#0008',
      inactiveTintColor: 'gray',
      showLabel: true,
      labelStyle: {
        fontSize: RFValue(10),
        fontFamily: colors.fonts.proximaNova.semiBold,
      },
      style: {
        backgroundColor: '#FFF',
        paddingVertical: RFValue(5),
        marginBottom: Device.hasNotch && isIphoneX() ? -33 : 0,
      },
    },
  },
);

export default createAppContainer(TabNavigator);
