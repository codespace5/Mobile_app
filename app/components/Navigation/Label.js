import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import colors from "../../config/styles";
import authActions from "../../redux/reducers/auth/actions";

class Label extends PureComponent {
  render() {
    const {
      routeName,
      isUploading,
      uploadProgress,
      isHome,
      isTrimming,
      isCompressing,
      authActions: { trans },
    } = this.props;
    if (routeName === "post") {
      if (isUploading) {
        let currentStatus = `Uploading ${uploadProgress.toFixed(0)}%`;
        if (uploadProgress === 100)
          currentStatus = trans("Bottom_TAB_Video_processing");
        if (isTrimming) currentStatus = trans("Bottom_TAB_Video_Trimming");
        if (isCompressing)
          currentStatus = trans("Bottom_TAB_Video_Compressing");

        return (
          <Text
            style={{
              fontSize: RFValue(8),
              fontFamily: colors.fonts.proximaNova.bold,
              textAlign: "center",
              paddingTop: isHome ? 3 : 0,
              color: isHome ? "#FFF" : colors.brandAppBackColor,
            }}
          >
            {currentStatus}
          </Text>
        );
      }
      if (Platform.OS === "ios" || isHome) {
        return null;
      }
      return <Text />;
    }
    return (
      <Text
        style={{
          fontSize: RFValue(10),
          fontFamily: colors.fonts.proximaNova.semiBold,
          textAlign: "center",
        }}
      >
        {routeName} {routeName === "Top" ? 100 : ""}
      </Text>
    );
  }
}

Label.propTypes = {
  authActions: PropTypes.objectOf(PropTypes.any),
  isUploading: PropTypes.bool,
  isCompressing: PropTypes.bool,
  isTrimming: PropTypes.bool,
  uploadProgress: PropTypes.number,
  routeName: PropTypes.string,
  isHome: PropTypes.bool,
};

Label.defaultProps = {
  authActions: {},
  isCompressing: false,
  isTrimming: false,
  isUploading: false,
  uploadProgress: 0,
  routeName: "",
  isHome: false,
};
// export default Label;

function mapStateToProps(state) {
  return {
    isUploading: state.video.isUploading,
    isCompressing: state.video.isCompressing,
    isTrimming: state.video.isTrimming,
    uploadProgress: state.video.uploadProgress,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Label);
