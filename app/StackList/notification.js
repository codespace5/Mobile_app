import { createStackNavigator } from 'react-navigation';
import Notification from '../routes/Notification';
import OtherUserProfile from '../routes/OtherUserProfile';
import VideoList from '../routes/VideoList';
import UserWinner from '../routes/UserWinner';
import OfflineScreen from '../routes/OfflineScreen';

const notificationStack = createStackNavigator({
  Notification,
  OtherUserProfile,
  VideoList,
  UserWinner,
  OfflineScreen,
});

notificationStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map((route) => {
      if (
        route.routeName === 'Notification'
      ) {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }

  return {
    tabBarVisible,
  };
};

export default notificationStack;
