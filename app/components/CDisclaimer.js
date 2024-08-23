// import liraries
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import IoIcon from "react-native-vector-icons/Ionicons";
import common from "../config/genStyle";
// import colors from '../config/styles';

// define your styles
const styles = StyleSheet.create({
  ModalMainView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: RFValue(25),
    paddingVertical: Platform.OS === "ios" ? RFValue(45) : RFValue(25),
  },
  OtherMainView: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    overflow: "hidden",
  },
  HeaderViewSty: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#8e8e93",
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(15),
  },
  infoViewSty: {
    flexGrow: 1,
    paddingHorizontal: RFValue(20),
  },
  infoTextSty: {
    marginVertical: RFValue(10),
    color: "#0008",
    letterSpacing: 0.3,
    lineHeight: RFValue(19),
  },
  otherScrollSty: {
    paddingRight: RFValue(15),
    paddingBottom: RFValue(50),
  },
  HeaderTextTitle: {
    marginTop: RFValue(10),
    marginBottom: RFValue(20),
    color: "#404040",
  },
});

// create a component
class CDisclaimer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      modalVisible,
      closeModal,
      disclaimer,
      authActions: { trans },
    } = this.props;
    return (
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={closeModal}
      >
        <View style={styles.ModalMainView}>
          <View style={styles.OtherMainView}>
            <View style={styles.HeaderViewSty}>
              <Text numberOfLines={1} style={[common.headerTitle]}>
                {trans("CDisclaimer_modal_title")}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  zIndex: 10,
                  padding: RFValue(10),
                }}
                onPress={closeModal}
              >
                <IoIcon
                  name="md-close"
                  style={{ fontSize: RFValue(25), color: "#000" }}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              ref={(o) => {
                this.privacyScroll = o;
              }}
              contentContainerStyle={styles.infoViewSty}
            >
              {/* <Text numberOfLines={1} style={[common.textH3, styles.HeaderTextTitle]}>
                {'Last updated: March 2019'}
              </Text> */}

              <View style={styles.otherScrollSty}>
                <Text style={[common.textH4, styles.infoTextSty]}>
                  {disclaimer}
                </Text>
                {/* <Text numberOfLines={2} style={[common.textH4, styles.infoTextSty]}>
                  {'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
                </Text>

                <Text numberOfLines={5} style={[common.textH4, styles.infoTextSty]}>
                  {'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,'}
                </Text>

                <Text numberOfLines={5} style={[common.textH4, styles.infoTextSty]}>
                  {'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,'}
                </Text>

                <Text numberOfLines={7} style={[common.textH4, styles.infoTextSty]}>
                  {'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and type setting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
                </Text> */}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

CDisclaimer.propTypes = {
  modalVisible: PropTypes.bool,
  closeModal: PropTypes.func,
  disclaimer: PropTypes.string,
  authActions: PropTypes.objectOf(PropTypes.any),
};

CDisclaimer.defaultProps = {
  modalVisible: false,
  closeModal: null,
  disclaimer: "",
  authActions: {},
};

export default CDisclaimer;
