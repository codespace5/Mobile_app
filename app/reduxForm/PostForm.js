import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { VideoPlayer } from 'react-native-video-processing';
import Video from 'react-native-video';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import {
  findNodeHandle,
  Text,
  View,
  StyleSheet,
  Platform,
  // Image,
} from 'react-native';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  required,
  singleDropDown,
  checkBoxValue,
  checkBoxUGCValue,
  maxLength60,
} from '../config/validation';
import renderField from '../config/renderField';
import colors from '../config/styles';
import common from '../config/genStyle';
import CButton from '../components/CButton';
import { FORTAB } from '../config/MQ';

// const dropdownData = [
//   {
//     id: 1,
//     value: 'Singers',
//   },
//   {
//     id: 2,
//     value: 'Rappers',
//   },
//   {
//     id: 3,
//     value: 'Dancers',
//   },
//   {
//     id: 4,
//     value: 'Poetry',
//   },
//   {
//     id: 5,
//     value: 'Other Talents',
//   },
// ];

const extraHeight = Platform.OS === 'ios' ? 0 : 300;

const styles = StyleSheet.create({
  poststy: {
    marginBottom: 50,
  },
  videodesc: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#8e8e93',
    borderBottomWidth: 1,
  },
  imgsty: {
    width: 120,
    height: 180,
    marginVertical: 20,
  },
  videoStyle: {
    width: 120,
    height: 160,
  },
});

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.refFields = [];
    this.state = {};
  }

  onFocusScroll = (refName) => {
    const node = findNodeHandle(this.refFields[refName]);
    this.scroll.scrollToFocusedInput(node, extraHeight, 0);
  };

  setRefField = (ref, refName) => {
    this.refFields[refName] = ref;
  };

  render() {
    const {
      handleSubmit,
      // submitting,
      // categoryName,
      videoDesc,
      checkTermCondition,
      checkRulesCondition,
      checkUGCPermission,
      openTermsOfVideoContest,
      openOfficialRules,
      buttonLoad,
      videoData,
      pause,
      authActions: { trans },
    } = this.props;
    const buttonDisable = _.isString(videoDesc)
      && videoDesc !== ''
      && videoDesc.length <= 100
      && checkTermCondition === true
      && checkRulesCondition === true
      && checkUGCPermission === true;
    // _.isObject(categoryName) && !_.isEmpty(categoryName);
    const iosUrl = _.isObject(videoData)
      && _.isObject(videoData.videoFile)
      && videoData.videoFile.sourceURL !== ''
      ? videoData.videoFile.sourceURL
      : '';
    const androidUrl = _.isObject(videoData)
      && _.isObject(videoData.videoFile)
      && videoData.videoFile.path !== ''
      ? videoData.videoFile.path
      : '';
    const url = Platform.OS === 'ios' ? iosUrl : androidUrl;
    const checkTitle = (
      <Text
        numberOfLines={1}
        style={[common.regular, { fontSize: FORTAB ? 13 : 11, marginLeft: 5 }]}
      >
        {trans('PostForm_user_agree_text')}
        <Text
          style={{ color: colors.brandAppTextBlueColor }}
          onPress={openTermsOfVideoContest}
        >
          {` ${trans('PostForm_terms_video_text')}`}
        </Text>
        {/* <Text>
          {'and accept the '}
        </Text>
        <Text
          style={{ color: colors.brandAppTextBlueColor }}
          onPress={openPrivacyModal}
        >
          {'Privacy policy.'}
        </Text> */}
      </Text>
    );

    const checkRulesTitle = (
      <Text
        numberOfLines={1}
        style={[common.regular, { fontSize: FORTAB ? 13 : 11, marginLeft: 5 }]}
      >
        {trans('PostForm_user_rules_agree_text')}
        <Text
          style={{ color: colors.brandAppTextBlueColor }}
          onPress={openOfficialRules}
        >
          {` ${trans('PostForm_rules_video_text')}`}
        </Text>
      </Text>
    );

    const checkUGCTitle = (
      <Text
        numberOfLines={1}
        style={[common.regular, { fontSize: FORTAB ? 13 : 11, marginLeft: 5 }]}
      >
        {/* I grant UGC permission */}
        {` ${trans('PostForm_UGC_text')}`}
      </Text>
    );

    return (
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          ref={(c) => {
            if (c != null) {
              this.scroll = c;
            }
          }}
        >
          <View style={styles.poststy}>
            <View style={styles.videodesc}>
              <View style={{ width: '60%' }}>
                <Field
                  name="videoDesc"
                  type="text"
                  label=""
                  component={renderField}
                  placeholder={trans('PostForm_field_1_placeholder')}
                  keyboardType="default"
                  textArea
                  mgBottom={5}
                  validate={[required, maxLength60]}
                  refField={this.setRefField}
                  refName="videoDesc"
                  onEnter={handleSubmit}
                  inputStyle={{
                    borderBottomWidth: 0,
                    borderBottomColor: 'transparent',
                  }}
                  onFocus={() => this.onFocusScroll('videoDesc')}
                />
              </View>
              <View style={{ width: '40%', alignItems: 'flex-end' }}>
                <Video
                  source={{ uri: url }}
                  ref={(ref) => {
                    this.player = ref;
                  }}
                  style={styles.videoStyle}
                  // repeat
                  muted
                  paused={pause}
                  playInBackground={false}
                  onError={(e) => {
                    console.log(e);
                  }}
                  resizeMode="contain"
                />
                {/* <VideoPlayer
                  ref={(o) => { this.videoPlayerRef = o; }}
                  // startTime={30}
                  // endTime={120}
                  // play
                  replay
                  rotate
                  volume={0}
                  play
                  source={url}
                  playerWidth={120}
                  playerHeight={180}
                  style={styles.imgsty}
                  // resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                  // onChange={({ nativeEvent }) => console.log({ nativeEvent })}
                /> */}
                {/* <Image
                  source={{ uri: 'https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }}
                  style={styles.imgsty}
                /> */}
              </View>
            </View>
            {/* <Field
              name="categoryName"
              type="select"
              component={renderField}
              dropdownData={dropdownData}
              label=""
              defaultText={trans('PostForm_select_category_text')}
              firstLabel={trans('PostForm_select_category_text')}
              // isDisable={update}
              validate={[required, singleDropDown]}
              refField={this.setRefField}
              refName="categoryName"
              pickerStyle={{
                height: 265,
              }}
            /> */}
            <View style={{ marginVertical: 15 }}>
              <Text style={[common.regular, { textAlign: 'center', fontSize: 18, marginBottom: 10 }]}>
                {/* UGC Permission */}
                {trans('PostForm_UGC_Permission_title')}
              </Text>
              <Text style={[common.regular, {
                textAlign: 'justify', fontSize: 12, fontWeight: '200', lineHeight: 18,
              }]}
              >
                {trans('PostForm_UGC_Permission_Content')}
                {/* By checking the UGC permission box below you’re explicitly granting “MTD” permission to promote, post, re-post, share your video, image and media contents to all social media including, Facebook, Instagram, YouTube channels, Twitter,  offline files and many other internet platforms in order to reach as many audience as possible. */}
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>

        <View style={{ justifyContent: 'flex-end', paddingBottom: 20 }}>
          <Field
            name="checkUGCPermission"
            type="checkbox"
            label=""
            component={renderField}
            refField={this.setRefField}
            refName="checkUGCPermission"
            checkboxTitle={checkUGCTitle}
            validate={[checkBoxUGCValue]}
          />
          <Field
            name="checkRulesCondition"
            type="checkbox"
            label=""
            component={renderField}
            refField={this.setRefField}
            refName="checkRulesCondition"
            checkboxTitle={checkRulesTitle}
            validate={[checkBoxValue]}
          />
          <Field
            name="checkTermCondition"
            type="checkbox"
            label=""
            component={renderField}
            refField={this.setRefField}
            refName="checkTermCondition"
            checkboxTitle={checkTitle}
            validate={[checkBoxValue]}
          />
          <CButton
            btnText="Next"
            textStyle={[common.textH3, common.semiBold, { color: '#FFF' }]}
            btnStyle={{ marginVertical: 8 }}
            onPress={handleSubmit}
            disable={!buttonDisable}
            load={buttonLoad}
          />
        </View>
      </View>
    );
  }
}

PostForm.propTypes = {
  handleSubmit: PropTypes.func,
  // categoryName: PropTypes.objectOf(PropTypes.any),
  videoDesc: PropTypes.string,
  checkTermCondition: PropTypes.bool,
  checkRulesCondition: PropTypes.bool,
  checkUGCPermission: PropTypes.bool,
  openTermsOfVideoContest: PropTypes.func,
  openOfficialRules: PropTypes.func,
  // openPrivacyModal: PropTypes.func,
  buttonLoad: PropTypes.bool,
  videoData: PropTypes.objectOf(PropTypes.any),
  pause: PropTypes.bool,
  authActions: PropTypes.objectOf(PropTypes.any),
};

PostForm.defaultProps = {
  handleSubmit: () => null,
  // categoryName: __DEV__ ? { id: 5, value: 'Other Talents' } : {},
  videoDesc: __DEV__ ? 'Test description' : '',
  checkTermCondition: !!__DEV__,
  checkRulesCondition: !!__DEV__,
  checkUGCPermission: !!__DEV__,
  openTermsOfVideoContest: () => null,
  openOfficialRules: () => null,
  // openPrivacyModal: () => null,
  buttonLoad: false,
  videoData: {},
  pause: false,
  authActions: {},
};

function mapStateToProps(state) {
  const selector = formValueSelector('post_Form');
  const videoDesc = selector(state, 'videoDesc');
  // const categoryName = selector(state, 'categoryName');
  const checkTermCondition = selector(state, 'checkTermCondition');
  const checkRulesCondition = selector(state, 'checkRulesCondition');
  const checkUGCPermission = selector(state, 'checkUGCPermission');

  return {
    videoDesc,
    // categoryName,
    checkTermCondition,
    checkRulesCondition,
    checkUGCPermission,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // authActions
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
)(
  reduxForm({
    form: 'post_Form',
    enableReinitialize: true,
    initialValues: {
      // categoryName: __DEV__ ? { id: 5, value: 'Other Talents' } : {},
      videoDesc: __DEV__ ? 'Test description' : '',
      checkTermCondition: !!__DEV__,
      checkRulesCondition: !!__DEV__,
      checkUGCPermission: !!__DEV__,
    },
  })(PostForm),
);
