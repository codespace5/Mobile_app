import React from 'react';
import {
  TouchableOpacity, Text, NativeModules, requireNativeComponent, Platform,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';

const { AppleAuthentication } = NativeModules;


export const RNSignInWithAppleButton = requireNativeComponent('RNCSignInWithAppleButton');

export const SignInWithAppleButton = ({
  buttonText = '', callBack, 
  buttonStyle = {
    borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', flexDirection: 'row',
    paddingRight: 20, paddingLeft: 20,
  }, 
  textStyle = {
    fontWeight: 'bold', fontSize: 12, color: 'white', textAlign: 'center', marginTop: 10, marginBottom: 10,
  },
}) => {
  if (Platform.OS === 'ios') {
    if (buttonText !== '') {
      return (
        <TouchableOpacity
          style={buttonStyle}
          onPress={async () => {
            await appleAuth(callBack);
          }}
        >
           <FAIcon
              name='apple'
              size={14}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          <Text style={textStyle}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <RNSignInWithAppleButton
        style={buttonStyle}
        onPress={async () => {
          await appleAuth(callBack);
        }}
      />
    );
  }
  return null;
};
const appleAuth = async (callBack) => {
  await AppleAuthentication.requestAsync({
    requestedScopes: [AppleAuthentication.Scope.FULL_NAME, AppleAuthentication.Scope.EMAIL],
  }).then((response) => {
    callBack(response); // Display response
  }, (error) => {
    callBack(error); // Display error
  });
};

export default AppleAuthentication;
