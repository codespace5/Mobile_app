import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import _ from "lodash";
// import moment from 'moment';
import momentTimeZone from "moment-timezone";
import { RFValue } from "react-native-responsive-fontsize";
// import IoIcon from 'react-native-vector-icons/Ionicons';
// import { Icon } from '../config/icons';
import Icon from "react-native-vector-icons/MaterialIcons";
import Interactable from "react-native-interactable";
import colors from "../config/styles";
import common from "../config/genStyle";
import CButton from "./CButton";
import { FORTAB } from "../config/MQ";
import images from "../config/images";
import { getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";

const timeZone = momentTimeZone.tz.guess();

// define your styles
const styles = StyleSheet.create({
  swipeView: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    left: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RFValue(5),
    borderColor: "#e5e5e5",
    marginVertical: RFValue(FORTAB ? 10 : 7),
    // padding: 30,
    paddingRight: RFValue(5),
    backgroundColor: "#e5e5e5",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  RemoveBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    width: RFValue(FORTAB ? 70 : 60),
    height: RFValue(FORTAB ? 70 : 60),
    borderRadius: RFValue(FORTAB ? 35 : 30),
  },
  DeleteIconSty: {
    fontSize: RFValue(FORTAB ? 25 : 22),
    color: "#0008",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: RFValue(5),
    elevation: 1,
    padding: RFValue(FORTAB ? 12 : 8),
    marginVertical: RFValue(FORTAB ? 10 : 7),
    position: "relative",
  },
  imgsty: {
    height: RFValue(40),
    width: RFValue(40),
    marginRight: RFValue(15),
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: colors.brandAppTextGrayColor,
  },
  notificationwrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationsty: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  notificationbtn: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: RFValue(12),
  },
});

class CNotification extends Component {
  constructor(props) {
    super(props);
    this.deltaX = new Animated.Value(0);
    this.state = {
      loading: false,
    };
  }

  RemoveNotification = (data) => {
    const { onRefresh, getNotification } = this.props;
    const {
      auth: { token },
    } = this.props;
    this.deltaX = new Animated.Value(0);

    const RemoveData = {
      id:
        _.isObject(data) && _.isString(data.id) && data.id !== ""
          ? data.id
          : "",
    };
    this.setState({ loading: true }, () => {
      getApiData(settings.endpoints.remove_Notification, "get", RemoveData, {
        Authorization: `Bearer ${token}`,
      })
        .then((responseJson) => {
          if (responseJson.status) {
            this.setState({ loading: false }, () => {
              if (_.isFunction(getNotification)) {
                getNotification();
              }
            });
          } else {
            this.setState({ loading: false }, () => {
              console.log(responseJson.errors);
            });
          }
        })
        .catch((err) => {
          this.setState({ loading: false }, () => {
            console.log(err);
          });
        });
    });
  };

  routePage = (data) => {
    const {
      authActions: { trans },
    } = this.props;
    if (_.isObject(data) && _.isString(data.type)) {
      if (data.type === "view_user") {
        this.goto("OtherUserProfile", data, "NotificationList");
      }
      if (data.type === "view_video" || data.type === "view_winner") {
        this.goto("VideoList", data);
      }

      if (data.type === "continue_publish") {
        let screenToDisplay = "MakePayment";
        if (
          _.lowerCase(trans("Free_Video_Posting")) === "yes" ||
          data.video_payment === "0"
        ) {
          screenToDisplay = "FreePostConfirmation";
        }
        this.props.navigation.navigate(screenToDisplay, {
          data: { video_id: data.video_id },
          type: "disclaimer",
        });
      }
      // if (data.type === 'view_winner') {
      //   this.goto('Winner', data);
      // }
    }
  };

  goto = (page, data, FromWhereStr) => {
    const { navigation } = this.props;
    navigation.navigate(page, {
      data,
      FromWhereStr,
    });
  };

  notificationBtnName = () => {
    const {
      data,
      authActions: { trans },
    } = this.props;
    let btnName = trans("CNotification_view_btn_text");
    if (_.isObject(data) && _.isString(data.type)) {
      if (data.type === "view_video") {
        btnName = trans("CNotification_watch_btn_text");
      } else if (data.type === "continue_publish") {
        btnName = trans("CNotification_continue_publish_btn_text");
      } else {
        btnName = trans("CNotification_view_btn_text");
      }
    }

    return btnName;
  };

  render() {
    const { loading } = this.state;
    const { data } = this.props;
    const imgUrl =
      _.isObject(data) && _.isString(data.photo) && data.photo !== ""
        ? data.photo
        : "";
    const dataTitle =
      _.isObject(data) && _.isString(data.title) && data.title !== ""
        ? data.title
        : "";
    const dataMessage =
      _.isObject(data) && _.isString(data.message) && data.message !== ""
        ? data.message
        : "";
    const showButton =
      _.isObject(data) &&
      _.isString(data.type) &&
      (data.type === "view_user" ||
        data.type === "view_video" ||
        data.type === "view_winner" ||
        data.type === "continue_publish");

    const nDate =
      _.isObject(data) && _.isString(data.created_at) && data.created_at !== ""
        ? data.created_at
        : "";
    const dateFormat = "MMM DD, YYYY [at] hh:mm A";

    const notiButtonName = this.notificationBtnName();

    const UDate = momentTimeZone(nDate * 1000)
      .tz(timeZone)
      .format(dateFormat);
    if (loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            size="small"
            color={colors.brandAppBackColor}
            animating
          />
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity
          style={styles.swipeView}
          onPress={() => {
            this.RemoveNotification(data);
          }}
        >
          <Animated.View
            style={[
              styles.RemoveBtn,
              {
                transform: [
                  {
                    scale: this.deltaX.interpolate({
                      inputRange: [-100, -100, -50, -50],
                      outputRange: [1, 0.9, 0.7, 0.5],
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name="delete" style={styles.DeleteIconSty} />
          </Animated.View>
        </TouchableOpacity>
        <Interactable.View
          horizontalOnly
          snapPoints={[{ x: 0 }, { x: FORTAB ? -90 : -70 }]}
          dragToss={0.01}
          animatedValueX={this.deltaX}
        >
          <View style={styles.container}>
            <View style={[styles.notificationwrap, common.PT10]}>
              <View style={styles.notificationsty}>
                <Image
                  source={imgUrl !== "" ? { uri: imgUrl } : images.profile}
                  style={[styles.imgsty]}
                />
                <View style={{ flexDirection: "column", flex: 1 }}>
                  <Text numberOfLines={1} style={common.textH4}>
                    {dataTitle}
                  </Text>
                  <Text numberOfLines={3} style={{ fontSize: RFValue(12) }}>
                    {dataMessage}
                  </Text>
                  <View style={styles.notificationbtn}>
                    <Text numberOfLines={1} style={styles.notificationbtn}>
                      {UDate}
                    </Text>
                    {showButton ? (
                      <CButton
                        btnText={notiButtonName}
                        btnStyle={{ width: RFValue(70), height: RFValue(25) }}
                        textStyle={{ fontSize: RFValue(12) }}
                        onPress={() => {
                          this.routePage(data);
                        }}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Interactable.View>
      </View>
    );
  }
}

CNotification.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  getNotification: PropTypes.func,
  auth: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
};

CNotification.defaultProps = {
  navigation: {},
  data: {},
  getNotification: null,
  auth: {},
  authActions: {},
};

export default CNotification;
