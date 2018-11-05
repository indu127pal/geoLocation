//
//  GeoMethods.m
//  geoLocation
//
//  Created by Indu Pal on 25/10/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTBridge.h>
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "geoLocation-Bridging-Header.h"
#import <React/RCTEventEmitter.h>
#import <React/RCTEventDispatcher.h>

@interface RCT_EXTERN_MODULE(GeofenceModule, RCTEventEmitter)

//RCT_EXTERN_METHOD(setGeofenceValues:(float *)latitude longitude:(float *)longitude radius:(NSInteger *)radius id:(NSString *)id callback:(RCTResponseSenderBlock *)callback)

RCT_EXTERN_METHOD(setGeofenceValues:(NSArray *)dummyLocationList callback:(RCTResponseSenderBlock *)callback)

//RCT_EXTERN_METHOD(getDeviceToken:(RCTResponseSenderBlock *)callback)

@end
