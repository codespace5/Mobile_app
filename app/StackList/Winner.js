import { createStackNavigator } from "react-navigation";
import Winner from "../routes/Winner";
import OtherUserProfile from "../routes/OtherUserProfile";
import Followers from "../routes/Followers";
import Following from "../routes/Following";
import VideoList from "../routes/VideoList";
import SigninName from "../routes/SigninName";
import SigninEmail from "../routes/SigninEmail";
import SigninPhone from "../routes/SigninPhone";
import SigninPassword from "../routes/SigninPassword";
import SigninOtp from "../routes/SigninOtp";
import Login from "../routes/Login";
import ForgotPwd from "../routes/ForgotPwd";
import OfflineScreen from "../routes/OfflineScreen";
import SearchScreen from '../routes/SearchScreen';

const winnerStack = createStackNavigator({
  Winner,
  OtherUserProfile,
  Followers,
  Following,
  VideoList,
  SigninName,
  SigninEmail,
  SigninPhone,
  SigninPassword,
  SigninOtp,
  Login,
  ForgotPwd,
  OfflineScreen,
  SearchScreen,
});

// winnerStack.navigationOptions = ({ navigation }) => {
//   let tabBarVisible;
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map((route) => {
//       if (
//         route.routeName === 'Winner'
//       ) {
//         tabBarVisible = true;
//       } else {
//         tabBarVisible = false;
//       }
//     });
//   }

winnerStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: false,
});

// return {
//   tabBarVisible,
// };
// };

export default winnerStack;
