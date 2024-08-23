#import "VideoTrim.h"
#import <AVFoundation/AVFoundation.h>
#import <AVFoundation/AVAsset.h>
#import <AVFoundation/AVAssetExportSession.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreMedia/CMTimeRange.h>

@implementation VideoTrim

RCT_EXPORT_MODULE()

static AVAssetExportSession* exportSession = nil;

RCT_EXPORT_METHOD(trim:(NSString *)filePath byQuality:(NSString*)compressQuality resolve:(RCTPromiseResolveBlock)resolve
reject:(RCTPromiseRejectBlock)reject)
{
    @try {
        filePath = [filePath stringByReplacingOccurrencesOfString:@"file://"
        withString:@""];
        
        NSString *preset = nil;
        if (compressQuality == nil || [compressQuality isEqualToString:@"medium"]) {
            preset = AVAssetExportPresetMediumQuality;
        } else if ([compressQuality isEqualToString:@"high"]) {
            preset = AVAssetExportPresetHighestQuality;
        } else if ([compressQuality isEqualToString:@"low"]) {
            preset = AVAssetExportPresetLowQuality;
        } else {
            preset = AVAssetExportPreset960x540;
        }
        
        // save to temp directory
        NSString* tempDirectory = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory,
                                                                       NSUserDomainMask,
                                                                       YES) lastObject];
        NSString *outputFilePath = [tempDirectory stringByAppendingPathComponent: [NSString stringWithFormat:@"%@.mp4", [[NSProcessInfo processInfo] globallyUniqueString]]];
        
        NSURL* inputURL = [NSURL fileURLWithPath:filePath];
        NSURL* outputURL = [NSURL fileURLWithPath:outputFilePath];
        
        [[NSFileManager defaultManager] removeItemAtURL:outputURL error:nil];
        AVURLAsset *asset = [AVURLAsset URLAssetWithURL:inputURL options:nil];
        exportSession = [[AVAssetExportSession alloc] initWithAsset:asset presetName:preset];
        exportSession.shouldOptimizeForNetworkUse = YES;
        exportSession.outputURL = outputURL;
        exportSession.outputFileType = AVFileTypeMPEG4;
        
        if(CMTimeGetSeconds(asset.duration) >= 60.0){
            CMTime startTime = CMTimeMake((int)(floor(0 * 100)), 100);
            CMTime stopTime = CMTimeMake((int)(ceil(60 * 100)), 100);
            CMTimeRange exportTimeRange = CMTimeRangeFromTimeToTime(startTime, stopTime);
            exportSession.timeRange = exportTimeRange;
        }
        [exportSession exportAsynchronouslyWithCompletionHandler:^(void) {
            if (exportSession.status == AVAssetExportSessionStatusCompleted)
            {
                exportSession = nil;
                if (resolve)
                    resolve(@{ @"path": outputFilePath });
            }
            else
            {
                exportSession = nil;
                if (reject) reject(@"Cannot compress video", nil, nil);
            }
        }];
    } @catch(NSException *e) {
        reject(e.reason, nil, nil);
    }
}

RCT_EXPORT_METHOD(cancel:(RCTPromiseResolveBlock)resolve
reject:(RCTPromiseRejectBlock)reject)
{
    if (exportSession == nil) {
        reject(@"No video processing", nil, nil);
    } else {
        [exportSession cancelExport];
        exportSession = nil;
        resolve(@{ @"success": @true });
    }
}

@end
