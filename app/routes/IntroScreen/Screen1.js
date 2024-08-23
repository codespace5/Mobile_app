/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-constant-condition */
/* eslint-disable arrow-body-style */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../../config/styles';
import SignNameForm from '../../reduxForm/SignNameForm';
import CBannerAd from '../../components/CBannerAd';
import settings from '../../config/settings';
import { getApiDataProgress } from '../../redux/utils/apiHelper';

const styles = StyleSheet.create({
  BottomFixButton: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(25),
    alignItems: 'center',
    justifyContent: 'center',
    // right: RFValue(25),
    marginRight: 26,
    bottom: RFValue(10),
  },
  checkIconSty: {
    color: '#FFF',
    fontSize: RFValue(35),
  },
});

class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: false,
    };
    this.slider = null;
  }

  doSlide = () => {
    this.setState({ valid: false }, () => {
      setTimeout(() => {
        this.slider.goToSlide(3, true);
      }, 100);
    });
  };

  validation = () => {
    const { answer1, answer2 } = this.props;
    if (answer1 === '' || answer1 === 'Yes' || answer2 === '') {
      return false;
    }
    return true;
  };

  submitUpdateAnswer = () => {
    const { navigation, auth } = this.props;

    const data = {
      signed_artist: auth?.signup_answer?.answer1 || '',
      music_company: auth?.signup_answer?.answer2 || '',
    };
    const headers = {
      authorization: `Bearer ${auth?.token}`,
    };
    getApiDataProgress(
      settings.endpoints.updaterecord,
      'post',
      data,
      headers,
      null,
    )
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.success === true) {
          navigation.goBack();
        } else {
          console.log('error');
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  _renderItem = ({ item, index }) => {
    const { question1, answer1, answer2 } = this.props;
    return (
      // <View style={{ flex: 1 }}>
      //   {!this.state.valid ? (
      <ScrollView>
        <View style={{ paddingHorizontal: 26 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 24,
              color: '#000',
              fontFamily: colors.fonts.proximaNova.semiBold,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              textAlign: 'justify',
              marginTop: 26,
              fontSize: 16,
              fontFamily: colors.fonts.proximaNova.regular,
              lineHeight: 22,
            }}
          >
            {item.text}
          </Text>
          {item.text ? (
            <Text
              style={{
                textAlign: 'justify',
                marginTop: 20,
                fontSize: 16,
                fontFamily: colors.fonts.proximaNova.regular,
                lineHeight: 22,
              }}
            >
              {item.text2}
            </Text>
          ) : null}
          <Text
            style={{
              // textAlign: "justify",
              fontSize: 18,
              fontFamily: colors.fonts.proximaNova.semiBold,
              lineHeight: 22,
            }}
          >
            {item.question1}
          </Text>
          {item.question1 ? (
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 14,
                  width: 80,
                }}
                onPress={() => question1('Yes')}
              >
                <MIcon
                  name={
                    answer1 === 'Yes'
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  style={{
                    fontSize: RFValue(20),
                    color: '#ea6a1f',
                  }}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    fontFamily: colors.fonts.proximaNova.regular,
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 7,
                  width: 80,
                }}
                onPress={() => question1('No')}
              >
                <MIcon
                  name={
                    answer1 === 'No'
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  style={{
                    fontSize: RFValue(20),
                    color: '#ea6a1f',
                  }}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    fontFamily: colors.fonts.proximaNova.regular,
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {answer1 === 'Yes' ? (
            <Text
              style={{
                color: '#ea6a1f',
                marginTop: 10,
                fontFamily: colors.fonts.proximaNova.regular,
                textAlign: 'justify',
                fontWeight: '500',
              }}
            >
              {item.message1}
            </Text>
          ) : null}
          <Text
            style={{
              // textAlign: "justify",
              fontSize: 18,
              fontFamily: colors.fonts.proximaNova.semiBold,
              lineHeight: 22,
              marginTop: 16,
            }}
          >
            {item.question2}
          </Text>
          {item.question2 ? (
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 14,
                  width: 80,
                }}
                onPress={() => question1('que2Yes')}
              >
                <MIcon
                  name={
                    answer2 === 'Yes'
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  style={{
                    fontSize: RFValue(20),
                    color: '#ea6a1f',
                  }}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    fontFamily: colors.fonts.proximaNova.regular,
                  }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 7,
                  width: 80,
                }}
                onPress={() => {
                  question1('que2No');
                }}
              >
                <MIcon
                  name={
                    answer2 === 'No'
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  style={{
                    fontSize: RFValue(20),
                    color: '#ea6a1f',
                  }}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    fontFamily: colors.fonts.proximaNova.regular,
                  }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {answer2 === 'Yes' ? (
            <Text
              style={{
                color: '#ea6a1f',
                marginTop: 10,
                fontFamily: colors.fonts.proximaNova.regular,
                textAlign: 'justify',
                fontWeight: '500',
              }}
            >
              {item.message2}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    );
  };
  // eslint-disable-next-line lines-between-class-members
  _renderDoneButton = () => {
    const {
      navigation,
      auth: { signup_answer },
    } = this.props;
    console.log('Screen1 -> navigation', navigation);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ alignItems: 'center', justifyContent: 'center' }}
        onPress={() => {
          if (
            navigation?.state?.params?.data?.type === 'google'
            || navigation?.state?.params?.data?.type === 'facebook'
            || navigation?.state?.params?.data?.type === 'apple'
          ) {
            this.submitUpdateAnswer();
          } else {
            this.setState({ valid: true });
          }
        }}
        disabled={this.validation() ? false : true}
      >
        <LinearGradient
          colors={
            this.validation()
              ? [
                colors.brandAppButtonTopColor,
                colors.brandAppButtonBottomColor,
              ]
              : ['#D3D3D3', '#D3D3D3']
          }
          style={styles.BottomFixButton}
          // location={[0.5, 0.9]}
          start={{ x: 1, y: 1 }}
          end={{ x: 1.0, y: 0.0 }}
        >
          {false ? (
            <ActivityIndicator size="small" color="#FFF" animating />
          ) : (
            <IoIcon name="md-checkmark" style={styles.checkIconSty} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  _renderNextButton = () => {
    return (
      <LinearGradient
        colors={
          //   active
          [colors.brandAppButtonTopColor, colors.brandAppButtonBottomColor]
          // : ["#D3D3D3", "#D3D3D3"]
        }
        style={styles.BottomFixButton}
        // location={[0.5, 0.9]}
        start={{ x: 1, y: 1 }}
        end={{ x: 1.0, y: 0.0 }}
      >
        <MIcon
          name="chevron-right"
          style={{
            fontSize: RFValue(35),
            color: '#fff',
          }}
        />
      </LinearGradient>
    );
  };
  render() {
    const {
      authActions: { trans },
      auth: {
        adType: { admobUnitIdList },
      },
    } = this.props;
    const slides = [
      {
        key: 1,
        title: trans('introduction'),
        text: trans('introDescription'),
        // title: "Introduction",
        // text: "Music Talent Discovery (MTD) is a viral promotional music talent discovery platform that provides independent talented musicians worldwide the opportunity to showcase their music talent performance to generate likes and social media popularity to potentially become the next viral sensation and get signed by the record label/producers.",
      },
      {
        key: 2,
        title: trans('How_MTD_App_Works'),
        text: trans('App_Description1'),
        text2: trans('App_Description2'),
      },
      {
        key: 3,
        title: trans('Any_cost_promote'),
        text: trans('Any_cost_Description'),
      },
      {
        key: 4,
        title: trans('who_are_you'),
        question1: trans('question1'),
        question2: trans('question2'),
        message1: trans('que1Mess1'),
        message2: trans('que2Mess2'),
      },
    ];
    return (
      <View style={{ flex: 1 }}>
        {!this.state.valid ? (
          <View style={{ flex: 1 }}>
            {admobUnitIdList
              && admobUnitIdList.banner_Slider_Id[Platform.OS] && (
                <CBannerAd
                  bannerId={admobUnitIdList.banner_Slider_Id[Platform.OS]}
                />
            )}
            <AppIntroSlider
              ref={o => (this.slider = o)}
              renderItem={v => this._renderItem(v)}
              data={slides}
              renderNextButton={this._renderNextButton}
              renderDoneButton={this._renderDoneButton}
              dotStyle={{ display: 'none' }}
              extraData={this.state}
              style={{ marginTop: 10 }}
              // scrollEnabled={false}
            />
          </View>
        ) : (
          <SignNameForm
            {...this.props}
            // onSubmit={this.handleSubmit}
            // loading={pageLoad}
          />
        )}
      </View>
    );
  }
}
Screen1.propTypes = {
  question1: PropTypes.func,
  answer1: PropTypes.string,
  answer2: PropTypes.string,
  valid: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

Screen1.defaultProps = {
  question1: () => null,
  answer1: '',
  answer2: '',
  valid: false,
  authActions: {},
};
export default Screen1;
