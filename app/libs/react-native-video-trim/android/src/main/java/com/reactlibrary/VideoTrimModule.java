package com.reactlibrary;

import android.util.Log;

import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import androidx.annotation.Nullable;
import com.reactlibrary.R;


import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;

import com.reactlibrary.VideoCompressor;

import java.io.File;

public class VideoTrimModule extends ReactContextBaseJavaModule  {

    private final ReactApplicationContext reactContext;
    private VideoCompressor mVideoCompressor;
    private String mInputPath;
    private Promise callbackPromise;

    public VideoTrimModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        mVideoCompressor = new VideoCompressor(reactContext);
    }

    @Override
    public String getName() {
        return "VideoTrim";
    }

    @ReactMethod
    public void cancel(Callback callback) {
        Log.e("Video Trim Module", "Request to cancel -===>");
        if (mVideoCompressor.stopCompressing()) {
            Log.e("Video Trim Module", "Cancel return true -===>");
            callback.invoke(true);
        } else {
            Log.e("Video Trim Module", "Cancel return false -===>");
            callback.invoke(false);
        }
    }
    
    @ReactMethod
    public void compress(String videoSrc, ReadableMap options, Promise promise) {
        // TODO: Implement some actually useful functionality
        Log.d("Video Trim Module", "compress video: " + videoSrc + options.toString());

        // Lets set promise to class object
        callbackPromise = promise;

        // This is your input path of video
        String sdcardDir = Environment.getExternalStorageDirectory().getAbsolutePath();
        mInputPath = videoSrc; // change this path according to your path

        File inputFile = new File(mInputPath);
        long inputVideoSize = inputFile.length();

        long fileSizeInKB = inputVideoSize / 1024;
        long fileSizeInMB = fileSizeInKB / 1024;

        String s = "Input video path : " + mInputPath + "Input video size : " + fileSizeInMB + "mb";

        Log.d("Video Trim Module", s);

        this.requestPermission();
        // WritableMap event = Arguments.createMap();
        // event.putString("source", "worked!!!");
        // promise.resolve(event);
    }

    

    private void requestPermission() {
        Log.d("Video Trim Module", "In Request Permission");
        // Code to be done for Requesting permissions of External storage */
        // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        //     ActivityCompat.requestPermissions(new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, 111);
        // } else {
        // }
        startMediaCompression();
    }

    private void startMediaCompression() {
        Log.d("Video Trim Module", "Start media compression");
        mVideoCompressor.startCompressing(mInputPath, new VideoCompressor.CompressionListener() {
            @Override
            public void compressionFinished(int status, boolean isVideo, String fileOutputPath) {

                if (mVideoCompressor.isDone()) {
                    File outputFile = new File(fileOutputPath);
                    long outputCompressVideosize = outputFile.length();
                    long fileSizeInKB = outputCompressVideosize / 1024;
                    long fileSizeInMB = fileSizeInKB / 1024;

                    String s = "Output video path : " + fileOutputPath + "\n" +
                            "Output video size : " + fileSizeInMB + "mb";
                    
                    Log.d("Video Trim Module", "Output done ==> " + s);

                    WritableMap event = Arguments.createMap();
                    event.putString("path", fileOutputPath);
                    event.putString("size", Long.toString(fileSizeInMB));
                    callbackPromise.resolve(event);
                }
            }

            @Override
            public void onFailure(String message) {
                Log.d("Video Trim Module", "Some error find. please try again : " + message);

                WritableMap event = Arguments.createMap();
                event.putString("error", "true");
                event.putString("message", message);
                callbackPromise.resolve(event);
            }

            @Override
            public void onProgress(final int progress) {
                Log.e("Video Trim Module", "Progress ===> " + progress);
                WritableMap params = Arguments.createMap();
                params.putString("progress", Integer.toString(progress));
                sendEvent(reactContext, "compressProgress", params);
            }
        });
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

}
