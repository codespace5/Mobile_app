import React, { Component } from "react";
import _ from "lodash";
import { TouchableOpacity, Text } from "react-native";
import firebase from "react-native-firebase";

const AdRequest = firebase.admob.AdRequest;

export default class CRewardAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedVideo: false,
    };
  }

  componentDidMount() {
    const { adId, showAds } = this.props;
    if (showAds) {
      this.advert = firebase.admob().rewarded(adId);
      this.initAds();
    }
  }

  componentWillUnmount() {
    this.advert = null;
  }

  initAds = () => {
    const isLoaded = this.advert.isLoaded();
    if (!isLoaded) {
      this.advert.on("onAdLoaded", () => {
        this.setState({ loadedVideo: true }, () => {
          console.log("Advert ready to show.");
          this.watchVideo();
        });
      });
      this.advert.on("onRewarded", (event) => {
        console.log(
          "The user watched the entire video and will now be rewarded!",
          event
        );
        if (_.isObject(event)) {
          this.onReward();
        }
      });
      this.advert.on("onAdFailedToLoad", (error) => {
        console.log("onAdFailedToLoad");
        console.log(error);
        console.log(error.code);
      });

      this.advert.on("onAdClosed", () => {
        console.log("onAdClosed called");
        this.adsCalled();
      });
      this.adsCalled();
    }
  };

  onReward = () => {
    const { onHideAds } = this.props;
    console.log("Give Reward to user");
    this.setState({ loadedVideo: false });
    if (_.isFunction(onHideAds)) {
      onHideAds();
    }
  };

  adsCalled = () => {
    const request = new AdRequest();
    if (this.advert && this.advert.loadAd) {
      this.advert.loadAd(request.build());
    }
  };

  watchVideo = () => {
    const isLoaded = this.advert.isLoaded();
    if (isLoaded) {
      console.log("isLoaded ====================>");
      this.advert.show();
    } else {
      this.adsCalled();
      console.log("isloaded false");
    }
  };

  render() {
    // const { loadedVideo } = this.state;

    // if (loadedVideo) {
    //   return (
    //     <TouchableOpacity
    //       activeOpacity={0.8}
    //       onPress={() => {
    //         this.watchVideo();
    //       }}
    //       style={{
    //         width: "100%",
    //         height: 55,
    //         alignItems: "center",
    //         justifyContent: "center",
    //         borderRadius: 5,
    //         borderWidth: 0.5,
    //         backgroundColor: "#fff",
    //         zIndex: 10,
    //       }}
    //     >
    //       <Text
    //         numberOfLines={1}
    //         style={{ fontSize: 15, color: "#000", textAlign: "center" }}
    //       >
    //         Watch Video & Get Reward
    //       </Text>
    //     </TouchableOpacity>

    //     // this.watchVideo()
    //   );
    // }

    return null;
  }
}
