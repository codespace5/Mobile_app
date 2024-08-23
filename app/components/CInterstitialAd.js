import React, { Component } from 'react';
import firebase from 'react-native-firebase';

const { AdRequest } = firebase.admob;

export default class CInterstitialAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

	componentDidMount = () => {
	  const { AdUnit, showAds } = this.props;
	  // console.log('AdUnit New Init ComponentDidMount =================>', AdUnit);
	  if (showAds) {
	    this.advert = firebase.admob().interstitial(AdUnit);
	    this.showAd();
	  }
	};

	showAd = () => {
	  const { onCloseAd } = this.props;
	  console.log('showAd ===================>');
	  this.adsCalled();
	  const isLoaded = this.advert.isLoaded();

	  console.log('isLoaded ===============', isLoaded);

	  if (!isLoaded) {
	    this.advert.on('onAdLoaded', () => {
	      console.log('onAdLoaded ============');
	      this.watchAdd();
	    });
	    this.advert.on('onAdFailedToLoad', (error) => {
	      console.log('onAdFailedToLoad ============');
	      console.log(error);
	    });
	    this.advert.on('onAdClosed', () => {
	      onCloseAd();
	    });
	  }
	};

  adsCalled = () => {
    console.log('adsCalled ===================>');
    const request = new AdRequest();
    this.advert.loadAd(request.build());
  };

  watchAdd = () => {
    console.log('watchAdd ===================>');
    const isLoaded = this.advert.isLoaded();
    if (isLoaded) {
      this.advert.show();
    }
  };

  render() {
    return null;
  }
}
