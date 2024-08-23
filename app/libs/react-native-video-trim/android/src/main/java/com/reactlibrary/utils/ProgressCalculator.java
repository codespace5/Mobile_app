package com.reactlibrary.utils;

import com.reactlibrary.utils.GeneralUtils;

import android.util.Log;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class ProgressCalculator {

    private static final String COMPRESS_TAG = "Compress";
    private String durationOfCurrent;
    private SimpleDateFormat simpleDateFormat;
    private long timeRef = -1;
    private int prevProgress = 0;

    public ProgressCalculator() {
        simpleDateFormat = new SimpleDateFormat("HH:mm:ss.SS");
        initCalcParamsForNextInter();
        try {
            Calendar c = Calendar.getInstance();
            Date now = simpleDateFormat.parse("00:00:00.00");
            c.setTime(now);
            c.set(Calendar.YEAR, 2012);
            timeRef = c.getTimeInMillis();
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    public void initCalcParamsForNextInter() {
        durationOfCurrent = null;
    }

    public int calcProgress(String line) {
        int progress = 0;

        if (durationOfCurrent == null) {
            String dur = GeneralUtils.getDurationFromVCLogRandomAccess(line);

            if (!GeneralUtils.isEmpty(dur)) {
                durationOfCurrent = GeneralUtils.getDurationFromVCLogRandomAccess(line);
            }
        }

        if (durationOfCurrent != null) {
            String currentTimeStr = GeneralUtils.readLastTimeFromVKLogUsingRandomAccess(line);

            if (currentTimeStr.equals("exit")) {
                prevProgress = 99;
                return prevProgress;
            }
            try {
                Log.d("com.mtc.talent", "durationOfCurrent  ==== > " + durationOfCurrent);
                
                /* Get total seconds */
                String [] durationArray = durationOfCurrent.split(":");
                
                int hour = Integer.parseInt(durationArray[0]);
                int minute = Integer.parseInt(durationArray[1]);
                float second = Float.parseFloat(durationArray[2]);
                
                float totalSeconds;
                totalSeconds = second + (60 * minute) + (3600 * hour);

                Log.d("com.mtc.talent", "Duration in Seconds  ==== > " + String.valueOf(totalSeconds));

                if (totalSeconds > 60) {
                    durationOfCurrent = "00:00:60.00";
                    Log.d("com.mtc.talent", "New Duration of Current  ==== > " + durationOfCurrent);
                }

                Calendar durationCal = Calendar.getInstance();
                Date durationDate = simpleDateFormat.parse(durationOfCurrent);
                durationCal.setTime(durationDate);
                durationCal.set(Calendar.YEAR, 2012);

                Calendar currentTimeCal = Calendar.getInstance();
                Date currentTimeDate = simpleDateFormat.parse(currentTimeStr);
                currentTimeCal.setTime(currentTimeDate);
                currentTimeCal.set(Calendar.YEAR, 2012);


                long durationLong = durationCal.getTimeInMillis() - timeRef;
                long currentTimeLong = currentTimeCal.getTimeInMillis() - timeRef;
                progress = Math.round(((float) currentTimeLong / durationLong) * 100);
                if (prevProgress >= 99) {
                    progress = 99;
                }
                prevProgress = progress;
                Log.e(COMPRESS_TAG, prevProgress + ",..");
            } catch (ParseException e) {
                Log.w(COMPRESS_TAG, e.getMessage());
            }
        }
        return progress;
    }


}