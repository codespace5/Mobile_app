/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import {
  StatusBar,
  AsyncStorage,
  YellowBox,
  Text,
  TextInput,
} from "react-native";
import codePush from 'react-native-code-push';
// import I18n from 'react-native-i18n';
import { Provider } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { InAppNotificationProvider } from "./app/libs/react-native-in-app-notification/src/index";
import TabNavigator from "./app/index";
import actions from "./app/redux/reducers/auth/actions";
import configureStore from "./app/redux/store/configureStore";
import Index from "./app/index";
import SplashScreen from "react-native-splash-screen";
// import Translations from './locales/en.json';

YellowBox.ignoreWarnings(["Require cycle:"]);
// console.log = () => {

// };
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

const store = configureStore();
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeReady: false,
    };
  }

  componentDidMount = async () => {
    // I18n.translations.en = Translations;
    SplashScreen.hide();
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null && value !== "") {
        store.dispatch({
          type: actions.SET_TOKEN,
          token: value,
        });
      }
      this.setState({
        storeReady: true,
      });
    } catch (error) {
      console.log("Error while Getting async store token ===> ", error);
      this.setState({
        storeReady: true,
      });
    }
  };

  getCurrentRouteName = async (navState) => {
    if (navState.hasOwnProperty("index")) {
      this.getCurrentRouteName(navState.routes[navState.index]);
    } else {
      try {
        await AsyncStorage.setItem("activeScreen", navState.routeName);
        console.log(navState.routeName);
      } catch (e) {
        console.log(e);
      }
    }
  };

  render() {
    const { storeReady } = this.state;
    if (!storeReady) return null;
    return (
      <Provider store={store}>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#000" }}
          // forceInset={{ bottom: 'never' }}
        >
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <InAppNotificationProvider
            closeInterval={5000}
            openCloseDuration={500}
            iconApp={require("./app/images/mtdlogo.png")}
          >
            {/* <TabNavigator
              {...this.props}
              onNavigationStateChange={(prevState, newState) => {
                this.getCurrentRouteName(newState);
              }}
            /> */}
            <Index
              {...this.props}
              onNavigationStateChange={(prevState, newState) => {
                this.getCurrentRouteName(newState);
              }}
            />
          </InAppNotificationProvider>
        </SafeAreaView>
      </Provider>
    );
  }
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
};

let myApp = null;
if (__DEV__) {
  myApp = App;
} else {
  myApp = codePush(codePushOptions)(App);
  // myApp = App;
}
export default myApp;
