#import <React/RCTBridgeModule.h>
#import <AVFoundation/AVAssetExportSession.h>

@interface VideoTrim : NSObject <RCTBridgeModule>
@property (nonatomic, strong) AVAssetExportSession* exportSession;
@end
