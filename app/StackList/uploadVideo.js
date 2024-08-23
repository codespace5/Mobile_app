import { createStackNavigator } from 'react-navigation';
import UploadVideo from '../routes/UploadVideo';
import Post from '../routes/Post';
import MakePayment from '../routes/MakePayment';
import FreePostConfirmation from '../routes/FreePostConfirmation';
import Disclaimer from '../routes/Disclaimer';
import OfflineScreen from '../routes/OfflineScreen';

const uploadVideoStack = createStackNavigator({
  UploadVideo,
  Post,
  Disclaimer,
  MakePayment,
  FreePostConfirmation,
  OfflineScreen,
});

uploadVideoStack.navigationOptions = ({ navigation }) => ({
  tabBarVisible: false,
});

// uploadVideoStack.navigationOptions = ({ navigation }) => {
//   let tabBarVisible;
//   if (navigation.state.routes.length > 1) {
//     navigation.state.routes.map((route) => {
//       if (
//         route.routeName === 'Disclaimer'
//         || route.routeName === 'MakePayment'
//         || route.routeName === 'Post'
//       ) {
//         tabBarVisible = false;
//       } else {
//         tabBarVisible = true;
//       }
//     });
//   }

//   return {
//     tabBarVisible,
//   };
// };

export default uploadVideoStack;
