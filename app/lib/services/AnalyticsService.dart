import 'dart:developer';

import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_analytics/observer.dart';

class AnalyticsService {

  static FirebaseAnalytics analytics;
  static FirebaseAnalyticsObserver observer;

  static Future<void> sendEvent(String name, Map<String, dynamic> params) async {
    log('Debug: Sending analytics event $name - with params? ${params != null ? 'Yes' : 'No'}');
    await analytics.logEvent(name: name, parameters: params);
  }

  static void linkAnalyticsUser(String userId) {
    log('Debug: Linked user to Analytics service with uId: $userId');
    analytics.setUserId(userId);
  }

}