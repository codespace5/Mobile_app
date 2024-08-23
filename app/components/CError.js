import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AIcon from "react-native-vector-icons/AntDesign";
import common from "../config/genStyle";
import authActions from "../redux/reducers/auth/actions";

// define your styles
const styles = StyleSheet.create({
  CommonLoaderErrorViewSty: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

class CError extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      errorText,
      type,
      icon,
      authActions: { trans },
    } = this.props;
    return (
      <View style={styles.CommonLoaderErrorViewSty}>
        {icon ? <AIcon name={icon} style={{ fontSize: RFValue(80) }} /> : null}
        <Text
          style={[
            common.textBig,
            common.textBold,
            {
              fontSize: RFValue(20),
              color: "#0008",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          {type ? type : trans("error_msg_title")}
        </Text>
        <Text
          style={[
            common.textNormal,
            common.MT5,
            {
              justifyContent: "center",
              alignItems: "center",
              color: "#0008",
              textAlign: "center",
            },
          ]}
        >
          {errorText}
        </Text>
      </View>
    );
  }
}

CError.propTypes = {
  errorText: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
  authActions: PropTypes.objectOf(PropTypes.any),
};

CError.defaultProps = {
  errorText: "",
  type: "",
  icon: "",
  authActions: {},
};
// export default CError;

function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CError);
