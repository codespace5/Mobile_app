package com.mtc.talent;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.google.android.ads.mediationtestsuite.MediationTestSuite;
import com.mtc.talent.MainApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SplashScreen.show(this);
  }

  // @Override
  // protected void onStart() {
  //   super.onStart();

  //   MediationTestSuite.launch(
  //     MainActivity.this,
  //     "ca-app-pub-4400361576208583~5121060352"
  //   );
  // }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    MainApplication
      .getCallbackManager()
      .onActivityResult(requestCode, resultCode, data);
  }

  @Override
  protected String getMainComponentName() {
    return "MTD";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}