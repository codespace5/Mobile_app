import React, { Component } from "react";
import firebase from "react-native-firebase";

const { Banner, AdRequest } = firebase.admob;
const request = new AdRequest();
request.addKeyword("Test");

export default class CBannerAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adShow: true,
    };
  }

  componentDidMount = () => {
    this.setState({ adShow: true });
  };

  render() {
    const { adShow } = this.state;
    const { bannerId } = this.props;
    return adShow ? (
      <Banner
        unitId={bannerId}
        request={request.build()}
        onAdLoaded={() => {
          console.log("Banner loaded");
        }}
        onAdFailedToLoad={(err) => {
          console.log("Banner error");
          console.log(err);
          console.log(err.code);
          this.setState({ ...this.state, adShow: false });
        }}
      />
    ) : null;
  }
}
