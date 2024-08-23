import { createStackNavigator } from 'react-navigation';
import OtherUserProfile from '../routes/OtherUserProfile';
import Home from '../routes/Home';
import SigninName from '../routes/SigninName';
import SigninEmail from '../routes/SigninEmail';
import SigninPhone from '../routes/SigninPhone';
import SigninPassword from '../routes/SigninPassword';
import SigninOtp from '../routes/SigninOtp';
import Login from '../routes/Login';
import ForgotPwd from '../routes/ForgotPwd';
import VideoList from '../routes/VideoList';
import UserWinner from '../routes/UserWinner';
import Followers from '../routes/Followers';
import Following from '../routes/Following';
import OfflineScreen from '../routes/OfflineScreen';
import Country from '../routes/Country';
import SearchScreen from '../routes/SearchScreen';

const homeStack = createStackNavigator({
  Home,
  OtherUserProfile,
  SigninName,
  SigninEmail,
  SigninPhone,
  SigninPassword,
  SigninOtp,
  Login,
  ForgotPwd,
  VideoList,
  UserWinner,
  Followers,
  Following,
  OfflineScreen,
  Country,
  SearchScreen,
});

homeStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: false,
});

export default homeStack;
