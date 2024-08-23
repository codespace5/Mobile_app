package com.mtc.talent;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.arthenica.reactnative.RNFFmpegPackage;
import com.vydia.RNUploader.UploaderReactPackage;
import com.microsoft.codepush.react.CodePush;
import com.bugsnag.BugsnagReactNative;
import com.wix.interactable.Interactable;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;


import android.app.Activity;
import android.content.Intent;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactInstanceManager;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactlibrary.VideoTrimPackage;
// import com.shahenlibrary.RNVideoProcessingPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.arttitude360.reactnative.rnpaystack.RNPaystackPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.horcrux.svg.SvgPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private String YOUR_LICENSE_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAufv3Hn2AsYNOt9H5IO2fg6JTRt8J9UwKijpsGcTKMy5ZtCU7d2pw0XK4BJZ6lPEKtSye98G8Bv8ebwNJ+JQZqjI5p9IKQqKO78edigAidaJd5H4/xSOT2EgoPJk73rFxtYD2QfTOGiUrSMzuIX4UxwF3Kx0ca3km+DRcrMdaJN+Gv31SZiUk1eKC4xfHvuECbZLzkLTBUe7WqtPmUj9LMYPSZGAkyHIfCo7i4sJXawBhmfLJ0JpxtMsa+iq12U/T6sMzAnCF5vhfhzidb6kYRsNEV9Kc2OzuJqpZ/Dtofhva4dHzYPdh11NAZFhTyDN3Mmf6JCe7v4ABgRP+ZOUVZQIDAQAB";

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new RNDeviceInfo(),
        new MainReactPackage(),
        new RNFFmpegPackage(),
        new UploaderReactPackage(),
        new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
        BugsnagReactNative.getPackage(),
        new Interactable(),
        new RNFirebasePackage(),
        new RNFirebaseAdMobPackage(),
        new RNFirebaseMessagingPackage(),
        new RNFirebaseNotificationsPackage(),
        new RNFirebaseAnalyticsPackage(),
        new RNGoogleSigninPackage(),
        new FBSDKPackage(mCallbackManager),
        new SplashScreenReactPackage(),
        new PickerPackage(),
        new RNCameraPackage(),
        new ReactVideoPackage(),
        new LinearGradientPackage(),
        new VectorIconsPackage(),
        new RNGestureHandlerPackage(),
        new VideoTrimPackage(),
        // new RNVideoProcessingPackage(),
        new LinearGradientPackage(),
        new RNPaystackPackage(),
        new InAppBillingBridgePackage(YOUR_LICENSE_KEY),
        new RNI18nPackage(),
        new SvgPackage(),
        new RNCWebViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
