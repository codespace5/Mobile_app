import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, BackHandler, AsyncStorage } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CHeader from "../components/CHeader";
import PostForm from "../reduxForm/PostForm";
import authActions from "../redux/reducers/auth/actions";
import CTermsOfVideoContest from "../components/CTermsOfVideoContest";
import COfficialRules from "../components/COfficialRules";
import { setLeaveBreadcrumb } from "../redux/utils/CommonFunction";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

class Post extends Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonLoad: false,
      pause: false,
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.onWillFocusSubscription = navigation.addListener(
      "willFocus",
      this.onWillFocus
    );
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  };

  componentWillUnmount() {
    if (this.onWillFocusSubscription) {
      this.onWillFocusSubscription.remove();
    }
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  onWillFocus = (payload) => {
    setLeaveBreadcrumb(payload);
  };

  handleBackPress = async () => {
    const { navigation } = this.props;
    try {
      const value = await AsyncStorage.getItem("activeScreen");
      if (value !== null) {
        if (value === "Home") {
          BackHandler.exitApp();
        } else {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  goto = (page) => {
    console.log(page);
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  openTermsOfVideoContest = () => {
    if (this.CTermsOfVideoContest) {
      this.CTermsOfVideoContest.openModal();
    }
  };

  openOfficialRules = () => {
    if (this.COfficialRules) {
      this.COfficialRules.openModal();
    }
  };

  handleSubmit = (value) => {
    console.log(value);
    if (_.isObject(value) && !_.isEmpty(value)) {
      this.setState({ buttonLoad: true }, () => {
        setTimeout(() => {
          this.setState({ buttonLoad: false, pause: true }, () => {
            this.goto("Disclaimer");
          });
        }, 100);
      });
    }
  };

  render() {
    const { buttonLoad, pause } = this.state;
    const {
      navigation,
      authActions: { trans },
    } = this.props;
    const videoData = navigation.getParam("data");
    return (
      <View style={styles.container}>
        <CHeader
          showBackArrow
          showCenterText
          centerText={trans("Post_page_title")}
          onBackAction={() => {
            navigation.goBack();
          }}
        />

        <PostForm
          {...this.props}
          onSubmit={this.handleSubmit}
          openTermsOfVideoContest={this.openTermsOfVideoContest}
          openOfficialRules={this.openOfficialRules}
          buttonLoad={buttonLoad}
          videoData={videoData}
          pause={pause}
        />

        <CTermsOfVideoContest
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.CTermsOfVideoContest = o.getWrappedInstance();
            } else {
              this.CTermsOfVideoContest = o;
            }
          }}
        />
        <COfficialRules
          {...this.props}
          ref={(o) => {
            if (o && o.getWrappedInstance) {
              this.COfficialRules = o.getWrappedInstance();
            } else {
              this.COfficialRules = o;
            }
          }}
        />
      </View>
    );
  }
}

Post.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any),
  authActions: PropTypes.objectOf(PropTypes.any),
  // auth: PropTypes.objectOf(PropTypes.any),
};

Post.defaultProps = {
  navigation: {},
  authActions: {},
  // auth: {},
};

/* eslint-disable no-unused-vars */
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

export default connect(mapStateToProps, mapDispatchToProps)(Post);
