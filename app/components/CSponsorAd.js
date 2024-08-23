/* eslint-disable no-console */
// /* eslint-disable react/prefer-stateless-function */

// import liraries
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import _ from "lodash";
import IoIcon from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";
import { getApiData } from "../redux/utils/apiHelper";
import settings from "../config/settings";
import Device from "react-native-device-info";

// define your styles
const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: "#0000",
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    height: "100%",
  },
  OtherMainView: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    // overflow: "hidden",
  },
  HeaderViewSty: {
    width: "100%",
    height: "100%",
  },
  infoViewSty: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  infoTextSty: {
    marginVertical: 10,
    color: "#0008",
    letterSpacing: 0.3,
    lineHeight: 19,
  },
  otherScrollSty: {
    paddingRight: 15,
    paddingBottom: 50,
  },
  HeaderTextTitle: {
    marginTop: 10,
    marginBottom: 20,
    color: "#404040",
  },
  loaderView: {
    height: "100%",
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
});

// create a component
class CSponsorAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      adData: {},
      vId: "",
      // closeIcon: false,
    };
  }

  openModal = (item, vId) => {
    this.setState(
      {
        visible: true,
        adData: item,
        vId,
      },
      () => {
        this.adSeenApiCall();
      }
    );
  };

  adSeenApiCall = () => {
    const { adData } = this.state;
    getApiData(
      `${settings.endpoints.sponsor_adv}?adv_id=${adData?.adv_id}`,
      "post",
      {}
    )
      .then((response) => {
        console.log("response", response);
        if (response.success) {
          console.log("succcess", response.data);
        } else {
          console.log("video Id success false ====");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  closeModal = () => {
    if (this.state.vId) {
      this.props.handleSeenAd(this.state.vId);
    }
    this.setState({ visible: false, adData: {}, closeIcon: false });
  };

  render() {
    const { visible, adData, closeIcon } = this.state;
    const { closeAdModal } = this.props;

    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={closeAdModal}
      >
        <View style={styles.ModalMainView}>
          <View style={styles.OtherMainView}>
            <View style={styles.HeaderViewSty}>
              {/* {closeIcon || adData?.file_type === 'image' ? ( */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  position: "absolute",
                  right: 10,
                  top: Device.hasNotch() ? 40 : 10,
                  zIndex: 10,
                  width: 30,
                  height: 30,
                  backgroundColor: "#fff",
                  elevation: 5,
                  borderRadius: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={closeAdModal}
              >
                <IoIcon
                  name="md-close"
                  style={{ fontSize: RFValue(25), color: "#000" }}
                />
              </TouchableOpacity>
              {/* ) : null} */}

              {adData?.file_type === "image" ? (
                <Image
                  // eslint-disable-next-line global-require
                  source={{ uri: adData?.ad_url }}
                  // style={{ width: "100%", height: "100%" }}
                  style={{
                    width: Dimensions.get("screen").width,
                    height: Dimensions.get("screen").height,
                  }}
                  resizeMode="contain"
                  // onLoadEnd={() => this.setState({ closeIcon: true })}
                />
              ) : (
                <Video
                  source={{ uri: adData?.ad_url }}
                  // source={{
                  //   uri: "https://mtcspace.sfo2.digitaloceanspaces.com/advertisements/1626262140-sample-video.mp4",
                  // }}
                  ref={(o) => {
                    if (o != null) {
                      this.player = o;
                    }
                  }}
                  bufferConfig={{
                    minBufferMs: 1000,
                    maxBufferMs: 4000,
                    bufferForPlaybackMs: 100,
                    bufferForPlaybackAfterRebufferMs: 1000,
                  }}
                  ignoreSilentSwitch="ignore"
                  playInBackground={false}
                  resizeMode="contain"
                  progressUpdateInterval={1000}
                  style={{ flex: 1, width: "100%", height: "100%" }}
                  // onEnd={() => this.setState({ closeIcon: true })}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

CSponsorAd.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  tabPageIds: PropTypes.arrayOf(PropTypes.number),
  handleSeenAd: PropTypes.func,
  closeAdModal: PropTypes.func,
};

CSponsorAd.defaultProps = {
  authActions: {},
  tabPageIds: [0, 0],
  handleSeenAd: () => null,
  closeAdModal: null,
};

export default CSponsorAd;
