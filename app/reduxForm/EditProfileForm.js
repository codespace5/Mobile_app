import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector } from "redux-form";
import {
  findNodeHandle,
  Keyboard,
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import _ from "lodash";
import { bindActionCreators } from "redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
import IoIcon from "react-native-vector-icons/Ionicons";
import { CAlert, EAlert, getReduxErrors } from "../components/CAlert";
// import images from '../config/images';
import { required, email, uName, maxLength14 } from "../config/validation";
import renderField from "../config/renderField";
import CHeader from "../components/CHeader";
import common from "../config/genStyle";
import colors from "../config/styles";
import authActions from "../redux/reducers/auth/actions";
import { getApiDataProgress, getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";

const extraHeight = Platform.OS === "ios" ? 0 : 300;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  profileSty: {
    paddingTop: RFValue(35),
    paddingBottom: RFValue(10),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imgSty: {
    height: RFValue(120),
    width: RFValue(120),
    borderRadius: RFValue(60),
    overflow: "hidden",
  },
  mainInputViewSty: {
    paddingHorizontal: RFValue(20),
  },
  cameraSty: {
    width: RFValue(34),
    height: RFValue(34),
    borderRadius: RFValue(17),
    overflow: "hidden",
    position: "absolute",
    bottom: RFValue(25),
    right: "35%",
    backgroundColor: colors.brandAppBackColor,
    alignItems: "center",
    justifyContent: "center",
  },
  CommonLoaderErrorViewSty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

class EditProfileForm extends Component {
  constructor(props) {
    super(props);
    const {
      authActions: { trans },
    } = this.props;
    this.ActionSheetOptions = {
      CANCEL_INDEX: 2,
      DESTRUCTIVE_INDEX: 2,
      options: [
        trans("EditProfileForm_camera_option_text"),
        trans("EditProfileForm_gallery_option_text"),
        trans("EditProfileForm_cancel_option_text"),
      ],
      title: trans("EditProfileForm_option_title"),
    };
    this.refFields = [];
    this.state = {
      // name: 'jessica555',
      pageLoad: true,
      data: {},
      filePath: "",
      imgUploadLoad: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.didFocusSubscription = navigation.addListener(
      "didFocus",
      this.onDidFocus
    );
  };

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
  }

  onDidFocus = () => {
    this.getProfileData();
  };

  openActionSheet = () => {
    if (this.ActionSheet) {
      this.ActionSheet.show();
    }
  };

  getProfileData = () => {
    const {
      auth: { token },
      authActions: { setEditdata },
    } = this.props;
    if (token !== null && token !== undefined && token !== "") {
      this.setState({ pageLoad: true }, () => {
        getApiData(settings.endpoints.Me, "post", null, {
          Authorization: `Bearer ${token}`,
        })
          .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.success === true) {
              setEditdata(responseJson.data);
              this.setState({
                pageLoad: false,
                // data: _.isObject(responseJson.data)
                // && !_.isEmpty(responseJson.data) ? responseJson.data : {},
                // }, () => {
                // this.getVideoList();
                // this.getVideoList(true);
              });
            } else {
              console.log("responseJson.success === false");
              this.setState({ pageLoad: false });
            }
          })
          .catch((error) => {
            console.log(error);
            // this.setState({ pageLoad: false });
          });
      });
    } else {
      console.log("Token not set");
    }
  };

  handleAction = (i) => {
    if (i === 0) {
      this.selectPicFromCamera();
    }
    if (i === 1) {
      this.selectPicFromGallery();
    }
  };

  selectPicFromCamera = () => {
    if (ImagePicker) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: false,
        includeBase64: true,
        includeExif: true,
        mediaType: "photo",
        compressImageQuality: 0.7,
      })
        .then((image) => {
          console.log(image);
          const rFile = {
            uri: image.path,
            name: image.path.substr(image.path.lastIndexOf("/") + 1),
            type: image.mime,
          };
          this.uploadImageProcess(rFile, image);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  selectPicFromGallery = () => {
    if (ImagePicker) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        includeBase64: true,
        includeExif: true,
        mediaType: "photo",
        compressImageQuality: 0.7,
      })
        .then((image) => {
          console.log(image);
          const rFile = {
            uri: image.path,
            name: image.path.substr(image.path.lastIndexOf("/") + 1),
            type: image.mime,
          };
          this.uploadImageProcess(rFile, image);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  uploadImageProcess = (rFile, image) => {
    const {
      auth: { token },
    } = this.props;
    console.log(token);

    const data = {
      "ImageForm[photo]": _.isObject(rFile) ? rFile : "",
    };

    this.setState({ filePath: image.path, imgUploadLoad: true }, () => {
      getApiDataProgress(
        settings.endpoints.Photo,
        "post",
        data,
        {
          Authorization: `Bearer ${token}`,
        },
        null
      )
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.success === true) {
            setTimeout(() => {
              this.setState({ imgUploadLoad: false });
              // this.goto('EditProfile');
            }, 5000);
          } else {
            console.log("responseJson.success === false");
            this.setState({ imgUploadLoad: false });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ imgUploadLoad: false });
        });
    });
  };

  onFocusScroll = (refName) => {
    const node = findNodeHandle(this.refFields[refName]);
    this.scroll.scrollToFocusedInput(node, extraHeight, 0);
  };

  setNextFocus = (refName) => {
    if (this.refFields[refName]) {
      this.refFields[refName].focus();
    } else {
      Keyboard.dismiss();
    }
  };

  setRefField = (ref, refName) => {
    this.refFields[refName] = ref;
  };

  goto = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  renderMainSubView = () => {
    console.log(this.props);
    const {
      handleSubmit,
      isEdit,
      editData,
      authActions: { trans },
    } = this.props;
    const { data, filePath, imgUploadLoad } = this.state;

    const validUserName =
      _.isObject(data) && _.isString(data.username) && data.username !== ""
        ? data.username
        : "";
    const validPhone =
      _.isObject(data) && _.isString(data.phone) && data.phone !== ""
        ? data.phone
        : "";
    const validImage =
      _.isObject(editData) &&
      _.isString(editData.photo) &&
      editData.photo !== ""
        ? editData.photo
        : "";
    const Imageuri =
      _.isString(filePath) && filePath !== "" ? filePath : validImage;

    return (
      <View>
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
          <View style={styles.profileSty}>
            {imgUploadLoad ? (
              <View style={[styles.imgSty, { position: "relative" }]}>
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.3)",
                  }}
                >
                  <ActivityIndicator
                    size="large"
                    color={colors.brandAppBackColor}
                    animating
                  />
                </View>
                <Image
                  source={{ uri: filePath }}
                  style={{ width: "100%", height: "100%", opacity: 0.5 }}
                />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                  imgUploadLoad
                    ? null
                    : () => {
                        this.openActionSheet();
                      }
                }
                style={styles.imgSty}
              >
                <Image
                  source={{ uri: Imageuri }}
                  style={{ width: "100%", height: "100%" }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.openActionSheet();
              }}
              style={styles.cameraSty}
            >
              <IoIcon
                name="ios-camera"
                style={{ fontSize: RFValue(22), color: "#FFF" }}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              common.textH3,
              common.PT10,
              common.semiBold,
              { textAlign: "center", marginBottom: RFValue(10) },
            ]}
          >
            {validUserName}
          </Text>
          <View style={styles.mainInputViewSty}>
            <Field
              leftIcon="User"
              name="username"
              type="text"
              label=""
              component={renderField}
              placeholder={trans("EditProfileForm_field_1_placeholder")}
              mgBottom={RFValue(10)}
              validate={[required, uName]}
              refField={this.setRefField}
              refName="username"
              onEnter={() => this.setNextFocus("email")}
              onFocus={() => this.onFocusScroll("username")}
            />
            <Field
              leftIcon="Envelope"
              name="email"
              type="email"
              label=""
              component={renderField}
              placeholder={trans("EditProfileForm_field_2_placeholder")}
              mgBottom={RFValue(10)}
              validate={[email]}
              refField={this.setRefField}
              refName="email"
              onEnter={() => this.setNextFocus("phone")}
              onFocus={() => this.onFocusScroll("email")}
              editable={isEdit}
            />
            <Field
              leftIcon="mobile"
              FleftIcon="mobile"
              name="phone"
              type="text"
              label=""
              ColorSty={{ fontSize: 24 }}
              component={renderField}
              placeholder={trans("EditProfileForm_field_3_placeholder")}
              mgBottom={RFValue(10)}
              validate={[maxLength14]}
              refField={this.setRefField}
              refName="phone"
              onEnter={handleSubmit}
              onFocus={() => this.onFocusScroll("email")}
              bankdetails
              keyboardType="phone-pad"
            />
          </View>
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={(o) => {
            this.ActionSheet = o;
          }}
          title={this.ActionSheetOptions.title}
          options={this.ActionSheetOptions.options}
          cancelButtonIndex={this.ActionSheetOptions.CANCEL_INDEX}
          destructiveButtonIndex={this.ActionSheetOptions.DESTRUCTIVE_INDEX}
          onPress={this.handleAction}
        />
      </View>
    );
  };

  renderLoaderView = () => (
    <View style={styles.CommonLoaderErrorViewSty}>
      <ActivityIndicator
        size="small"
        color={colors.brandAppBackColor}
        animating
      />
    </View>
  );

  render() {
    const {
      handleSubmit,
      authActions: { trans },
    } = this.props;
    const { pageLoad, imgUploadLoad } = this.state;

    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          showRightIcon={false}
          showRightText
          rightText={trans("EditProfileForm_right_btn_text")}
          centerText={trans("EditProfileForm_page_title")}
          onBackAction={
            imgUploadLoad
              ? null
              : () => {
                  this.goto("Profile");
                }
          }
          onRightIconAction={imgUploadLoad ? null : handleSubmit}
        />
        {pageLoad ? this.renderLoaderView() : this.renderMainSubView()}
      </View>
    );
  }
}

EditProfileForm.propTypes = {
  auth: PropTypes.objectOf(PropTypes.object),
  authActions: PropTypes.objectOf(PropTypes.any),
  isEdit: PropTypes.bool,
  editData: PropTypes.objectOf(PropTypes.any),
  handleSubmit: PropTypes.func,
  navigation: PropTypes.objectOf(PropTypes.any),
};

EditProfileForm.defaultProps = {
  auth: {},
  authActions: {},
  isEdit: true,
  editData: {},
  handleSubmit: () => null,
  navigation: {},
};

/* eslint-disable no-unused-vars */
function mapStateToProps(state) {
  const selector = formValueSelector("Edit_ProfileForm");
  const userName = selector(state, "username");
  const Email = selector(state, "email");
  const Phone = selector(state, "phone");
  return {
    userName,
    Email,
    Phone,
    initialValues: state.auth.editData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: "Edit_ProfileForm",
    enableReinitialize: true,
  })(EditProfileForm)
);
