//
//  UPPay.m
//  hack10000
//
//  Created by zheng hua on 16/1/22.
//  Copyright © 2016年 Facebook. All rights reserved.
//
#import "UPPay.h"
#import <Foundation/Foundation.h>
#import "RCTLog.h"
#import "RCTEventDispatcher.h"
#import "UPPaymentControl.h"
#import "AppDelegate.h"

@implementation UPPay

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:@"RCTOpenURLNotification" object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

RCT_EXPORT_METHOD(startPay:(NSString *)tn callback:(RCTResponseSenderBlock)callback)
{
  RCTLogInfo(@"tn:%@", tn);
  AppDelegate *delegate = (AppDelegate*)[[UIApplication sharedApplication] delegate];
  UIWindow *window = [delegate window];
  UIViewController *viewController = [window rootViewController];
  BOOL success = [[UPPaymentControl defaultControl] startPay:tn fromScheme:@"hack10000" mode:@"00" viewController:viewController];
  callback(@[success ? @"true" : @"false"]);
}

- (void)handleOpenURL:(NSNotification *)note
{
  NSDictionary *userInfo = note.userInfo;
  NSString *url = userInfo[@"url"];
  
  [[UPPaymentControl defaultControl] handlePaymentResult:[NSURL URLWithString:url] completeBlock:^(NSString *code, NSDictionary *data) {
      [self.bridge.eventDispatcher sendAppEventWithName:@"UPPay_Resp" body:code];
  }];
}

@end