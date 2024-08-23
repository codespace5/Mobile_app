package com.reactlibrary;

import android.content.Context;
import android.os.Environment;
import android.util.Log;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;

import com.reactlibrary.utils.ProgressCalculator;
import com.github.hiteshsondhi88.libffmpeg.FFmpeg;
import com.github.hiteshsondhi88.libffmpeg.FFmpegExecuteResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.LoadBinaryResponseHandler;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegCommandAlreadyRunningException;
import com.github.hiteshsondhi88.libffmpeg.exceptions.FFmpegNotSupportedException;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import android.graphics.Color;

public class VideoCompressor {

    public static final int SUCCESS = 1;
    public static final int FAILED = 2;
    public static final int NONE = 3;
    public static final int RUNNING = 4;

    private final Context context;
    private final FFmpeg ffmpeg;
    private ProgressCalculator mProgressCalculator;
    private boolean isFinished;
    private int status = NONE;
    private String errorMessage = "Compression Failed!";
    private Notification.Builder notificationBuilder;
    private NotificationManager notificationManager;
    private Notification notification;
    private NotificationChannel channel;
    private Integer notificationID = 14445;

    public VideoCompressor(Context context) {
        Log.e("VideoCompressor", "In constructor ===> ");
        this.context = context;
        this.ffmpeg = FFmpeg.getInstance(context);

        notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    public boolean stopCompressing() {
        Log.d("Video Trim Module", "Stop compressing called -===>");
        if (this.ffmpeg != null) {
            Log.d("Video Trim Module", "FFMPEG Not null -===>");
            if (this.ffmpeg.isFFmpegCommandRunning()) {
                Log.d("Video Trim Module", "FFMPEG is running");
                return this.ffmpeg.killRunningProcesses();
            }
            Log.d("Video Trim Module", "FFMPEG Return default true ===>");
            return true;
        }
        return false;
    }

    public void startCompressing(String inputPath, CompressionListener listener) {
        Log.e("com.mtc.talent", "startCompressing ===> ");
        if (inputPath == null || inputPath.isEmpty()) {
            Log.e("com.mtc.talent", "Error input null ===> ");
            status = NONE;
            if (listener != null) {
                listener.compressionFinished(NONE, false, null);
            }
            return;
        }

        String outputPath = "";

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmm");
        String currentDateandTime = sdf.format(new Date());
        outputPath = getAppDir() + "/" + currentDateandTime + ".mp4";
        String[] commandParams = new String[30];
        commandParams[0] = "-y";
        // commandParams[0] = "-y";
        commandParams[1] = "-i";
        commandParams[2] = inputPath;
        commandParams[3] = "-to";
        commandParams[4] = "60";
        commandParams[5] = "-vf";
        commandParams[6] = "scale=480:-2";
        commandParams[7] = "-r";
        commandParams[8] = "20";
        commandParams[9] = "-c:v";
        commandParams[10] = "libx264";
        commandParams[11] = "-preset";
        commandParams[12] = "veryfast";
        commandParams[13] = "-c:a";
        commandParams[14] = "aac";
        commandParams[15] = "-me_method";
        commandParams[16] = "zero";
        commandParams[17] = "-tune";
        commandParams[18] = "fastdecode";
        commandParams[19] = "-tune";
        commandParams[20] = "zerolatency";
        commandParams[21] = "-strict";
        commandParams[22] = "-2";
        // commandParams[23] = "-b:v";
        // commandParams[24] = "600k";
        // commandParams[23] = "-b:a";
        // commandParams[24] = "50k";
        commandParams[23] = "-pix_fmt";
        commandParams[24] = "yuv420p";
        commandParams[25] = "-movflags";
        commandParams[26] = "+faststart";
        commandParams[27] = "-crf";
        commandParams[28] = "24";
        commandParams[29] = outputPath;
        Log.e("com.mtc.talent", commandParams.toString());

        Log.e("com.mtc.talent", "Passing to Compress video ===> ");
        compressVideo(commandParams, outputPath, listener);

    }

    public String getAppDir() {
        String outputPath = Environment.getExternalStorageDirectory().getAbsolutePath();
        outputPath += "/" + "MTC";
        File file = new File(outputPath);
        if (!file.exists()) {
            file.mkdir();
        }

        

        // outputPath += "/" + "Talent_Videos";
        file = new File(outputPath);
        if (!file.exists()) {
            file.mkdir();
        }
        return outputPath;
    }

    private void compressVideo(String[] command, final String outputFilePath, final CompressionListener listener) {
        Log.e("com.mtc.talent", "In compress video ===> ");
        try {
            Log.e("com.mtc.talent", "Before Load binary ffmpeg ===> ");
            ffmpeg.loadBinary(new LoadBinaryResponseHandler() {
                
              public void onStart() {
                Log.e("com.mtc.talent", "On start of load binary ===> ");
              }
          
              public void onFailure() {
                Log.e("com.mtc.talent", "On failure of load binary ===> ");
              }
          
              public void onSuccess() {
                Log.e("com.mtc.talent", "On success of load binary ===> ");
              }
          
              public void onFinish() {
                Log.e("com.mtc.talent", "On finish of load binary ===> ");
              }
            });
        } catch (FFmpegNotSupportedException e) {
            Log.e("com.mtc.talent", "FFMEPG NOT SUPPORTED ===> ");
        // Handle if FFmpeg is not supported by device
        }
        try {
            Log.e("com.mtc.talent", "Before start ffmpeg ===> ");

            mProgressCalculator = new ProgressCalculator();
            this.ffmpeg.execute(command, new FFmpegExecuteResponseHandler() {
                @Override
                public void onSuccess(String message) {
                    notificationManager.cancel(notificationID);
                    status = SUCCESS;
                }

                @Override
                public void onProgress(String message) {
                    status = RUNNING;
                    Log.e("com.mtc.talent", message);
                    int progress = mProgressCalculator.calcProgress(message);
                    Log.e("com.mtc.talent == ", progress + "..");
                    if (progress != 0 && progress <= 100) {
                        if (progress >= 99) {
                            progress = 100;
                        }

                        notificationBuilder
                        .setVibrate(null)
                        .setProgress(100, progress, false);

                        //Send the notification:
                        notification = notificationBuilder.build();
                        notificationManager.notify(notificationID, notification);

                        listener.onProgress(progress);
                    }
                }

                @Override
                public void onFailure(String message) {
                    status = FAILED;

                    Log.e("com.mtc.talent", message);
                    if (listener != null) {
                        notificationManager.cancel(notificationID);
                        listener.onFailure("Error : " + message);
                    }
                }

                @Override
                public void onStart() {
                    //Set notification information:
                    notificationBuilder = new Notification.Builder(context);
                    createNotificationChannel();
                    notificationBuilder.setOngoing(true)
                                    .setContentTitle("Processing your video")
                                    .setContentText("Your video is being processed...")
                                    .setSmallIcon(android.R.drawable.ic_menu_upload)
                                    .setProgress(100, 0, false)
                                    .setVibrate(null)
                                    .setSound(null, null)
                                    .setChannelId("Video-Compress");

                    //Send the notification:
                    notification = notificationBuilder.build();

                    notificationManager.notify(notificationID, notification);
                }

                @Override
                public void onFinish() {
                    Log.e("com.mtc.talent", "finnished");
                    isFinished = true;

                    notificationManager.cancel(notificationID);

                    if (listener != null) {
                        listener.compressionFinished(status, true, outputFilePath);
                    }
                }
            });
        } catch (FFmpegCommandAlreadyRunningException e) {
            Log.e("VideoCompressor", "Errro === ===> " + e.getMessage());
            status = FAILED;
            errorMessage = e.getMessage();
            if (listener != null) {
                listener.onFailure("Error : " + e.getMessage());
            }
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= 26) {
            channel = new NotificationChannel("Video-Compress", "Video Compress", NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Channel to show notification about video processing.");
            channel.enableLights(false);
            channel.setSound(null, null);
            channel.setLightColor(Color.RED);
            channel.enableVibration(false);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public interface CompressionListener {
        void compressionFinished(int status, boolean isVideo, String fileOutputPath);

        void onFailure(String message);

        void onProgress(int progress);
    }

    public boolean isDone() {
        return status == SUCCESS || status == NONE;
    }

}