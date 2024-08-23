# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

-keep public class me.leolin.shortcutbadger.* { public *; }
-dontwarn me.leolin.shortcutbadger.**
-keep class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

-dontwarn com.googlecode.mp4parser.**

-keep class wseemann.media.**{ *; }
-keep class wseemann.media.FFmpegMediaMetadataRetriever {
    *** mNativeContext;
}

-keep class * implements com.coremedia.iso.boxes.Box {* ; }
-dontwarn com.coremedia.iso.boxes.*
-dontwarn com.googlecode.mp4parser.authoring.tracks.mjpeg.**
-dontwarn com.googlecode.mp4parser.authoring.tracks.ttml.**

-ignorewarnings
-keep class * {
    public private *;
}