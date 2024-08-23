import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Platform, ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { connect } from "react-redux";
import NotificationBadge from "../../StackList/NotificationBadge";
import { Icon } from "../../config/icons";
import colors from "../../config/styles";
import MIcon from "react-native-vector-icons/MaterialIcons";

class TabIcon extends Component {
  render() {
    const { routeName, isUploading, focused, tintColor, needView } = this.props;
    let iconName;
    if (routeName === "Home") {
      iconName = focused ? "Home-fill" : "Home";
    } else if (routeName === "Top") {
      iconName = focused ? "Trophy-fill" : "Trophy-outline";
    } else if (routeName === "Notifications") {
      const iName = focused ? "Comment-fill" : "Comment-outline";
      return <NotificationBadge color={tintColor} iName={iName} />;
    } else if (routeName === "Profile") {
      iconName = focused ? "Users" : "Users-outline";
    } else if (routeName === "post") {
      let subView;
      if (isUploading) {
        subView = <ActivityIndicator size="small" color="#fff" animating />;
      } else {
        subView = (
          // <Icon
          //   name="Add"
          //   style={[{
          //     fontSize: RFValue(10),
          //     color: '#FFF',
          //   },
          //   needView ? {
          //     paddingHorizontal: Platform.OS === 'ios' ? 20 : 0,
          //     paddingVertical: Platform.OS === 'ios' ? 7 : 0,
          //   } : null]}
          // />
          <MIcon
            name="video-call"
            style={[
              {
                fontSize: RFValue(20),
                color: "#FFF",
              },
              needView
                ? {
                    paddingHorizontal: Platform.OS === "ios" ? 20 : 0,
                    paddingVertical: Platform.OS === "ios" ? 7 : 0,
                  }
                : null,
            ]}
          />
        );
      }
      if (needView) {
        return (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              backgroundColor: colors.brandAppBackColor,
              paddingHorizontal:
                Platform.OS === "ios" ? 0 : isUploading ? 3 : 17,
              paddingVertical: isUploading || Platform.OS === "ios" ? 0 : 11,
              marginTop: isUploading || Platform.OS === "ios" ? 0 : 20,
            }}
          >
            {subView}
          </View>
        );
      }
      return subView;
    }
    return (
      <Icon
        name={iconName}
        style={{ fontSize: RFValue(18) }}
        color={tintColor}
      />
    );
  }
}

TabIcon.propTypes = {
  isUploading: PropTypes.bool,
  focused: PropTypes.bool,
  needView: PropTypes.bool,
  tintColor: PropTypes.string,
  routeName: PropTypes.string,
};

TabIcon.defaultProps = {
  isUploading: false,
  focused: false,
  tintColor: "#FFF",
  routeName: "Home",
  needView: true,
};
// export default Icon;

function mapStateToProps(state) {
  return {
    isUploading: state.video.isUploading,
    uploadProgress: state.video.uploadProgress,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabIcon);
