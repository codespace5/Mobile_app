import { createStackNavigator } from 'react-navigation';
import Login from '../routes/Login';
import SigninEmail from '../routes/SigninEmail';
import SigninPhone from '../routes/SigninPhone';
import ForgotPwd from '../routes/ForgotPwd';
import SigninName from '../routes/SigninName';
import SigninOtp from '../routes/SigninOtp';
import Profile from '../routes/Profile';
import BlockedUser from '../routes/BlockedUser';
import EditProfile from '../routes/EditProfile';
import SigninPassword from '../routes/SigninPassword';
import PrivacySetting from '../routes/PrivacySetting';
import AddBank from '../routes/AddBank';
import AddPaypal from '../routes/AddPaypal';
import BankDetails from '../routes/BankDetails';
import ChangePwd from '../routes/ChangePwd';
import Language from '../routes/Language';
import VideoList from '../routes/VideoList';
import Followers from '../routes/Followers';
import Following from '../routes/Following';
import UserWinner from '../routes/UserWinner';
import Country from '../routes/Country';
import MakePayment from '../routes/MakePayment';
import OfflineScreen from '../routes/OfflineScreen';
import OtherUserProfile from '../routes/OtherUserProfile';
import ContactUs from '../routes/ContactUs';

const profileStack = createStackNavigator({
  Profile,
  Login,
  ForgotPwd,
  SigninName,
  SigninEmail,
  SigninPhone,
  SigninOtp,
  SigninPassword,
  PrivacySetting,
  BlockedUser,
  VideoList,
  Followers,
  Following,
  AddBank,
  AddPaypal,
  BankDetails,
  ChangePwd,
  Language,
  UserWinner,
  EditProfile,
  Country,
  MakePayment,
  OfflineScreen,
  OtherUserProfile,
  ContactUs,
});

profileStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map((route) => {
      if (
        route.routeName === 'Profile'
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

export default profileStack;
