/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

console.disableYellowBox = true;
const IOS = Platform.OS === 'ios';

if (IOS) {
  AppRegistry.registerComponent('MTC', () => App);
} else {
  AppRegistry.registerComponent(appName, () => App);
}
